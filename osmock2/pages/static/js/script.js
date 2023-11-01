const PHiL = "https://waspventman.co.uk"

const bannertext = document.querySelector(".bannertext")
const bannerlist = ["Health Advice Group provides weather info and health advice!", "Hello, World!", "Wow, real boring for a test text, Jacob."]

bannertext.textContent = bannerlist[Math.round(Math.random()*(bannerlist.length-1))]
setInterval(function(){
    bannertext.textContent = bannerlist[Math.round(Math.random()*(bannerlist.length-1))]
}, 10000)