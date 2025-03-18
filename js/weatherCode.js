const searchButton = document.getElementById("search-button")

const searchByLocationButton = document.getElementById("search-by-location")
const favouriteButton = document.getElementById("favourite-button")
const starIcon = document.getElementById("star-icon")

let dropDownMenu = null 
let dropDownItem = null 
let chart = null

let currentCityName = ""

let favouriteCities = []

let temp24HOpenWeatherMap = []
let time24hOpenWeatherMap  = []
let wind24hOpenWeatherMap = []

let tempWeatherApiCelsius = []
let tempWeatherApiFahrenheit = []
let tempWeatherApiKelvin = []
let windWeatherApiMPS =[]
let windWeatherApiMPH = []

let weatherApiTempModified = []
let weatherApiWindModified = []

let tempOpenMeteoCelsius = []
let tempOpenMeteoKelvin = []
let tempOpenMeteoFahrenheit = []
let windOpenMeteoMPS = []
let windOpenMeteoMPH = []

let openMeteoModifiedTemp = []
let openMeteoModifiedWind = []


function updateStarIcon() {
    const starIcon = document.getElementById("star-icon")

    let trimmedCityname = currentCityName.trim()
    
    //console.log(favouriteCities)
    if (favouriteCities.includes(trimmedCityname)) {
        starIcon.innerHTML = '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'
        starIcon.classList.remove("bi-star")
        starIcon.classList.add("bi-star-fill")
    } else {
        starIcon.innerHTML = '<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>'
        starIcon.classList.remove("bi-star-fill")
        starIcon.classList.add("bi-star")
    }
}

function updateDropdownMenu() {
    dropDownMenu = document.getElementById("dropdown-menu")
    dropDownMenu.innerHTML = ""

    favouriteCities.forEach(city => {
        dropDownItem = document.createElement("a")
        dropDownItem.classList.add("dropdown-item")
        dropDownItem.setAttribute("href", "#")
        dropDownItem.innerText = city
        dropDownMenu.appendChild(dropDownItem)
    })
}

function addToFavourites(cityName) {
    if (!favouriteCities.includes(cityName)) {
        favouriteCities.push(cityName)
        updateDropdownMenu()
    }
}


favouriteButton.addEventListener("click", function () {

    if (starIcon.classList.contains("bi-star")) {
        starIcon.innerHTML = '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'
        starIcon.classList.remove("bi-star")
        starIcon.classList.add("bi-star-fill")

        addToFavourites(currentCityName)
    } else {
        starIcon.innerHTML = '<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>'
        starIcon.classList.remove("bi-star-fill")
        starIcon.classList.add("bi-star")

        const index = favouriteCities.indexOf(currentCityName)
        if (index > -1) {
            favouriteCities.splice(index, 1)
            updateDropdownMenu()
        }
    }

   
})

searchByLocationButton.addEventListener("click", function(event) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            handleSearch("", lat, lon)
        })
    } else {
        console.log("Sijaintipalvelu ei ole saatavilla!")
    }
})

searchButton.addEventListener("click", function(event) {
  
    let citynameSearch = document.getElementById("search-input").value.trim().toLowerCase()
    handleSearch(citynameSearch)
})

const dropdownMenu = document.getElementById('dropdown-menu')
dropdownMenu.addEventListener('click', (event) => {
    if (event.target.classList.contains('dropdown-item')) {
        event.preventDefault()
        const searchText = event.target.textContent.trim().toLowerCase()
        handleSearch(searchText)
    }
})

