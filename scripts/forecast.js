import { kelvinToCelsius, speedKmh, gustKmh, getDayOfWeek } from "./utils";

export function clearForecastContainer() {
    const forecastContainer = document.getElementById('fftw');
    forecastContainer.innerHTML = ''; // Limpar o conteúdo do contêiner
}
  
export function get5DayForecast(forecasts) {
    const dayOfWeek = getDayOfWeek();
    const result = {};
  
    forecasts.forEach((item) => {
      const expectedDate = new Date(item.dt * 1000);
      const day = expectedDate.getDay();
  
      if (day === dayOfWeek) {
        
        if (!result.today) {
          result.today = {
            temp: kelvinToCelsius(item.main.temp).toFixed(0),
            wind: {
              speed: speedKmh(item.wind.speed).toFixed(1),
              deg: item.wind.deg,
              gust: gustKmh(item.wind.gust).toFixed(1),
            },
            weather:{
              main: item.weather[0].main,
              description: item.weather[0].description,
              icon:item.weather[0].icon,
            },
          };
        }
      }
  
      if (day !== dayOfWeek && day > dayOfWeek) {
        const dayName = expectedDate.toLocaleDateString("pt-BR", {day:'2-digit', month:'2-digit'});
        if (!result[dayName]) {
          result[dayName] = {
            tempMin: Infinity,
            tempMax: -Infinity,
          };
        }
  
        const tempMin = kelvinToCelsius(item.main.temp_min);
        const tempMax = kelvinToCelsius(item.main.temp_max);
  
        if (tempMin < result[dayName].tempMin) {
          result[dayName].tempMin = tempMin;
        }
  
        if (tempMax > result[dayName].tempMax) {
          result[dayName].tempMax = tempMax;
        }
  
      }
    });
  
    return result;
}