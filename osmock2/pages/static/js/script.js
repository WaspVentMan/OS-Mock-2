const PHiL = "https://waspventman.co.uk"

const bannertext = document.querySelector(".bannertext")
const bannerlist = ["Health Advice Group provides weather info and health advice!", "Hello, World!", "Wow, real boring for a test text, Jacob.", "It's looking wild outside today.", "Yeah! do... that...", "OS MOCK 2!", "Sleep Deprivation Deluxe"]

for (let x = 0; x < bannerlist.length; x++){
    if (x != 0){bannertext.textContent += " --- "}
    bannertext.textContent += bannerlist[x]
}

for (let x = 0; x < 7; x++){
    document.querySelector(".forecast" + x).textContent = new Date().getDate() + x + "/" + new Date().getMonth() + "/" + new Date().getFullYear()
    document.querySelector(".forecastbg" + x).style.backgroundImage = "url('" + "https://art.ngfiles.com/images/3070000/3070983_waspventman_sleep-deprivation-deluxe.png" + "')"
}
document.querySelector(".forecast0").textContent += " (today)"