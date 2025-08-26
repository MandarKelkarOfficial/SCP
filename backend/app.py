from flask import Flask, request, jsonify
from flask_cors import CORS
from careerjet_api import CareerjetAPIClient
import datetime
from email.utils import parsedate_to_datetime

app = Flask(__name__)
CORS(app)

@app.route('/jobs', methods=['GET'])
def get_jobs():
    keywords = request.args.get('keywords')
    if not keywords:
        return jsonify({"error": "Missing keywords"}), 400

    cj = CareerjetAPIClient()

   
    user_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if ',' in user_ip:
        user_ip = user_ip.split(',', 1)[0].strip()
    user_agent = request.headers.get('User-Agent', 'Mozilla/5.0')

    try:
        result = cj.search({
            'location': '',
            'keywords': keywords,
            'pagesize': 50,  
            'page': 1,
            'affid': '678bdee048', 
            'user_ip': user_ip,
            'url': 'http://localhost:8000',
            'user_agent': user_agent,
            'sort': 'date',
        })

      
        cutoff = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=24)
        jobs_last_24h = []

        for job in result.get("jobs", []):
            date_str = job.get("date")
            if not date_str:
                continue

            try:

                job_date = parsedate_to_datetime(date_str)
                if job_date.tzinfo is None:
                    job_date = job_date.replace(tzinfo=datetime.timezone.utc)
                else:
                    job_date = job_date.astimezone(datetime.timezone.utc)
            except Exception as e:
                app.logger.error(f"Error parsing date {date_str}: {e}")
                continue

            if job_date >= cutoff:
                jobs_last_24h.append({
                    "id": job.get("job_id", job.get("url")),
                    "title": job.get("title"),
                    "company": job.get("company"),
                    "locations": job.get("locations"),
                    "salary": job.get("salary", "N/A"),
                    "contracttype": job.get("contracttype", "N/A"),
                    "url": job.get("url"),
                    "date": job.get("date"),
                })

        return jsonify({"jobs": jobs_last_24h[:10]})  

    except Exception as e:
        app.logger.error(f"Careerjet API error: {str(e)}")
        return jsonify({"error": "Failed to fetch job listings"}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