function handleSearch(citynameSearch = "", lat = null, lon = null) {
    if (!citynameSearch && (lat === null || lon === null)) {
        alert("Cityname is incorrect or location data missing")
        return
    }

    const selectedTemperature = document.querySelector('input[name="btnradio"]:checked')

    if (!selectedTemperature) {
        alert("Valitse lämpötila yksikkö.");
        return;
    }

    if (!selectedTemperature) {
        console.log("No temperature unit selected")
        return
    }

    let unitString = ""
    if (selectedTemperature.id === "btnCelsius") {
        unitString = "&units=metric"
    } else if (selectedTemperature.id === "btnKelvin") {
        unitString = ""
    } else if (selectedTemperature.id === "btnFahrenheit") {
        unitString = "&units=imperial"
    }

    if (lat !== null && lon !== null) {
        getCityName(lat, lon).then(result => {

            if (result === "Unknown Location") {
                alert("Sijaintia ei löytynyt.")
                return;
            }

            const latLonArray = [lat, lon, result]

            let citynameSearchString = result.charAt(0).toUpperCase() + result.slice(1)
            currentCityName = citynameSearchString

            getDailyForecast(latLonArray, unitString)
        }).catch(error => {
            console.log("City name fetch failed: ", error)
            alert("Sijaintia ei voitu hakea.");
        })
    } else if (citynameSearch) {
        let citynameSearchString = citynameSearch.charAt(0).toUpperCase() + citynameSearch.slice(1)

        currentCityName = citynameSearchString

        const promiseLatLonArray = getLocationData(citynameSearch).then()

        promiseLatLonArray.then(result => {
            if (!result) {
                alert("Kaupunkia ei löytynyt.")
                return;
            }
            getDailyForecast(result, unitString)
        }).catch(error => {
            console.log("epäonnistunut yritys: ", error)
            alert("Tietoja ei voitu hakea. Tarkista verkkoyhteytesi.")
        })
    }
}

async function getCityName (lat, lon){
    const APIKEY = "378115217de119f3069b70294abee4e1"
    const urlLocation = "http://api.openweathermap.org/geo/1.0/reverse?lat="+lat+"&lon="+lon+"&limit=1&lang=fi&appid="+APIKEY

    //console.log(urlLocation)
    const response = await fetch(urlLocation)
    const json = await response.json()

    if (json && json.length > 0) {
        return json[0].name
    } else {
        return "Unknown Location"
    }
}


const getLocationData = async(cityName) =>{

    try{
        const APIKEY = "378115217de119f3069b70294abee4e1"
        const urlLocation = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid="+ APIKEY
        //console.log(urlLocation)
        const responseLocation = await fetch(urlLocation)
        const jsonLocation = await responseLocation.json()

        if (!jsonLocation || jsonLocation.length === 0) {
            alert("Kaupunkia ei löytynyt hakutermillä: " + cityName)
            return null;  
        }

        //console.log(jsonLocation)

        let lat = jsonLocation[0].lat
        //console.log(lat)

        let lon = jsonLocation[0].lon
       // console.log(lon)

       //console.log(jsonLocation[0].name)
        return [lat, lon, jsonLocation[0].name]
    }catch(error){
        console.error("Datan haku epäonnistui:", error)
        alert("Tietojen haku epäonnistui. Yritä uudelleen.")


    }
   
}

let timeFormatterOptions = [
    {weekday: "long"},
    {hour: "2-digit", minute: "2-digit", hour12: false},
    {day: "numeric", month: "numeric"},
    {weekday: "short"},
    {hour: "2-digit", hour12:false},
    {weekday: "short", day: "numeric", month: "numeric"}
]




