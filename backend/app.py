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

@app.route('/api/battery/tables', methods=['GET'])
def get_battery_tables():
    # List all battery_* tables
    query = "SHOW TABLES LIKE 'battery_%'"
    result = execute_query(query)
    if result is None:
        return jsonify({'error': 'Database query failed'}), 500

    tables = [list(row.values())[0] for row in result if row]
    return jsonify({'tables': tables})

@app.route('/api/battery/data/<table_name>', methods=['GET'])
def get_battery_data_by_table(table_name):
    query = f"""
    SELECT battery_id,
           ROUND(AVG(voltage),2) AS avg_voltage,
           ROUND(AVG(soc),1) AS avg_soc,
           ROUND(AVG(temperature),1) AS avg_temperature,
           MAX(cycle) AS latest_cycle
    FROM `{table_name}`
    GROUP BY battery_id
    ORDER BY battery_id
    """
    result = execute_query(query)
    if result is None:
        return jsonify({'error': 'DB query failed'}), 500
    return jsonify({'cells': result})

@app.route('/api/battery/cells', methods=['GET'])
def get_all_cell_data():
    table = request.args.get('table')
    if not table:
        return jsonify({'error': 'Missing table name'}), 400

    query = f"""
    SELECT id, battery_id, voltage, soc, temperature, cycle, time
    FROM `{table}`
    ORDER BY id DESC LIMIT 20
    """
    result = execute_query(query)
    if result is None:
        return jsonify({'error': 'DB query failed'}), 500
    return jsonify({'cells': result})

@app.route('/api/battery/cards', methods=['GET'])
def get_battery_cards():
    tables = ['battery_b0005', 'battery_b0006', 'battery_b0007', 'battery_b0018']
    response = []

    for table in tables:
        query = f"""
        SELECT battery_id,
               ROUND(AVG(voltage),2) as voltage,
               ROUND(AVG(soc),2) as soc
        FROM `{table}`
        GROUP BY battery_id
        LIMIT 1
        """
        result = execute_query(query)

        if result:
            response.append({
                "id": table.replace("battery_", "").upper(),
                "voltage": result[0]["voltage"],
                "soc": result[0]["soc"]
            })
        else:
            logger.warning(f"[{table}] No result returned from DB.")

    if not response:
        return jsonify({"error": "No card data found"}), 404

    return jsonify({"cards": response})

@app.route('/api/battery/enhanced-cells', methods=['GET'])
def get_enhanced_cell_data():
    """Get enhanced cell data for the new UI with individual cell information"""
    tables = ['battery_b0005', 'battery_b0006', 'battery_b0007']
    all_cells = []
    
    for i, table in enumerate(tables):
        query = f"""
        SELECT 
            battery_id,
            ROUND(voltage, 3) as voltage,
            ROUND(soc, 1) as soc,
            ROUND(temperature, 1) as temperature,
            cycle,
            time,
            created_at
        FROM `{table}`
        ORDER BY id DESC 
        LIMIT 4
        """
        result = execute_query(query)
        
        if result:
            for j, cell in enumerate(result):
                cell_id = f"E{i*4 + j + 1}"  # Generate E1, E2, E3... E12
                all_cells.append({
                    "cell_id": cell_id,
                    "battery_id": cell["battery_id"],
                    "voltage": float(cell["voltage"]),
                    "soc": float(cell["soc"]),
                    "temperature": float(cell["temperature"]),
                    "cycle": cell["cycle"],
                    "timestamp": cell["created_at"].isoformat() if cell["created_at"] else None
                })
    
    return jsonify({
        "cells": all_cells,
        "total_cells": len(all_cells),
        "timestamp": datetime.now().isoformat()
    })



if __name__ == '__main__':
    app.run(debug=True)
