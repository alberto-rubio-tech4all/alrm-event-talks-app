import flask
from flask import Flask, render_template, jsonify
import feedparser
import requests

app = Flask(__name__)

RSS_FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/releases')
def get_releases():
    try:
        feed = feedparser.parse(RSS_FEED_URL)
        releases = []
        for entry in feed.entries:
            releases.append({
                'title': entry.title,
                'link': entry.link,
                'published': entry.published if hasattr(entry, 'published') else 'No date',
                'summary': entry.summary
            })
        return jsonify(releases)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
