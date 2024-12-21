from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Get API key from environment variable
API_KEY = os.getenv('MAKCORPS_API_KEY')
BASE_URL = "https://api.makcorps.com/"

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/mapping')
def mapping():
    return render_template('mapping.html')

@app.route('/account')
def account():
    return render_template('account.html')

@app.route('/api/hotel-prices')
def get_hotel_prices():
    hotel_id = request.args.get('hotel_id')
    if not hotel_id:
        return jsonify({"error": "Hotel ID is required"}), 400

    url = f"{BASE_URL}/hotels/{hotel_id}/prices"
    headers = {"Authorization": f"Bearer {API_KEY}"}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/mapping')
def get_mapping():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Name is required"}), 400

    url = f"{BASE_URL}/mapping"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    params = {"name": name}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/account')
def get_account_info():
    url = f"{BASE_URL}/account"
    headers = {"Authorization": f"Bearer {API_KEY}"}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