const getDailyForecast = async(latLonArray, unitString) =>{

    try{

        //console.log("getdailyforecast suoritetaan!!")

        //Openweathermap
        const APIKEY = "378115217de119f3069b70294abee4e1"
        const urlDaily = "https://api.openweathermap.org/data/3.0/onecall?lat="+latLonArray[0]+"&lon="+latLonArray[1]+ unitString+"&exclude=minutely,alerts&lang=fi&appid="+APIKEY
        //console.log(urlDaily)
        const responseDaily = await fetch(urlDaily)
        const jsonDaily = await responseDaily.json()

        if (!jsonDaily || Object.keys(jsonDaily).length === 0) {
            alert("Sääennustetta ei löytynyt.");
            return;
        }
        //console.log(jsonDaily)

        //weatherApi.com
        const APIKEY_WEATHERAPI = "3b05b711cbb14eef9e1111222242210"
        const urlWeatherApi = "http://api.weatherapi.com/v1/forecast.json?key=" + APIKEY_WEATHERAPI +"&q="+latLonArray[0]+"," + latLonArray[1] + "&days=1"
        const responseWeatherApi = await fetch(urlWeatherApi)

        //open-meteo.com
        const urlOpenMeteo = "https://api.open-meteo.com/v1/forecast?latitude="+latLonArray[0]+"&longitude="+latLonArray[1]+"&hourly=temperature_2m,precipitation,wind_speed_10m&forecast_hours=24&timezone=auto"
        //console.log(urlOpenMeteo)
        const responseOpenMeteo = await fetch(urlOpenMeteo)
        

        //alustetaan arvot
        tempOpenMeteoCelsius = []
        tempOpenMeteoKelvin = []
        tempOpenMeteoFahrenheit = []
        windOpenMeteoMPS = []
        windOpenMeteoMPH = []

        temp24HOpenWeatherMap = []
        time24hOpenWeatherMap  = []
        wind24hOpenWeatherMap = []

        windWeatherApiMPS =[]
        windWeatherApiMPH = []
        tempWeatherApiCelsius = []
        tempWeatherApiFahrenheit = []
        tempWeatherApiKelvin = []
        
        weatherApiTempModified = []
        weatherApiWindModified = []
        openMeteoModifiedTemp = []
        openMeteoModifiedWind = []
    
    


        if (!responseWeatherApi.ok) {
            throw new Error('Verkkovirhe: ' + responseWeatherApi.statusText)
        }
        if(!responseOpenMeteo.ok){
            throw new Error('Verkkovirhe: ' + responseOpenMeteo.statusText)
        }

        const data = await responseWeatherApi.json()
        //console.log(data)
        const jsonOpenMeteo = await responseOpenMeteo.json()
        //console.log(jsonOpenMeteo)

        for (let key = 0; key < 24; key++) {
            //weatherapi
            //lämpötila
            let tempC = data.forecast.forecastday[0].hour[key].temp_c
            let tempF = data.forecast.forecastday[0].hour[key].temp_f
            let tempK = parseFloat((tempC + 273.15).toFixed(2))

            tempWeatherApiCelsius.push(tempC)
            tempWeatherApiFahrenheit.push(tempF)
            tempWeatherApiKelvin.push(tempK)
            //tuuli
            let windWeatherApiKPH = data.forecast.forecastday[0].hour[key].wind_kph
            windWeatherApiMPS.push(parseFloat((windWeatherApiKPH/3.6).toFixed(2)))
            windWeatherApiMPH.push(data.forecast.forecastday[0].hour[key].wind_mph)

            //openMeteo 
            //lämpötila
            let tempCOpenMeteo = jsonOpenMeteo.hourly.temperature_2m[key]
            
            tempOpenMeteoCelsius.push(tempCOpenMeteo)
            tempOpenMeteoFahrenheit.push(parseFloat((tempCOpenMeteo*1.8+32).toFixed(2)))
            tempOpenMeteoKelvin.push(parseFloat((tempCOpenMeteo + 273.15).toFixed(2)))
            //tuuli
            let windOpenMeteo = jsonOpenMeteo.hourly.wind_speed_10m[key]
            windOpenMeteoMPS.push(parseFloat((windOpenMeteo/3.6).toFixed(2)))
            windOpenMeteoMPH.push(parseFloat(((windOpenMeteo/3.6)*2.23693629).toFixed(2)))

            //openweathermap
            let timesOpen = jsonDaily.hourly[key].dt
            let formattedTime = dateFormatter(timesOpen, timeFormatterOptions[4])
            let tempOpen = jsonDaily.hourly[key].temp
            temp24HOpenWeatherMap.push(tempOpen)
            time24hOpenWeatherMap.push(formattedTime)
            wind24hOpenWeatherMap.push(jsonDaily.hourly[key].wind_speed)
      
        }

            

        //Lämpötila ja tuuli yksiköt valinnan mukaan
        let temperatureUnit = ""
        let windUnit = ""

        if (unitString.includes("metric")) {
            temperatureUnit = "°C"
            windUnit = "m/s"

            weatherApiTempModified = tempWeatherApiCelsius
            weatherApiWindModified = windWeatherApiMPS


            openMeteoModifiedTemp = tempOpenMeteoCelsius
            openMeteoModifiedWind = windOpenMeteoMPS
            
        } else if (unitString.includes("imperial")) {
            weatherApiTempModified = tempWeatherApiFahrenheit
            weatherApiWindModified = windWeatherApiMPH
            openMeteoModifiedTemp = tempOpenMeteoFahrenheit
            openMeteoModifiedWind = windOpenMeteoMPH

            temperatureUnit = "°F" 
            windUnit = "mph"       
        } else {
            weatherApiTempModified = tempWeatherApiKelvin
            weatherApiWindModified = windWeatherApiMPS
            openMeteoModifiedTemp = tempOpenMeteoKelvin
            openMeteoModifiedWind = windOpenMeteoMPS

            temperatureUnit = "K"  
            windUnit = "m/s"
      
        }

        
        document.getElementById("weather-forecasts-div").style.display = "block"

        const weatherHeader = document.getElementById("weather-header")

        if(latLonArray[2]){
            weatherHeader.innerText = "Sää " + latLonArray[2]

        }else{
            return
        }

        //Tämänhetkinen lämpötila
        const currentUnixTime = jsonDaily.current.dt        

        backgroundColor(jsonDaily.current.temp,jsonDaily.current.sunrise,jsonDaily.current.sunset,currentUnixTime, temperatureUnit)
        
        const formattedCurrentTime = dateFormatter(currentUnixTime,timeFormatterOptions[1])

        const currentTimeHeader = document.getElementById("current-timestamp") 
        currentTimeHeader.innerText = "Tänään " + dateFormatter(currentUnixTime,timeFormatterOptions[0])+"na klo " + formattedCurrentTime
        
        const currentSunrise = document.getElementById("current-sun-rise")
        currentSunrise.innerText = dateFormatter(jsonDaily.current.sunrise, timeFormatterOptions[1])

        const currentSunSet = document.getElementById("current-sun-set")
        currentSunSet.innerText = dateFormatter(jsonDaily.current.sunset, timeFormatterOptions[1])

        const currentWeatherIcon = document.getElementById("weather-icon")
        currentWeatherIcon.src = "https://openweathermap.org/img/wn/"+jsonDaily.current.weather[0].icon+"@2x.png"

        const currentTemp = document.getElementById("current-temp")
        currentTemp.innerText = Math.round(jsonDaily.current.temp) + temperatureUnit

        const currentWindDiv = document.getElementById("div-wind")
        currentWindDiv.innerHTML = ""
        const currentWindSpeed = document.createElement("p")
        currentWindSpeed.innerText = Math.round(jsonDaily.current.wind_speed) + windUnit
        
        currentWindDiv.appendChild(createSvgArrow((jsonDaily.current.wind_deg + 180) % 360))
        currentWindDiv.appendChild(currentWindSpeed)

        const currentFeelsLike = document.getElementById("current-feels-like")
        currentFeelsLike.innerText = parseFloat((jsonDaily.current.feels_like).toFixed(1)) + temperatureUnit

        
        // tuntikohtainen ennuste
        let arrayHourly = jsonDaily.hourly
        const hourlyForecast = document.getElementById("hourly-forecast")
        hourlyForecast.innerHTML = ""
        
        for (let key = 0; key < 24; key++) {
            let listItem = document.createElement("li")
            listItem.className = "list-group-item d-flex justify-content-between align-items-center"
        
            let unixTime = arrayHourly[key].dt
            let formattedTime = dateFormatter(unixTime, timeFormatterOptions[1])
            let temp = Math.round(arrayHourly[key].temp)
            let weatherIcon = arrayHourly[key].weather[0].icon
            let windSpeed = Math.round(arrayHourly[key].wind_speed)
            let windDeg = arrayHourly[key].wind_deg
        
            let img = document.createElement("img")
            img.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
            img.alt = "Sään ikoni"
            img.className = "weatherIcon"
            img.style.width = "30px"
        
            let windIcon = createSvgArrow((windDeg + 180) % 360)
        
           
            let timeDiv = document.createElement("div")
            timeDiv.className = "me-3"
        
            let timeSpan = document.createElement("span")
            timeSpan.innerText = formattedTime
            timeDiv.appendChild(timeSpan)
        
            let detailsDiv = document.createElement("div")
            detailsDiv.className = "d-flex justify-content-center align-items-center"
        
            detailsDiv.appendChild(img)

        
            let tempSpan = document.createElement("span")
            tempSpan.className = "ms-2"
            tempSpan.innerText = `${temp}`+ temperatureUnit
            detailsDiv.appendChild(tempSpan)
        
            detailsDiv.appendChild(windIcon)
        
            let windSpeedSpan = document.createElement("span")
            windSpeedSpan.className = "ms-2"
            windSpeedSpan.innerText = `${windSpeed} `+ windUnit
            detailsDiv.appendChild(windSpeedSpan)
        
            listItem.appendChild(timeDiv)
            listItem.appendChild(detailsDiv)
       
            hourlyForecast.appendChild(listItem)
        }
        
        //päiväkohtainen ennuste
     
        let arrayDaily = jsonDaily.daily

        const dailyForecast = document.getElementById("daily-forecast-ul")
        dailyForecast.innerHTML = ""
        for (let key = 1; key < 8; key++) {
            let listItem = document.createElement("li")
            listItem.className = "list-group-item d-flex justify-content-between align-items-center"
        
            let unixTime = arrayDaily[key].dt
            let formattedTime = dateFormatter(unixTime, timeFormatterOptions[3])
            formattedTimeWeekday = formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1)
            let formattedTimeMonth = dateFormatter(unixTime, timeFormatterOptions[2])
            
            let temp = Math.round(arrayDaily[key].temp.day)
            let weatherIcon = arrayDaily[key].weather[0].icon
            let windSpeed = Math.round(arrayDaily[key].wind_speed)
            let windDeg = arrayDaily[key].wind_deg
        
            let img = document.createElement("img")
            img.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
            img.alt = "Sään ikoni"
            img.className = "weatherIcon"

            img.style.width = "30px"
        
            let windIcon = createSvgArrow((windDeg + 180) % 360)
        
            let timeDiv = document.createElement("div")
            timeDiv.className = "me-3"
        
            let timeSpan = document.createElement("span")
            timeSpan.innerText = formattedTimeWeekday + " "+ formattedTimeMonth
            timeDiv.appendChild(timeSpan)
        
            let detailsDiv = document.createElement("div")
            detailsDiv.className = "d-flex justify-content-center align-items-center"
        
            detailsDiv.appendChild(img)

           
            let tempSpan = document.createElement("span")
            tempSpan.className = "ms-2"
            tempSpan.innerText = temp + temperatureUnit
            detailsDiv.appendChild(tempSpan)
        
            detailsDiv.appendChild(windIcon)
        
            let windSpeedSpan = document.createElement("span")
            windSpeedSpan.className = "ms-2"
            windSpeedSpan.innerText = windSpeed + windUnit
            detailsDiv.appendChild(windSpeedSpan)
        
            listItem.appendChild(timeDiv)
            listItem.appendChild(detailsDiv)
        
            dailyForecast.appendChild(listItem)
        }
        
        
    //lämpötilakaavio
        function updateChartToTemperature() {
            document.getElementById("chart-header").innerText = "Lämpötila 24 tuntia"

            if (temp24HOpenWeatherMap.length === 24 && tempWeatherApiCelsius.length === 24) {
                const dataChart = {
                    labels: time24hOpenWeatherMap,
                    datasets: [
                        {
                            name: "OpenWeather",
                            chartType: "line",
                            values: temp24HOpenWeatherMap
                        },
                        {
                            name: "WeatherAPI",
                            chartType: "line",
                            values: weatherApiTempModified
                        },
                        {
                            name: "Open-Meteo",
                            chartType: "line",
                            values: openMeteoModifiedTemp
                        }
                    ]
                }
                chart = new frappe.Chart("#chart", {
                    
                    data: dataChart,
                    title: "Säävertailu (Lämpötila)",
                    type: 'line',
                    height: 250,
                    colors: ['#7cd6fd', '#743ee2', '#fc03e8']
                    
                })
            }
        }

    //tuulikaavio
        function updateChartToWind() {
            document.getElementById("chart-header").innerText = "Tuuli 24 tuntia"
            if (wind24hOpenWeatherMap.length === 24 && weatherApiWindModified.length === 24) {
                const dataChart = {
                    labels: time24hOpenWeatherMap,
                    datasets: [
                        {
                            name: "OpenWeather",
                            chartType: "line",
                            values: wind24hOpenWeatherMap
                        },
                        {
                            name: "WeatherAPI",
                            chartType: "line",
                            values: weatherApiWindModified
                        },
                        {
                            name: "Open-Meteo",
                            chartType: "line",
                            values: openMeteoModifiedWind
                        }
                    ]
                }
        
                chart = new frappe.Chart("#chart", {
                    data: dataChart,
                    title: "Säävertailu (Tuuli)",
                    type: 'line',
                    height: 250,
                    colors: ['#7cd6fd', '#743ee2', '#fc03e8']
                    
                })
            }
        }
        

        
        updateChartToTemperature()
        //Favourite nappi päivittely
        updateStarIcon()

        const tempButton = document.getElementById('btnTemperature')
        const windButton = document.getElementById('btnWind')
    
        tempButton.addEventListener('click', () => {
            updateChartToTemperature()
        })
    
        windButton.addEventListener('click', () => {
            updateChartToWind()
        })
    }catch(error){
        console.error("Datan haku epäonnistui:", error)
        alert("Sääennusteen haku epäonnistui. Tarkista verkkoyhteytesi.")

    }


    function createSvgArrow(wind_deg) {
        const svgNS = "http://www.w3.org/2000/svg"
        
        const svg = document.createElementNS(svgNS, "svg")
        svg.setAttribute("width", "16")
        svg.setAttribute("height", "16")
        svg.setAttribute("fill", "currentColor")
        svg.setAttribute("viewBox", "0 0 16 16")

    
        const path = document.createElementNS(svgNS, "path")
        path.setAttribute("fill-rule", "evenodd")
        path.setAttribute("d", "M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z")
        
        svg.appendChild(path)
        
        svg.style.transform = `rotate(${wind_deg}deg)`

        return svg
    }

    //taustaväri muuttuu lämpötilan mukaan
    function backgroundColor(temperature, sunrise, sunset, currentTime, tempUnit ){

        const currentWeatherElement = document.getElementById("weather-now")
        let isItBright = null
        let newBackgroudColor = null

        if (tempUnit === "°F") {
            temperature = (temperature - 32) * 5 / 9
        } else if (tempUnit === "K") {
            temperature = temperature - 273.15
        }

        if( sunrise <= currentTime <= sunset){
            isItBright = true
        }

        if (temperature > 20) {
            if(isItBright){
                newBackgroudColor = "#FF6347"
            }else{
                newBackgroudColor = "#8B0000"
            }
        } else if (temperature > 10) {
            if(isItBright){
                newBackgroudColor = "#FFA07A"
            }else{
                newBackgroudColor = "#A52A2A"
            }
        } else if (temperature > 0) {
            if(isItBright){
                newBackgroudColor = "#FFD700"
            }else{
                newBackgroudColor = "#B8860B"
            }
        } else if (temperature > -10) {
            if(isItBright){
                newBackgroudColor = "#ADD8E6"
            }else{
                newBackgroudColor = "#4682B4"
            }
        } else if (temperature > -20) {
            if(isItBright){
                newBackgroudColor = "#87CEEB"
            }else{
                newBackgroudColor = "#4169E1"
            }
        } else {
            if(isItBright){
                newBackgroudColor = "#00BFFF"
            }else{
                newBackgroudColor = "#191970"
            }
        }

        currentWeatherElement.style.backgroundColor = newBackgroudColor

    }
    
}

