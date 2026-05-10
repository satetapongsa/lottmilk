# 🔱 LottoPro Intelligence: Core Python Brain

A standalone, professional statistical analysis engine designed for Thai Government Lottery data. This system uses advanced mathematical models to identify trends and patterns.

## 🚀 Core Features

- **Monte Carlo Simulations**: Runs 10,000 simulated draws per analysis.
- **Markov Chain Sequential Patterns**: Identifies numerical clusters and sequential trends.
- **Time-Weighted Analysis**: Prioritizes recent historical data for relevance.
- **Gap & Volatility Analysis**: Measures statistical intervals between appearances.

## 🛠️ Tech Stack

- **Engine**: Python, Pandas, NumPy
- **API Layer**: FastAPI, Uvicorn
- **Optional UI**: React Dashboard (App.jsx)

## 📦 Setup & Execution

### 1. Backend (Python)
```bash
pip install -r requirements.txt
python main.py
```
API runs on: `http://localhost:8000`

### 2. Frontend (React)
```bash
npm install
npm run dev
```
Dashboard runs on: `http://localhost:5173`
