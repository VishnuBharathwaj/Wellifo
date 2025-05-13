from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Load dataset
file_path = r"C:\VISHNU_VIT\SEM\SEM 8\Capstone\wellifo\src\backend\medicine_search\updated_indian_medicine_data.csv"
df = pd.read_csv(file_path)
df.fillna("Not Available", inplace=True)  # Replace NaN values with "Not Available"

@app.route("/search", methods=["GET"])
def search_medicine():
    """Return medicine names that start with the query"""
    query = request.args.get("query", "").strip().lower()
    if not query:
        return jsonify([])
    filtered_df = df[df["name"].str.lower().str.startswith(query)]
    suggestions = filtered_df[["name"]].to_dict(orient="records")
    return jsonify(suggestions)

@app.route("/medicine/<name>", methods=["GET"])
def get_medicine_details(name):
    """Return details of a selected medicine"""
    medicine = df[df["name"].str.lower() == name.lower()]
    if medicine.empty:
        return jsonify({"error": "Medicine not found"}), 404

    details = medicine.iloc[0].to_dict()
    return jsonify(details)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
