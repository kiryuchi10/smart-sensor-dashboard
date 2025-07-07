import os
import scipy.io
import pandas as pd
from database import execute_query, get_db_connection
from logging_config import setup_logger

logger = setup_logger(__name__)

def parse_cycles(cycles, battery_id):
    records = []
    for i, cycle in enumerate(cycles[0]):
        op_type = cycle['type'][0]
        if op_type not in ['charge', 'discharge']:
            continue

        data = cycle['data']
        time = data['Time'][0][0][0]
        voltage = data['Voltage_measured'][0][0][0]
        current = data['Current_measured'][0][0][0]
        temp = data['Temperature_measured'][0][0][0]
        cap = data['Capacity'][0][0][0] if 'Capacity' in data.dtype.names else [0] * len(time)

        max_cap = max(cap) if len(cap) > 0 else 1
        socs = [(c / max_cap) * 100 if max_cap else 0 for c in cap]

        for t, v, c, tm, cp, soc in zip(time, voltage, current, temp, cap, socs):
            records.append({
                "battery_id": battery_id,
                "cycle": i,
                "operation_type": op_type,
                "time": float(t),
                "voltage": float(v),
                "current": float(c),
                "temperature": float(tm),
                "capacity": float(cp),
                "soc": float(round(soc, 2))
            })

    return pd.DataFrame(records)

def insert_dataframe(df, battery_id):
    if df.empty:
        logger.warning(f"[{battery_id}] Empty DataFrame, skipping insert.")
        return

    table_name = f"battery_{battery_id.lower()}"
    logger.info(f"Inserting {len(df)} rows into `{table_name}`")

    create_table_query = f"""
        CREATE TABLE IF NOT EXISTS `{table_name}` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            battery_id VARCHAR(50),
            cycle INT,
            operation_type VARCHAR(20),
            voltage FLOAT,
            current FLOAT,
            temperature FLOAT,
            capacity FLOAT,
            soc FLOAT,
            time FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_battery_id (battery_id),
            INDEX idx_time (time)
        )
    """
    execute_query(create_table_query, fetch=False)

    insert_query = f"""
        INSERT INTO `{table_name}` (
            battery_id, cycle, operation_type, voltage, current,
            temperature, capacity, soc, time
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = [
        (
            row["battery_id"], row["cycle"], row["operation_type"],
            row["voltage"], row["current"], row["temperature"],
            row["capacity"], row["soc"], row["time"]
        ) for _, row in df.iterrows()
    ]

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.executemany(insert_query, values)
            conn.commit()
            logger.info(f"Inserted {cursor.rowcount} rows into `{table_name}`.")
        except Exception as e:
            logger.error(f"Insert error in `{table_name}`: {e}")
        finally:
            cursor.close()
            conn.close()

def load_all_mat_files(folder_path):
    all_dataframes = {}
    for file in os.listdir(folder_path):
        if not file.endswith(".mat"):
            continue
        file_path = os.path.join(folder_path, file)
        battery_id = os.path.splitext(file)[0]

        try:
            mat = scipy.io.loadmat(file_path)
            if battery_id in mat and 'cycle' in mat[battery_id].dtype.names:
                cycles = mat[battery_id]['cycle'][0][0]
                df = parse_cycles(cycles, battery_id)
                all_dataframes[battery_id] = df
                logger.info(f"Parsed {battery_id}: {len(df)} rows")

                insert_dataframe(df, battery_id)
            else:
                logger.warning(f"{battery_id} missing 'cycle' key in MAT structure.")
        except Exception as e:
            logger.error(f"Failed to load {file}: {e}")
    return all_dataframes

if __name__ == "__main__":
    mat_folder = r"C:\Users\user\Downloads\BMS_SENSOR_DASHBOARD_PROJECT\Dataset\5. Battery Data Set\1. BatteryAgingARC-FY08Q4"
    logger.info(f"Scanning folder: {mat_folder}")
    load_all_mat_files(mat_folder)
