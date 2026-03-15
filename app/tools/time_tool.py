from datetime import datetime
from zoneinfo import ZoneInfo

def get_current_time(timezone: str = "America/Sao_Paulo") -> dict:
    now = datetime.now(ZoneInfo(timezone))
    return {
        "date": now.strftime("%d/%m/%Y"),
        "time": now.strftime("%H:%M:%S"),
        "timezone": str(now.tzinfo),
}

def get_brazil_time() -> str:
    current = get_current_time("America/Sao_Paulo")
    return f"{current['date']} {current['time']} ({current['timezone']})"
