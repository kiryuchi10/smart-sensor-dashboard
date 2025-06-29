# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import execute_query
from datetime import datetime
from logging_config import setup_logger

app = Flask(__name__)
CORS(app)
logger = setup_logger(__name__)

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'BMS Dashboard API'
    })

@app.route('/api/battery/tables')
def get_tables():
    query = "SHOW TABLES"
    result = execute_query(query)
    if result is None:
        return jsonify({"error": "DB query failed"}), 500
    tables = [list(row.values())[0] for row in result]
    return jsonify({"tables": tables})

@app.route('/api/battery/data/<table_name>')
def get_battery_data_by_table(table_name):
    query = f"""
    SELECT battery_id, ROUND(AVG(voltage),2) AS avg_voltage, ROUND(AVG(capacity)*100,1) AS avg_soc,
           ROUND(AVG(temperature),1) AS avg_temperature, MAX(cycle) AS latest_cycle
    FROM `{table_name}`
    GROUP BY battery_id ORDER BY battery_id
    """
    result = execute_query(query)
    if result is None:
        return jsonify({'error': 'DB query failed'}), 500
    return jsonify({'cells': result})

@app.route('/api/battery/tables', methods=['GET'])
def get_battery_tables():
    query = "SHOW TABLES LIKE 'battery_%'"
    result = execute_query(query)
    if result is None:
        return jsonify({'error': 'Database query failed'}), 500

    tables = [list(row.values())[0] for row in result]
    return jsonify({'tables': tables})


if __name__ == '__main__':
    app.run(debug=True)
