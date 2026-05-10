from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import os
import glob
from bs4 import BeautifulSoup
from urllib.request import urlopen

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def get_lotto_df(data_dir='./lottonumbers'):
    files = sorted(glob.glob(os.path.join(data_dir, '*.txt')))
    rows = []
    for file in files:
        date_str = os.path.basename(file).replace('.txt', '')
        try:
            with open(file, 'r', encoding='utf-8') as f: lines = [l.strip() for l in f.readlines()]
        except:
            with open(file, 'r', encoding='latin-1') as f: lines = [l.strip() for l in f.readlines()]
        row = {'date': date_str}
        for line in lines[1:]:
            data = line.split()
            if not data: continue
            if data[0] == 'FIRST': row['top2'] = data[1][-2:] if len(data[1]) >= 2 else None
            elif data[0] == 'TWO': row['bottom2'] = data[1]
        rows.append(row)
    df = pd.DataFrame(rows).dropna(subset=['top2', 'bottom2'])
    df['date'] = pd.to_datetime(df['date'])
    df['top2'] = df['top2'].apply(lambda x: str(x).zfill(2))
    df['bottom2'] = df['bottom2'].apply(lambda x: str(x).zfill(2))
    return df.sort_values('date')

df = get_lotto_df()

def calculate_frequencies(series):
    return series.value_counts().reindex([str(i).zfill(2) for i in range(100)], fill_value=0)

def predict_next_ma(series, window=10):
    ma = series.astype(int).rolling(window=window).mean().iloc[-1]
    return str(int(round(ma))).zfill(2) if not np.isnan(ma) else None

class AlphaEngine:
    def __init__(self, df): self.df = df
    def predict(self, col):
        series = self.df[col].astype(int).values
        weights = (np.bincount(series, minlength=100) * 0.5) + (np.bincount(series[-24:], minlength=100) * 5.0) + 1e-6
        probs = (np.bincount(np.random.choice(np.arange(100), size=10000, p=weights/weights.sum()), minlength=100) / 10000) * 100
        indices = np.argsort(probs)[::-1]
        return [{"number": str(idx).zfill(2), "probability": round(probs[idx], 2)} for idx in indices[:5]]

@app.get("/api/summary")
def get_summary():
    last = df.iloc[-1]
    return {"last_date": last['date'].strftime('%d %b %Y'), "last_top2": last['top2'], "last_bottom2": last['bottom2'], "total_draws": len(df)}

@app.get("/api/history")
def get_history():
    recent = df.tail(10).iloc[::-1].copy()
    recent['date'] = recent['date'].dt.strftime('%Y-%m-%d')
    return recent.to_dict(orient='records')

@app.get("/api/predictions")
def get_predictions(window: int = 10):
    p_top = predict_next_ma(df['top2'], window)
    p_bot = predict_next_ma(df['bottom2'], window)
    f_top = calculate_frequencies(df['top2'])
    f_bot = calculate_frequencies(df['bottom2'])
    return {"ma": {"top2": p_top, "bottom2": p_bot}, "prob": {"top2": {"num": f_top.idxmax(), "prob": float(f_top.max()/len(df))}, "bottom2": {"num": f_bot.idxmax(), "prob": float(f_bot.max()/len(df))}}}

@app.get("/api/alpha-prediction")
def get_alpha():
    engine = AlphaEngine(df)
    return {"top2": engine.predict('top2'), "bottom2": engine.predict('bottom2')}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
