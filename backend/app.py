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

@app.route('/api/battery/cells')
def get_cells():
    query = """
    SELECT battery_id, ROUND(AVG(voltage),2) AS avg_voltage, ROUND(AVG(capacity)*100,1) AS avg_soc,
           ROUND(AVG(temperature),1) AS avg_temperature, MAX(cycle) AS latest_cycle
    FROM battery_readings
    GROUP BY battery_id ORDER BY battery_id
    """
    result = execute_query(query)
    if result is None:
        return jsonify({'error': 'DB query failed'}), 500
    return jsonify({'cells': result})

@app.route('/api/battery/temperature')
def get_temperature():
    limit = request.args.get('limit', 20, type=int)
    query = """
    SELECT battery_id, temperature, time FROM battery_readings
    ORDER BY id DESC LIMIT %s
    """
    result = execute_query(query, (limit,))
    if result is None:
        return jsonify({'error': 'DB query failed'}), 500
    return jsonify({'temperature_data': result})

@app.route('/api/battery/overview')
def get_overview():
    query = """
    SELECT COUNT(DISTINCT battery_id) AS total_batteries,
           ROUND(AVG(voltage), 2) AS avg_voltage,
           ROUND(AVG(temperature), 1) AS avg_temperature,
           ROUND(AVG(capacity)*100, 1) AS avg_soc,
           MAX(cycle) AS max_cycle,
           MIN(voltage) AS min_voltage,
           MAX(voltage) AS max_voltage
    FROM battery_readings
    """
    result = execute_query(query)
    if not result:
        return jsonify({'error': 'DB query failed'}), 500
    overview = result[0]
    return jsonify(overview)

@app.route('/api/battery/alarms')
def get_alarms():
    query = """
    SELECT battery_id, voltage, temperature, current, time FROM battery_readings
    WHERE voltage < 3.0 OR voltage > 4.2 OR temperature < -10 OR temperature > 40 OR current > 5.0
    ORDER BY time DESC
    """
    result = execute_query(query)
    if not result:
        return jsonify({'error': 'DB query failed'}), 500
    return jsonify({'alarms': result})

if __name__ == '__main__':
    create_table = """
    CREATE TABLE IF NOT EXISTS battery_readings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        battery_id VARCHAR(50),
        cycle INT,
        operation_type VARCHAR(20),
        voltage FLOAT,
        current FLOAT,
        temperature FLOAT,
        capacity FLOAT,
        time FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_battery_id (battery_id),
        INDEX idx_time (time)
    )
    """
    execute_query(create_table, fetch=False)
    logger.info("Table checked/created.")
    app.run(debug=True)