function dateFormatter(unixTime, options){

    const date = new Date(unixTime *1000)
    const timeFormatter = new Intl.DateTimeFormat("fi-FI", options)

    return timeFormatter.format(date)
}

//apuna käytetyt nettisivut
// For-in loop
//https://www.geeksforgeeks.org/how-to-iterate-json-object-in-javascript/#using-forin-loop   

//Unix datetime
//https://sentry.io/answers/convert-unix-timestamp-to-date-and-time-in-javascript/

//Date- kirjasto
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

//geolocation kirjasto
//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

//ajan muotoilu
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

//Tuuli icon
//https://icons.getbootstrap.com/icons/arrow-down-circle/

//iconin kääntö by chatgpt
/*
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
</svg>

Miten voin kääntää tätä iconia tuulen suunnan mukaisesti?
ChatGPT said:
ChatGPT
SVG-kuvakkeiden kääntäminen tuulen suunnan tai muun kulman mukaan onnistuu käyttämällä SVG
sisäistä transformaatio-ominaisuutta, erityisesti transform-attribuuttia. Voit käyttää rotate()-funktiota määrittääksesi, kuinka paljon haluat kääntää kuvaketta.

Esimerkki: SVG-kuvakkeen kääntäminen 45 astetta
Jos haluat kääntää kuvakkeen 45 astetta, voit lisätä transform-ominaisuuden path-elementtiin tai korkeammalle tasolle, kuten svg-elementtiin:

html
Copy code
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16" transform="rotate(45 8 8)">
  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
</svg>
Yleiset huomautukset
rotate(angle cx cy): angle on kääntöaste, ja cx, cy ovat kääntöpisteen koordinaatit.
Kääntöpisteeksi kannattaa valita SVG-kuvakkeen keskipiste, jotta se kääntyy symmetrisesti. Esimerkissä käytettiin koordinaatteja (8, 8), koska SVG-kuvake on 16x16 kokoinen, ja sen keskipiste on (8, 8).
Dynaaminen kääntäminen tuulen suunnan mukaan
Jos haluat kääntää kuvaketta dynaamisesti ohjelmallisesti (esim. JavaScriptin avulla), voit päivittää transform-attribuutin tuulen suunnan perusteella:

html
Copy code
<svg id="wind-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
</svg>

<script>
  // Oletetaan, että meillä on tuulen suunta (esim. 90 astetta)
  const windDirection = 90; // asteina
  const svgElement = document.getElementById("wind-arrow");
  svgElement.setAttribute("transform", `rotate(${windDirection} 8 8)`);
</script>
Tässä esimerkissä windDirection voi olla muuttuja, joka sisältää tuulen suunnan asteina, ja se päivittää SVG-kuvakkeen kääntöä vastaavasti.

Yhteenveto
SVG-kuvakkeen kääntäminen tuulen suunnan mukaisesti on mahdollista käyttämällä transform: rotate() -ominaisuutta joko suoraan SVG-elementissä tai ohjelmallisesti JavaScriptin avulla. Tämä mahdollistaa dynaamisen ja reagoivan kuvakkeen, joka osoittaa aina oikeaan suuntaan.*/

