import os
from celery import Celery
from pymongo import MongoClient
from ocr_pipeline import full_pipeline
from dotenv import load_dotenv
import requests

load_dotenv()

CELERY_BROKER = os.environ.get("CELERY_BROKER", "redis://redis:6379/0")
cel = Celery("tasks", broker=CELERY_BROKER)

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://mongo:27017/smartcomp")
mongo = MongoClient(MONGO_URI)
db = mongo.get_database()

NODE_NOTIFY_URL = os.environ.get("NODE_NOTIFY_URL", "http://server:3000/api/certs/notify")

@cel.task(bind=True)
def process_document_async(self, doc_id, path):
    db.documents.update_one({"_id": doc_id}, {"$set": {"status":"processing"}})
    try:
        parsed = full_pipeline(path)  # returns structured dict
        parse_id = parsed.get("parse_id")
        db.parses.insert_one({"_id": parse_id, "doc_id": doc_id, **parsed})
        db.documents.update_one({"_id": doc_id}, {"$set":{"status":"processed","parse_id": parse_id}})

        # notify Node server for integration
        payload = {"doc_id": doc_id, "parse": parsed}
        try:
            resp = requests.post(NODE_NOTIFY_URL, json=payload, timeout=10)
            db.documents.update_one({"_id": doc_id}, {"$set": {"notified_node": resp.status_code}})
        except Exception as e:
            db.documents.update_one({"_id": doc_id}, {"$set": {"node_notify_error": str(e)}})

    except Exception as exc:
        db.documents.update_one({"_id": doc_id}, {"$set": {"status":"failed", "error": str(exc)}})
        raise self.retry(exc=exc, countdown=30, max_retries=3)
