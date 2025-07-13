# test_backend.py
import requests
import time

API_BASE_URL = "http://localhost:5000/api"

def test_health():
    print("🔍 Testing /api/health ...")
    try:
        res = requests.get(f"{API_BASE_URL}/health")
        if res.status_code == 200:
            data = res.json()
            print("✅ Health check passed")
            print(f"   - Service: {data['service']}")
            print(f"   - Timestamp: {data['timestamp']}")
        else:
            print(f"❌ Health check failed: {res.status_code}")
    except Exception as e:
        print(f"❌ Exception in /api/health: {e}")

def test_battery_tables():
    print("\n🔍 Testing /api/battery/tables ...")
    try:
        res = requests.get(f"{API_BASE_URL}/battery/tables")
        if res.status_code == 200:
            tables = res.json().get("tables", [])
            print(f"✅ Found {len(tables)} battery tables:")
            for t in tables:
                print(f"   - {t}")
            return tables
        else:
            print(f"❌ Table fetch failed: {res.status_code}")
            return []
    except Exception as e:
        print(f"❌ Exception in /battery/tables: {e}")
        return []

def test_battery_data_by_table(table):
    print(f"\n🔍 Testing /api/battery/data/{table} ...")
    try:
        res = requests.get(f"{API_BASE_URL}/battery/data/{table}")
        if res.status_code == 200:
            cells = res.json().get("cells", [])
            print(f"✅ Data fetched for {table} → {len(cells)} entries")
            for cell in cells:
                print(f"   - ID: {cell['battery_id']}, Voltage: {cell['avg_voltage']}V, SoC: {cell['avg_soc']}%")
        else:
            print(f"❌ Failed for table {table}: {res.status_code}")
    except Exception as e:
        print(f"❌ Exception for {table}: {e}")

def test_all_cell_data(table):
    print(f"\n🔍 Testing /api/battery/cells?table={table} ...")
    try:
        res = requests.get(f"{API_BASE_URL}/battery/cells", params={"table": table})
        if res.status_code == 200:
            cells = res.json().get("cells", [])
            print(f"✅ Retrieved {len(cells)} recent cell entries from {table}")
            for c in cells[:5]:  # Print top 5 entries
                print(f"   - Cycle: {c['cycle']}, Voltage: {c['voltage']}, SoC: {c['soc']}, Temp: {c['temperature']}")
        else:
            print(f"❌ /cells failed for {table}: {res.status_code}")
    except Exception as e:
        print(f"❌ Exception fetching cells: {e}")

def test_battery_cards():
    print("\n🔍 Testing /api/battery/cards ...")
    try:
        res = requests.get(f"{API_BASE_URL}/battery/cards")
        if res.status_code == 200:
            cards = res.json().get("cards", [])
            print(f"✅ Retrieved {len(cards)} battery cards:")
            for card in cards:
                print(f"   - {card['id']}: Voltage={card['voltage']}V, SoC={card['soc']}%")
        else:
            print(f"❌ Cards endpoint failed: {res.status_code}")
    except Exception as e:
        print(f"❌ Exception in /battery/cards: {e}")

def run_all_tests():
    print("🚀 Running all backend tests for BMS Dashboard API...\n")
    test_health()

    tables = test_battery_tables()
    if tables:
        for table in tables:
            test_battery_data_by_table(table)
            test_all_cell_data(table)

    test_battery_cards()

    print("\n🎉 All backend API tests completed.")

if __name__ == "__main__":
    try:
        run_all_tests()
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is Flask running at localhost:5000?")
