# backend/data_loader.py
import os
import scipy.io
import pandas as pd
from logging_config import setup_logger
from database import insert_dataframe

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
                            insert_dataframe(df)
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

            for t, v, c, tm, cp in zip(time, voltage, current, temp, cap):
                records.append({
                    "battery_id": battery_id,
                    "cycle": i,
                    "operation": op_type,
                    "time": float(t),
                    "voltage": float(v),
                    "current": float(c),
                    "temperature": float(tm),
                    "capacity": float(cp)
                })

        return pd.DataFrame(records)