from flask import Flask, send_file
import json
import os

app = Flask(__name__)
DATA_DIR = "/data"

@app.route('/')
def index():
    try:
        with open(os.path.join(DATA_DIR, 'sesgo.json'), 'r') as f:
            data = json.load(f)
    except:
        data = {"ingresos_totales": 0, "poas_real": 0, "vqe_angulo": 0, "masa_critica": 0}
    
    # Cache busting para la imagen
    img_path = os.path.join(DATA_DIR, 'data/evolucion_total.png')
    mtime = os.path.getmtime(img_path) if os.path.exists(img_path) else 0

    html = f"""
    <html>
    <head>
        <title>SALAMANDRA HUB</title>
        <style>
            body {{ background: #050505; color: #00ff88; font-family: 'Courier New', monospace; padding: 20px; text-align: center; }}
            .card {{ border: 1px solid #00ff88; padding: 20px; border-radius: 10px; background: #000; display: inline-block; min-width: 250px; margin: 10px; box-shadow: 0 0 15px #00ff8822; }}
            .metric {{ font-size: 2.5em; font-weight: bold; }}
            .label {{ color: #ffffff; font-size: 0.8em; opacity: 0.6; text-transform: uppercase; }}
            img {{ border: 1px solid #00ff88; border-radius: 10px; margin-top: 20px; max-width: 95%; }}
            h1 {{ text-shadow: 0 0 10px #00ff88; }}
        </style>
    </head>
    <body>
        <h1>🦎 SALAMANDRA QUANTUM HUB</h1>
        <div class="card">
            <div class="label">Ingresos Reales</div>
            <div class="metric">${data.get('ingresos_totales', 0)}</div>
        </div>
        <div class="card">
            <div class="label">POAS</div>
            <div class="metric">{data.get('poas_real', 0)}</div>
        </div>
        <br>
        <img src="/graph?t={mtime}" alt="Evolución">
        <div style="margin-top:20px; color:#444;">VQE: {data.get('vqe_angulo', 0)} rad | Masa: {data.get('masa_critica', 0)}</div>
    </body>
    </html>
    """
    return html

@app.route('/graph')
def get_graph():
    path = os.path.join(DATA_DIR, 'data/evolucion_total.png')
    if os.path.exists(path):
        return send_file(path, mimetype='image/png')
    return "No image yet", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
