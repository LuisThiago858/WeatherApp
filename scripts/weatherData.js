function mySearch(){
  var inputValue=document.querySelector('#myInput').value;
  const city_name=inputValue;
  const api_key = "09cbafb7a5f7a20c8584da68c2163415";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${api_key}`;
  
  function kelvinToCelsius(tempKelvin) {
    return tempKelvin - 273.15;
  }
  
  function speedKmh(tempSpeed){
    return tempSpeed * 3.6;
  }
  
  function gustKmh(tempGust){
    return tempGust * 3.6;
  }
  
  function getDayOfWeek() {
    const today = new Date();
    return today.getDay();
  }

  function clearForecastContainer() {
    const forecastContainer = document.getElementById('fftw');
    forecastContainer.innerHTML = ''; // Limpar o conteúdo do contêiner
  }
  
  function get5DayForecast(forecasts) {
    const dayOfWeek = getDayOfWeek();
    const result = {};
  
    forecasts.forEach((item) => {
      const expectedDate = new Date(item.dt * 1000);
      const day = expectedDate.getDay();
  
      if (day === dayOfWeek) {
        // Se for o dia atual, armazena a temperatura, vento e rajada de vento atuais
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
  
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao obter os dados do clima");
      }
      return response.json();
    })
    .then((data) => {
  
      console.log(data);
      
      const forecast = data.list;
      const next5DayForecast = get5DayForecast(forecast);
      
      if(next5DayForecast.today){
        //apaga as informacoes anteriores
        clearForecastContainer();
        // Imprimir informações de temperatura, vento e rajada de vento para o dia atual
        const { temp, wind, weather } = next5DayForecast.today;
        console.log(`Condições atuais em ${city_name}:`);
        console.log(`   - Temperatura atual: ${temp}°C`);
        console.log(`   - Velocidade do vento atual: ${wind.speed} m/s`);
        console.log(`   - Direção do vento atual: ${wind.deg}°`);
        console.log(`   - Rajada de vento atual: ${wind.gust} m/s`);
        console.log(`   - O clima atual é: ${weather.main}`);
        console.log(`   - Descrição: ${weather.description}`);
        console.log(`   - Turno: ${weather.icon}`);
  
        var tempCityMain=document.querySelector('#temp-city-main');
        tempCityMain.textContent=city_name;
        var tempMain=document.querySelector('#temp-main');
        tempMain.textContent=temp+'°';

        var tempNewMain=document.querySelector('#temp-main-new');
        tempNewMain.textContent=weather.main;
        var tempNewDescription=document.querySelector('#temp-description-new');
        tempNewDescription.textContent=weather.description;

        var tempSpeed=document.querySelector('#speed-wind');
        tempSpeed.textContent=wind.speed+' km/h';
        var tempWindDeg=document.querySelector('#wind-direction');
        tempWindDeg.textContent=wind.deg+' °';
        var tempWindGust=document.querySelector('#gust-of-wind');
        tempWindGust.textContent=wind.gust+' km/h';


        
        
        if(weather && weather.main){
          const primCard = document.querySelector('#card-principal1');
          var cloudImage = document.querySelector('.clouds-city');
          var timeOfDay = weather.icon ? weather.icon.charAt(weather.icon.length - 1): '';

          if(timeOfDay==='d'){
            primCard.classList.remove('card-principal-night');
            primCard.classList.add('card-principal');
          }else if(timeOfDay==='n'){  
            primCard.classList.remove('card-principal');
            primCard.classList.add('card-principal-night');
          }else{
            console.error('Valor inesperado para timeOfDay:', timeOfDay);
          }


          console.log('Valor de timeOfDay:', timeOfDay);
          console.log('Classes antes:', primCard.classList);

          // Lógica de adição/remoção de classes aqui

          console.log('Classes depois:', primCard.classList);




          if(weather.main==='Clear'){
            if(weather.description==='clear sky'){ 
              cloudImage.src='./assets/sun.png';
            }
          }else if (weather.main === 'Clouds') {
            if (weather.description === 'few clouds' || weather.description === 'scattered clouds') {
              cloudImage.src = './assets/cloudy.png'; 
            }else if (weather.description === 'broken clouds' || weather.description === 'overcast clouds') {
              cloudImage.src = './assets/cloud.png';  
            }
          }else if(weather.main==='Rain' ){
            cloudImage.src = './assets/rain.png'; 
          }else if(weather.main==='Drizzle'){
            cloudImage.src = './assets/rain (1).png'; 
          }else if(weather.main==='Thunderstorm'){
            cloudImage.src = './assets/storm.png';    
          }else if(weather.main==='Snow'){
            cloudImage.src = './assets/snow.png'; 
          }else if(weather.main==='Mist'){
            cloudImage.src = './assets/mist.png';
          }
        }
       

  
        // Imprimir as previsões para os próximos dias
        Object.keys(next5DayForecast).forEach((day) => {
            if (day !== "today") {
              const { tempMin, tempMax} = next5DayForecast[day];
              
              var cards = document.querySelector('#fftw');
              var forecastElement =document.createElement('div');
              forecastElement.innerHTML=`
              <div class="card-day">
                <p class="card-date-week">${day}</p>
                <img class="card-img-weather" src="./assets/cloudy (1).png" alt="">
                <p class="card-temp-min">${tempMin.toFixed(0)}º</p>
                <p class="card-temp-max">${tempMax.toFixed(0)}º</p>
              </div>`;
  
              document.body.appendChild(forecastElement);
              cards.appendChild(forecastElement);
            }
          });
      }else{
        console.error("Dados para o dia atual não disponíveis.");
      }
      
      
    })
    .catch((error) => {
      console.error("Houve um problema: ", error);
    });
}