//Jotta saan 24h ennusteeseen myös tuulen suunnan, pyysin chat-gpt avustamaan nuolielementin teossa js koodin puolella

/*
<svg id="wind-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                  </svg>
how to create this on js
ChatGPT said:
ChatGPT
To create the SVG arrow dynamically using JavaScript, you can use the createElementNS method, which allows you to create elements within the SVG namespace. Below is an example of how to create the SVG element with the same structure as the one you've provided:

JavaScript Code to Create the SVG Arrow
Here’s a complete example that includes HTML and JavaScript to create and insert the SVG arrow into the document.

html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create SVG with JavaScript</title>
    <style>
        #svg-container {
            width: 100px;  
            /height: 100px; 
            display: flex;  
            justify-content: center;
            align-items: center;
            margin-top: 50px; 
            background-color: #f0f0f0; 
        }
    </style>
</head>
<body>

<div id="svg-container"></div> <!-- Container for the SVG -->

<script>
    // Function to create the SVG arrow
    function createSvgArrow() {
        const svgNS = "http://www.w3.org/2000/svg"; // Namespace for SVG
        
        // Create SVG element
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("id", "wind-arrow");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("viewBox", "0 0 16 16");

        // Create the path element
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("fill-rule", "evenodd");
        path.setAttribute("d", "M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z");
        
        // Append the path to the SVG
        svg.appendChild(path);

        // Append the SVG to the container
        const container = document.getElementById("svg-container");
        container.appendChild(svg);
    }

    // Call the function to create and insert the SVG
    createSvgArrow();
</script>

</body>
</html>
Explanation
Creating the SVG Element:

The SVG element is created using document.createElementNS with the SVG namespace.
Attributes like id, width, height, fill, and viewBox are set on the SVG element.
Creating the Path Element:

A <path> element is created similarly, and the fill-rule and d attributes are set to define the shape of the arrow.
Appending Elements:

The path is appended to the SVG element, and the SVG is then appended to a designated container in the HTML.
Styling:

Basic CSS styles are added to center the SVG in a container for better visibility.
Result
When you run the above code in a browser, it will create and display the SVG arrow in the specified container on the webpage. This method allows you to generate SVG elements dynamically using JavaScript.*/



