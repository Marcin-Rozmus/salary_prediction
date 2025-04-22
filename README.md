# Salary Prediction Tool

A web application for predicting salary growth over the next 5 years based on current salary, market growth, and expected raises.

## Features

- Interactive salary range visualization
- Real-time salary predictions
- Market growth and raise percentage inputs
- Detailed 5-year salary forecast
- Visual representation of salary position in the market range

## Technologies Used

- Python
- Flask
- HTML/CSS
- JavaScript
- Chart.js

## Setup

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Update the `.env` file with your values:
   ```
   SALARY_MIN=0
   SALARY_MIN_MID=0
   SALARY_MID=0
   SALARY_MID_MAX=0
   SALARY_MAX=0
   CURRENT_SALARY=0
   MARKET_GROWTH=0
   RAISE=0
   ```

## Running the Application

1. Start the Flask server:
   ```bash
   python app.py
   ```
2. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Enter your current salary
2. Set the market salary ranges (MIN, MIN MID, MID, MID MAX, MAX)
3. Adjust market growth and raise percentages
4. Click "Predict" to see the 5-year forecast

## Project Structure

```
salary_prediction/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
├── .env.example       # Example environment variables
├── static/
│   ├── script.js      # Frontend JavaScript
│   └── style.css      # CSS styles
└── templates/
    └── index.html     # Main HTML template
``` 