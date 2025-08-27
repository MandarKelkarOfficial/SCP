import os, uuid, re
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
import cv2
import numpy as np
from rapidfuzz import fuzz

def _preprocess_cv2(pil_img):
    img = np.array(pil_img.convert('RGB'))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # denoise
    den = cv2.fastNlMeansDenoising(gray, None, 7, 21, 7)
    # adaptive threshold
    th = cv2.adaptiveThreshold(den,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,11,2)
    # deskew
    coords = np.column_stack(np.where(th > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = th.shape[:2]
    center = (w//2, h//2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(th, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return Image.fromarray(rotated)

def _ocr_image(pil_img):
    # returns word-level data
    data = pytesseract.image_to_data(pil_img, output_type=pytesseract.Output.DICT)
    text = pytesseract.image_to_string(pil_img)
    return {"text": text, "data": data}

def extract_subjects_from_text(text):
    # heuristic: find lines with subject-like words followed by numbers (marks)
    subjects = []
    for line in text.splitlines():
        line = line.strip()
        # e.g., "Mathematics 92 100"
        m = re.search(r'([A-Za-z &\-/]+)\s+(\d{1,3})(?:\s*/\s*(\d{1,3}))?', line)
        if m:
            subj = m.group(1).strip()
            marks = int(m.group(2))
            maxm = int(m.group(3)) if m.group(3) else 100
            subjects.append({"name": subj, "marks_obtained": marks, "max_marks": maxm})
    return subjects

def parse_name_roll(text):
    # look for "Name" and "Roll" patterns
    name = None
    roll = None
    for line in text.splitlines():
        if 'name' in line.lower():
            # take characters after colon
            parts = line.split(':')
            if len(parts) > 1:
                name = parts[1].strip()
        if re.search(r'\b(roll|seat|reg)\b', line.lower()):
            parts = re.split(r'[:\s]\s*', line)
            # fallback: extract last token digits
            digits = re.findall(r'([A-Z0-9-]{5,})', line)
            if digits:
                roll = digits[-1]
    # fallback heuristics
    if not name:
        # choose first non-empty line with title-case > 1 words
        for line in text.splitlines():
            parts = line.strip().split()
            if len(parts) >= 2 and all(w[0].isupper() for w in parts if w):
                name = line.strip()
                break
    return name, roll

def full_pipeline(path):
    parse_id = str(uuid.uuid4())
    pages = []
    if path.lower().endswith('.pdf'):
        pages = convert_from_path(path, dpi=300)
    else:
        pages = [Image.open(path).convert('RGB')]

    combined_text = []
    all_data = []
    for p in pages:
        pre = _preprocess_cv2(p)
        o = _ocr_image(pre)
        combined_text.append(o["text"])
        all_data.append(o["data"])

    text = "\n".join(combined_text)
    name, roll = parse_name_roll(text)
    subjects = extract_subjects_from_text(text)
    percentage = None
    if subjects:
        tot = sum([s['marks_obtained'] for s in subjects])
        max_tot = sum([s['max_marks'] for s in subjects])
        percentage = round((tot/max_tot)*100, 2) if max_tot else None

    # confidence heuristics (very simple)
    conf = {
        "name_conf": 0.95 if name else 0.4,
        "roll_conf": 0.95 if roll else 0.3,
        "subjects_conf": 0.8 if subjects else 0.2
    }

    parsed = {
        "parse_id": parse_id,
        "name": name,
        "roll_number": roll,
        "subjects": subjects,
        "percentage": percentage,
        "raw_text": text,
        "confidence": conf
    }
    return parsed
