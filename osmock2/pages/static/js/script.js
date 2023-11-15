const PHiL = "https://waspventman.co.uk"

const bannertext = document.querySelector(".bannertext")
const bannerlist = [
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

const rainindex = {
    "cs": {
        "name": "CLEAR SKIES",
        "url": "https://waspventman.co.uk/img/wasp.png"
    },
    "cl": {
        "name": "CLDY; DRY",
        "url": "https://art.ngfiles.com/images/5088000/5088680_41490_waspventman_untitled-5088680.744e4604e7467f0e6fb3517388d7096d.webp?f1696115243"
    },
    "lr": {
        "name": "LIGHT RAIN",
        "url": "https://art.ngfiles.com/images/3074000/3074562_waspventman_budget-static.png?f1677696189"
    },
    "hr": {
        "name": "HEAVY RAIN",
        "url": "https://art.ngfiles.com/images/5146000/5146408_118157_waspventman_untitled-5146408.9ec5f706ee374e902f49edd7451750e5.png?f1697925636"
    },
    "ar": {
        "name": "ACID RAIN",
        "url": "https://art.ngfiles.com/images/3074000/3074566_waspventman_sparkling-tiles.png?f1677696275"
    },
    "tlr": {
        "name": "T&L; RAIN",
        "url": "https://art.ngfiles.com/images/5189000/5189239_173241_waspventman_untitled-5189239.e4d6899cd4d5b80942845f9ec4f9dc6e.webp?f1699311006"
    },
    "tlc": {
        "name": "T&L; CLDY",
        "url": "https://art.ngfiles.com/images/3044000/3044761_waspventman_blooming-perhaps-for-the-last-time.png?f1676311708"
    }
}

function toF(C){
    return rounddp(((C*(9/5)) + 32), 1)
}

function rounddp(n, r){
    r = 10**r
    return Math.round(n*r)/r
}

for (let x = 0; x < bannerlist.length; x++){
    if (x != 0){bannertext.textContent += " --- "}
    bannertext.textContent += bannerlist[x]
}

let temp = ["cs", "cl", "lr", "hr", "ar", "tlr", "tlc"]

for (let x = 0; x < 7; x++){
    let celcius = Math.round(Math.random()*300)/10
    let AQI = Math.round(Math.random()*10)
    let rain = Math.round(Math.random()*6)

    document.querySelector(".forecast" + x).textContent = new Date().getDate() + x + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear()
    document.querySelector(".forecastbg" + x).style.backgroundImage = "url('" + rainindex[temp[rain]].url + "')"

    document.querySelector(".forecasttemp" + x).textContent = rounddp(celcius, 1) + "C " + toF(celcius) +"F"
    document.querySelector(".forecastAQI" + x).textContent = "AQI: ‌ " + rounddp(AQI, 0)
    document.querySelector(".forecastrain" + x).textContent = rainindex[temp[rain]].name
}
document.querySelector(".forecast0").textContent += " (today)"

let rainbow = Math.round(Math.random()*360)

setInterval(function(){
    document.body.style.backgroundColor = "hsl(" + rainbow + "deg 50% 25%)"
    rainbow += 0.01
}, 0)