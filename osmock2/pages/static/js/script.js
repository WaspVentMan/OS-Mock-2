const PHiL = "https://waspventman.co.uk"

const defaultLoc = {"coords": {"latitude": 0, "longitude": 0}}

const bannertext = document.querySelector(".bannertext")
let bannerlist = []

const rainindex = [
    {
        "name": "Hag's Delirium: Phase 1",
        "url": "static/img/HDP1.png"
    },
    {
        "name": "Hag's Delirium: Phase 2",
        "url": "static/img/HDP2.png"
    },
    {
        "name": "Hag's Delirium: Phase 3",
        "url": "static/img/HDP3.png"
    },
    {
        "name": "Hag's Delirium: Phase 4",
        "url": "static/img/HDP4.png"
    },
    {
        "name": "Hag's Delirium: Phase 5",
        "url": "static/img/HDP5.png"
    },
    {
        "name": "Hag's Delirium: Phase 6",
        "url": "static/img/HDP6.png"
    },
    {
        "name": "Hag's Delirium: Phase 7",
        "url": "static/img/HDP7.png"
    }
]

/**
 * Converts Celcius to Farenheit
 * @param {*} C Temp (Celcius)
 * @returns Temp (Farenheit)
 */
function toF(C){
    return rounddp(((C*(9/5)) + 32), 1)
}

/**
 * Rounds numbers (but fancy)
 * @param {*} n Input number
 * @param {*} r How many D.P. to round it to
 * @returns Rounded number
 */
function rounddp(n, r){
    r = 10**r
    return Math.round(n*r)/r
}

/**
 * Converts raw AQI value into DAQI index
 * @param {*} AQI Air Quality Index value
 * @returns [DAQI, BGColour]
 */
function AQIconvert(AQI){
    let convertbounds = [0, 12, 24, 36, 42, 48, 54, 59, 65, 71]
    let backgroundColors = ["#cfc", "#6f6", "#0f0", "#9f0", "#ff0", "#fc0", "#f60", "#f30", "#f00", "#f06"]

    for (let x = 0; x < convertbounds.length; x++){
        if (AQI < convertbounds[x]){
            let aqistr = x + "." + Math.round((AQI-convertbounds[x-1])/(convertbounds[x]-convertbounds[x-1])*100)

            if (aqistr.endsWith(".0")){
                aqistr = aqistr.slice(0, -2)
            }

            return [aqistr, backgroundColors[x]]
        }
    }

    return ["10+", "#f06"]
}

