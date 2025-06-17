from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import mysql.connector
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DB"),
        port=int(os.getenv("MYSQL_PORT", 3306))
    )

@app.route("/api/battery/cells")
def get_cells():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT battery_id, AVG(voltage) as voltage, AVG(capacity)*100 as soc
        FROM battery_readings
        GROUP BY battery_id
        ORDER BY battery_id
    """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

@app.route("/api/battery/temperature")
def get_temperature():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT temperature FROM battery_readings
        ORDER BY id DESC LIMIT 20
    """)
    temps = [row["temperature"] for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(temps)
