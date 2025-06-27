# backend/logging_config.py
import logging
import sys

def setup_logger(name=__name__):
    logger = logging.getLogger(name)
    if not logger.hasHandlers():
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger


# backend/database.py
import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
from logging_config import setup_logger

load_dotenv()
logger = setup_logger(__name__)

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '12345'),
    'database': os.getenv('DB_NAME', 'bms_data'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Error as e:
        logger.error(f"Database connection error: {e}")
        return None

def execute_query(query, params=None, fetch=True):
    connection = get_db_connection()
    if not connection:
        return None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params or ())
        if fetch:
            result = cursor.fetchall()
        else:
            connection.commit()
            result = cursor.rowcount
        return result
    except Error as e:
        logger.error(f"Query execution error: {e}")
        return None
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def insert_dataframe(df):
    if df.empty:
        logger.warning("Empty DataFrame, skipping insert.")
        return
    insert_query = """
        INSERT INTO battery_readings (battery_id, cycle, operation_type, voltage, current, temperature, capacity, time)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    rows = df.to_records(index=False)
    values = [(
        row.battery_id, row.cycle, row.operation,
        row.voltage, row.current, row.temperature,
        row.capacity, row.time
    ) for row in rows]

    connection = get_db_connection()
    if not connection:
        return
    try:
        cursor = connection.cursor()
        cursor.executemany(insert_query, values)
        connection.commit()
        logger.info(f"Inserted {cursor.rowcount} rows into database.")
    except Error as e:
        logger.error(f"Insert error: {e}")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()