/**
 * This function calls all the APIs and updates all the boxes and health advice
 * @param {*} position {"coords": {"latitude": latitude, "longitude": longitude}}
 */
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

    if (location.results[0].components.city == location.results[0].components.state){
        locationstr = locationstr.slice(0, -2)
    } else if (location.results[0].components.state != undefined){
        locationstr += location.results[0].components.state
    } else if (location.results[0].components.country != undefined){
        locationstr += location.results[0].components.country
    }

    // Madness Combat Easter Egg
    if (locationstr == "Forecast for somewhere in Nevada"){
        locationstr = "SOMEWHERE IN NEVADA"
        document.querySelector(".locTitle").style.fontFamily = "Impact"
        document.querySelector(".locTitle").style.textShadow = "-1px -1px 0 #F00, 1px -1px 0 #F00, -1px 1px 0 #F00, 1px 1px 0 #F00"
    }

    document.querySelector(".locTitle").textContent = locationstr

    const weather = await weatherR.json()
    const airQuality = await airQualityR.json()

    for (let x = 0; x < 7; x++){
        let adviceFlag = false

        let celcius = [weather.daily.temperature_2m_max[x], weather.daily.temperature_2m_min[x]]

        let AQI = airQuality.hourly.pm2_5[x*24]
        let rain = weather.daily.rain_sum[x]
        let rainimg = Math.round((AQI/100)*(rainindex.length-1))

        if (rainimg > rainindex.length-1){
            rainimg = rainindex.length-1
        }

        const newdate = new Date()
        newdate.setDate(newdate.getDate()+x)

        let HA = document.createElement("h2")
        HA.style.backgroundColor = "black"
        HA.style.color = "white"
        HA.style.margin = "0%"
        HA.textContent = newdate.getDate() + "/" + (newdate.getMonth()+1) + "/" + newdate.getFullYear()
        document.querySelector(".healthAdvice").appendChild(HA)

        bannerlist.push(HA.textContent)

        document.querySelector(".forecast" + x).textContent = newdate.getDate() + "/" + (newdate.getMonth()+1) + "/" + newdate.getFullYear()

        if (x == 0){
            document.querySelector(".forecast0").textContent += " (today)"
        }

        document.querySelector(".artwork" + x).textContent = "Art: \"" + rainindex[rainimg].name + "\""

        document.querySelector(".forecastbg" + x).style.backgroundImage = "url(" + rainindex[rainimg].url + ")"

        document.querySelector(".forecasttemp" + x).textContent = rounddp(celcius[1], 1) + "°C " + rounddp(celcius[0], 1) +"°C"

        if (AQI != null){
            document.querySelector(".forecastAQI" + x).textContent = "DAQI: " + AQIconvert(AQI)[0]
            document.querySelector(".forecastAQIbg" + x).style.backgroundColor = AQIconvert(AQI)[1]

            if (AQIconvert(AQI)[0] == 10){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(DAQI " + AQIconvert(AQI)[0] + ") Adults and children with lung problems, adults with heart problems, and older people, should avoid strenuous physical activity. People with asthma may find they need to use their reliever inhaler more often."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            } else if (AQIconvert(AQI)[0] >= 7){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(DAQI " + AQIconvert(AQI)[0] + ") Adults and children with lung problems, and adults with heart problems, should reduce strenuous physical exertion, particularly outdoors, and particularly if they experience symptoms. People with asthma may find they need to use their reliever inhaler more often. Older people should also reduce physical exertion."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            } else if (AQIconvert(AQI)[0] >= 4){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(DAQI " + AQIconvert(AQI)[0] + ") Adults and children with lung problems, and adults with heart problems, who experience symptoms, should consider reducing strenuous physical activity, particularly outdoors."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            } 
        } else {
            document.querySelector(".forecastAQI" + x).textContent = "NO DATA"
            adviceFlag = true
            let HA = document.createElement("p")
            HA.textContent = "DAQI for today is unkown, check back when data is available."
            document.querySelector(".healthAdvice").appendChild(HA)
            bannerlist.push(HA.textContent)
        }

        document.querySelector(".forecastrain" + x).textContent = "RAIN: " + rounddp(rain, 1) + "%"
        document.querySelector(".forecastrainbg" + x).style.backgroundColor = `rgb(${255-((255/100)*rain)}, 255, 255)`

        if (!adviceFlag){
            let HA = document.createElement("p")
            HA.textContent = "No health advice needed, continue your day as normal."
            bannerlist.push(HA.textContent)
            document.querySelector(".healthAdvice").appendChild(HA)
        }
    }

    setBanner()
}

/**
 * If automatic geolocation is disabled, this function is ran.
 * @param {*} error idk what this is lol
 */
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

/**
 * Updates the marquee at the top of the site with the contents of bannerlist
 */
function setBanner(){
    bannertext.textContent = ""
    for (let x = 0; x < bannerlist.length; x++){
        if (x != 0){bannertext.textContent += " --- "}
        bannertext.textContent += bannerlist[x]
    }
}

/**
 * I don't even know why I made this a function :/
 */
async function updatestats(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(weatherTime, showError)
    } else {
        weatherTime(defaultLoc)
    }
}

updatestats()

let rainbow = Math.round(Math.random()*360)

setInterval(function(){
    document.body.style.backgroundColor = "hsl(" + rainbow + "deg 50% 25%)"
    rainbow += 0.01
}, 0)