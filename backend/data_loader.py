#data_loader.py
from scipy.io import loadmat
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DB"),
        port=int(os.getenv("MYSQL_PORT", 3306))
    )

def load_mat(file_path, battery_id):
    mat = loadmat(file_path)
    conn = get_db_connection()
    cursor = conn.cursor()

    for i, cycle in enumerate(mat['cycle'][0]):
        op_type = cycle['type'][0]
        data = cycle['data']
        if op_type in ['charge', 'discharge']:
            voltage = data['Voltage_measured'][0][0][0]
            current = data['Current_measured'][0][0][0]
            temp = data['Temperature_measured'][0][0][0]
            time = data['Time'][0][0][0]
            capacity = (
                data['Capacity'][0][0][0]
                if 'Capacity' in data.dtype.names else
                [0] * len(voltage)
            )

            for v, c, t, cap, tm in zip(voltage, current, temp, capacity, time):
                cursor.execute("""
                    INSERT INTO battery_readings (battery_id, cycle, operation_type, voltage, current, temperature, capacity, time)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (battery_id, i, op_type, float(v), float(c), float(t), float(cap), float(tm)))

    conn.commit()
    cursor.close()
    conn.close()

# Optional CLI trigger
if __name__ == "__main__":
    load_mat("dataset/B0005.mat", "B0005")
    load_mat("dataset/B0006.mat", "B0006")
    load_mat("dataset/B0007.mat", "B0007")
    load_mat("dataset/B0018.mat", "B0018")
