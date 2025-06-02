import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")

def get_weather(lat, lon):
    """
    Consulta a previsão de chuva para as próximas 24h usando OpenWeatherMap.
    Retorna precipitação prevista em mm.
    """
    url = (
        f"https://api.openweathermap.org/data/2.5/forecast?"
        f"lat={lat}&lon={lon}&appid={API_KEY}&units=metric&cnt=8"
    )

    response = requests.get(url)
    data = response.json()

    chuva_total = 0.0
    for entrada in data.get("list", []):
        chuva = entrada.get("rain", {}).get("3h", 0.0)
        chuva_total += chuva

    return round(chuva_total, 2)
