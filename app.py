from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os

# Załaduj zmienne środowiskowe z pliku .env
load_dotenv()

app = Flask(__name__)


def get_env_int(key, default=0):
    """Pobiera wartość ze zmiennych środowiskowych i konwertuje na int"""
    try:
        return int(os.getenv(key, default))
    except (TypeError, ValueError):
        return default


@app.route("/")
def index():
    # Pobierz wartości z .env lub użyj domyślnych (0)
    initial_values = {
        "min": get_env_int("SALARY_MIN"),
        "min_mid": get_env_int("SALARY_MIN_MID"),
        "mid": get_env_int("SALARY_MID"),
        "mid_max": get_env_int("SALARY_MID_MAX"),
        "max": get_env_int("SALARY_MAX"),
        "current_salary": get_env_int("CURRENT_SALARY"),
        "market_growth": get_env_int("MARKET_GROWTH"),
        "raise": get_env_int("RAISE"),
    }
    return render_template("index.html", values=initial_values)


def calculate_salary_prediction(
    current_salary, market_growth, raise_percentage, years=6
):
    predictions = []
    current_year = 2025

    # Pobierz wartości z formularza dla pierwszego roku
    min = float(request.json.get("min", current_salary))
    min_mid = float(request.json.get("minMid", current_salary * 1.2))
    mid = float(request.json.get("mid", current_salary * 1.4))
    mid_max = float(request.json.get("midMax", current_salary * 1.6))
    max = float(request.json.get("max", current_salary * 1.8))

    # Pierwszy rok (2025) - użyj dokładnie tych samych wartości co na górze
    year_data = {
        "year": current_year,
        "current_salary": current_salary,
        "min": min,
        "min_mid": min_mid,
        "mid": mid,
        "mid_max": mid_max,
        "max": max,
    }
    predictions.append(year_data)

    # Kolejne lata (2026-2030) - oblicz z uwzględnieniem wzrostu
    for year in range(1, years):
        current_salary *= 1 + raise_percentage / 100
        year_data = {
            "year": current_year + year,
            "current_salary": current_salary,
            "min": min * (1 + market_growth / 100) ** year,
            "min_mid": min_mid * (1 + market_growth / 100) ** year,
            "mid": mid * (1 + market_growth / 100) ** year,
            "mid_max": mid_max * (1 + market_growth / 100) ** year,
            "max": max * (1 + market_growth / 100) ** year,
        }
        predictions.append(year_data)

    return predictions


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    predictions = calculate_salary_prediction(
        data["currentSalary"], data["marketGrowth"], data["raise"]
    )
    return jsonify({"predictions": predictions})


if __name__ == "__main__":
    app.run(debug=True)
