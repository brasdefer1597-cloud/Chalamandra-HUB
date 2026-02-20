import json
import secrets
import time
from pathlib import Path

STATUS_PATH = Path(__file__).resolve().parents[1] / 'public' / 'status.json'


def generar_llave_temporal() -> tuple[str, int]:
    nueva_llave = secrets.token_hex(4).upper()
    expiracion = int(time.time()) + 3600
    return nueva_llave, expiracion


def format_countdown(expiracion: int) -> str:
    left = max(0, expiracion - int(time.time()))
    mm, ss = divmod(left, 60)
    return f"{mm:02d}:{ss:02d}"


def main() -> None:
    base = {}
    if STATUS_PATH.exists():
        base = json.loads(STATUS_PATH.read_text())

    llave, expiracion = generar_llave_temporal()
    poas = float(base.get('poas', 0.6))
    if format_countdown(expiracion).startswith('09:'):
        poas = max(poas, 1.4)

    status = {
        **base,
        'status': 'online',
        'system_status': 'online',
        'ultima_llave': llave,
        'llave_expiracion': expiracion,
        'countdown': format_countdown(expiracion),
        'poas': poas,
        'updated_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }

    STATUS_PATH.write_text(json.dumps(status, indent=2, ensure_ascii=False) + '\n')
    print(f"[scarcity] llave={llave} expira={expiracion} countdown={status['countdown']}")


if __name__ == '__main__':
    main()
