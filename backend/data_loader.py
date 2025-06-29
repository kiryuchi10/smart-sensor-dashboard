# backend/data_loader.py
import os
import scipy.io
import pandas as pd
from logging_config import setup_logger
from database import execute_query, get_db_connection

logger = setup_logger(__name__)

class MatToDataFrame:
    def __init__(self, folder_path):
        self.folder_path = folder_path
        self.dataframes = {}  # maps 'B0005' → DataFrame

    def load_all(self, insert_to_db=True):
        for file in os.listdir(self.folder_path):
            if file.endswith(".mat"):
                file_path = os.path.join(self.folder_path, file)
                key = os.path.splitext(file)[0]  # e.g. B0005
                try:
                    mat = scipy.io.loadmat(file_path)
                    if key in mat and 'cycle' in mat[key].dtype.names:
                        cycles = mat[key]['cycle'][0][0]
                        df = self.parse_cycles(cycles, key)
                        self.dataframes[key] = df
                        logger.info(f"Loaded {key}: {len(df)} records")
                        if insert_to_db:
                            self.insert_dataframe(df)
                    else:
                        logger.warning(f"{key} does not contain 'cycle'")
                except Exception as e:
                    logger.error(f"Error loading {file}: {e}")
        return self.dataframes

    def parse_cycles(self, cycles, battery_id):
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
            socs = [(c / max_cap) if max_cap else 0 for c in cap]

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
                    "soc": float(round(soc * 100, 2))
                })

        return pd.DataFrame(records)

    def insert_dataframe(self, df):
        if df.empty:
            logger.warning("Empty DataFrame, skipping insert.")
            return

        for battery_id, group_df in df.groupby("battery_id"):
            table_name = f"battery_{battery_id.lower()}"
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
                INSERT INTO `{table_name}` (battery_id, cycle, operation_type, voltage, current, temperature, capacity, soc, time)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            rows = group_df.to_records(index=False)
            values = [(
                row.battery_id, row.cycle, row.operation_type,
                row.voltage, row.current, row.temperature,
                row.capacity, row.soc, row.time
            ) for row in rows]

            conn = get_db_connection()
            if conn:
                try:
                    cursor = conn.cursor()
                    cursor.executemany(insert_query, values)
                    conn.commit()
                    logger.info(f"Inserted {cursor.rowcount} rows into `{table_name}`")
                except Exception as e:
                    logger.error(f"Insert error: {e}")
                finally:
                    cursor.close()
                    conn.close()