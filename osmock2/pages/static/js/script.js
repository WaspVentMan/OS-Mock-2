const PHiL = "https://waspventman.co.uk"

const defaultLoc = {"coords": {"latitude": 0, "longitude": 0}}

const bannertext = document.querySelector(".bannertext")
let bannerlist = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Duis nec cursus justo, et pretium eros.",
    "Aenean pretium dolor odio, ut tempus odio faucibus et.",
    "Sed porttitor eget est nec blandit.",
    "In porta ex enim, non venenatis orci aliquam nec.",
    "Fusce faucibus sodales ligula eget feugiat.",
    "Aliquam maximus lacinia nisi vitae condimentum.",
    "Pellentesque consequat ornare leo, at accumsan arcu fringilla in.",
    "Donec sed libero eget lectus ultrices vestibulum.",
    "Praesent in dapibus augue.",
    "Curabitur lacinia mauris eget dictum suscipit.",
    "Vivamus libero neque, malesuada id ante ut, consectetur pretium enim.",
    "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    "Phasellus viverra accumsan risus non dapibus."]

const rainindex = [
    {
        "name": "CLEAR SKIES",
        "url": "https://waspventman.co.uk/img/wasp.png"
    },
    {
        "name": "CLOUDY",
        "url": "https://art.ngfiles.com/images/5088000/5088680_41490_waspventman_untitled-5088680.744e4604e7467f0e6fb3517388d7096d.webp?f1696115243"
    },
    {
        "name": "LIGHT RAIN",
        "url": "https://art.ngfiles.com/images/3074000/3074562_waspventman_budget-static.png?f1677696189"
    },
    {
        "name": "HEAVY RAIN",
        "url": "https://art.ngfiles.com/images/5146000/5146408_118157_waspventman_untitled-5146408.9ec5f706ee374e902f49edd7451750e5.png?f1697925636"
    },
    {
        "name": "ACID RAIN",
        "url": "https://art.ngfiles.com/images/3074000/3074566_waspventman_sparkling-tiles.png?f1677696275"
    },
    {
        "name": "THUNDER AND LIGHTNING",
        "url": "https://art.ngfiles.com/images/3044000/3044761_waspventman_blooming-perhaps-for-the-last-time.png?f1676311708"
    },
    {
        "name": "THUNDER AND LIGHTNING AND ALSO RAIN",
        "url": "https://art.ngfiles.com/images/5189000/5189239_173241_waspventman_untitled-5189239.e4d6899cd4d5b80942845f9ec4f9dc6e.webp?f1699311006"
    }
]

function toF(C){
    return rounddp(((C*(9/5)) + 32), 1)
}

function rounddp(n, r){
    r = 10**r
    return Math.round(n*r)/r
}

function AQIconvert(AQI){
    let convertbounds = [12, 24, 36, 42, 48, 54, 59, 65, 71]
    let backgroundColors = ["#cfc", "#6f6", "#0f0", "#9f0", "#ff0", "#fc0", "#f60", "#f30", "#f00", "#f06"]

    for (let x = 0; x < convertbounds.length; x++){
        if (AQI < convertbounds[x]){
            return [x+1, backgroundColors[x]]
        }
    }

    return [10, "#f06"]
}