/*
make buttons with boostrap svg icons

<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
</svg>

when clicked change this icon to this

<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
ChatGPT said:
ChatGPT
To create buttons with Bootstrap that toggle between the star and star-fill icons on click, you can use the following approach. This example uses JavaScript (or jQuery if preferred) to handle the toggle between the two SVG icons.

Here's the HTML and JavaScript code to make the button with the Bootstrap SVG icons that changes when clicked:

html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap SVG Icon Button</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <button id="toggleIconButton" class="btn btn-primary">
            <svg id="starIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
            </svg>
        </button>
    </div>

    <!-- JavaScript to handle the icon toggle -->
    <script>
        document.getElementById('toggleIconButton').addEventListener('click', function () {
            const starIcon = document.getElementById('starIcon');
            if (starIcon.classList.contains('bi-star')) {
                starIcon.innerHTML = '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>';
                starIcon.classList.remove('bi-star');
                starIcon.classList.add('bi-star-fill');
            } else {
                starIcon.innerHTML = '<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>';
                starIcon.classList.remove('bi-star-fill');
                starIcon.classList.add('bi-star');
            }
        });
    </script>

    <!-- Optional Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
Explanation:
Button Setup: The button initially displays the "star" icon.
JavaScript: An event listener is added to handle the click action. When the button is clicked, it checks the current icon and toggles between the "star" and "star-fill" icons by updating the SVG content and classes.
Bootstrap Integration: The button has the btn btn-primary classes from Bootstrap for styling.
This approach efficiently toggles between the two icons without needing to reload or significantly alter the page structure.






*/