async function weatherTime(position){
    let lat = position.coords.latitude
    let lng = position.coords.longitude

    const weatherR = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_min,rain_sum`)
    const airQualityR = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=pm10,pm2_5&forecast_days=7`)

    const locationR = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=df841ae3cebd4c4d91643bf19e972128&q=${lat},${lng}&pretty=1&no_annotations=1`)
    const location = await locationR.json()

    let locationstr = `Forecast for `

    if (location.results[0].components.city != undefined){
        locationstr += location.results[0].components.city + ", "
    } else {
        locationstr = "Forecast for somewhere in "
    }

    if (location.results[0].components.state != undefined){
        locationstr += location.results[0].components.state
    } else if (location.results[0].components.country != undefined){
        locationstr += location.results[0].components.country
    }

    if (locationstr == "Forecast for somewhere in Nevada"){
        locationstr = "FORECAST FOR SOMEWHERE IN NEVADA"
        document.querySelector(".locTitle").style.fontFamily = "Impact"
        document.querySelector(".locTitle").style.textShadow = "-1px -1px 0 #F00, 1px -1px 0 #F00, -1px 1px 0 #F00, 1px 1px 0 #F00"

        // haha madness reference :D
        // ?lat=38.8871789&lng=-116.7064205
    }

    document.querySelector(".locTitle").textContent = locationstr

    const weather = await weatherR.json()
    const airQuality = await airQualityR.json()

    for (let x = 0; x < 7; x++){
        let celcius = [weather.daily.temperature_2m_max[x], weather.daily.temperature_2m_min[x]]

        let AQI = airQuality.hourly.pm2_5[x*24]
        let rain = weather.daily.rain_sum[x]
        let rainimg = Math.round((rain/100)*(rainindex.length-1))

        document.querySelector(".forecast" + x).textContent = new Date().getDate() + x + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear()
        document.querySelector(".forecastbg" + x).style.backgroundImage = "url(" + rainindex[rainimg].url + ")"

        document.querySelector(".forecasttemp" + x).textContent = rounddp(celcius[1], 1) + "C " + rounddp(celcius[0], 1) +"C"

        if (AQI != null){
            document.querySelector(".forecastAQI" + x).textContent = "DAQI: " + AQIconvert(AQI)[0]
            document.querySelector(".forecastAQIbg" + x).style.backgroundColor = AQIconvert(AQI)[1]
        } else {
            document.querySelector(".forecastAQI" + x).textContent = "NO DATA"
        }

        document.querySelector(".forecastrain" + x).textContent = "RAIN: " + rounddp(rain, 1) + "%"
        document.querySelector(".forecastrainbg" + x).style.backgroundColor = `rgb(${255-((255/100)*rain)}, 255, 255)`
    }
    document.querySelector(".forecast0").textContent += " (today)"
}

function showError(error) {
    let params = new URL(document.location).searchParams
    let lat = params.get("lat")
    let lng = params.get("lng")

    if (lat != null && lng != null && !isNaN(parseInt(lat)) && !isNaN(parseInt(lng))){
        weatherTime({"coords": {"latitude": lat, "longitude": lng}})
        document.querySelector(".geoError").textContent = `Manual Geolocation enabled (${lat}, ${lng})`
        return
    }

    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.querySelector(".geoError").textContent = "⚠ User denied the request for Geolocation. ⚠"
            break;
        case error.POSITION_UNAVAILABLE:
            document.querySelector(".geoError").textContent = "⚠ Location information is unavailable. ⚠"
            break;
        case error.TIMEOUT:
            document.querySelector(".geoError").textContent = "⚠ The request to get user location timed out. ⚠"
            break;
        case error.UNKNOWN_ERROR:
            document.querySelector(".geoError").textContent = "⚠ An unknown error occurred. ⚠"
            break;
    }

    document.querySelector(".wholeweather").innerHTML = ""

    let temp = document.createElement("p")
    temp.textContent = "Manual Geolocation Entry:"
    document.querySelector(".wholeweather").appendChild(temp)
    temp = document.createElement("i")
    temp.textContent = "Latitude: "
    document.querySelector(".wholeweather").appendChild(temp)
    temp = document.createElement("input")
    temp.className = "ManualGeolocationInputLat"
    document.querySelector(".wholeweather").appendChild(temp)
    document.querySelector(".wholeweather").appendChild(document.createElement("br"))
    temp = document.createElement("i")
    temp.textContent = "Longitude: "
    document.querySelector(".wholeweather").appendChild(temp)
    temp = document.createElement("input")
    temp.className = "ManualGeolocationInputLng"
    document.querySelector(".wholeweather").appendChild(temp)
    document.querySelector(".wholeweather").appendChild(document.createElement("br"))
    temp = document.createElement("button")
    temp.textContent = "Submit"
    temp.onclick = function(){
        if (
            document.querySelector(".ManualGeolocationInputLat").value != "" &&
            document.querySelector(".ManualGeolocationInputLng").value != "" &&
            !isNaN(parseInt(document.querySelector(".ManualGeolocationInputLat").value)) &&
            !isNaN(parseInt(document.querySelector(".ManualGeolocationInputLng").value)) &&
            parseInt(document.querySelector(".ManualGeolocationInputLat").value) < 90 &&
            parseInt(document.querySelector(".ManualGeolocationInputLat").value) > -90 &&
            parseInt(document.querySelector(".ManualGeolocationInputLng").value) < 180 &&
            parseInt(document.querySelector(".ManualGeolocationInputLng").value) > -180
            ){
                location.href = location.href + "?lat=" + document.querySelector(".ManualGeolocationInputLat").value + "&lng=" + document.querySelector(".ManualGeolocationInputLng").value
            }
        }
    document.querySelector(".wholeweather").appendChild(temp)
}

function setBanner(){
    bannertext.textContent = ""
    for (let x = 0; x < bannerlist.length; x++){
        if (x != 0){bannertext.textContent += " --- "}
        bannertext.textContent += bannerlist[x]
    }
}

async function updatestats(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(weatherTime, showError)
    } else {
        weatherTime(defaultLoc)
    }
}

setBanner()

updatestats()

let rainbow = Math.round(Math.random()*360)

setInterval(function(){
    document.body.style.backgroundColor = "hsl(" + rainbow + "deg 50% 25%)"
    rainbow += 0.01
}, 0)