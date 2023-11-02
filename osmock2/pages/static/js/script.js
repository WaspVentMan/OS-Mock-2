const PHiL = "https://waspventman.co.uk"

const bannertext = document.querySelector(".bannertext")
const bannerlist = ["Health Advice Group provides weather info and health advice!", "Hello, World!", "Wow, real boring for a test text, Jacob.", "It's looking wild outside today.", "Yeah! do... that..."]

for (let x = 0; x < bannerlist.length; x++){
    if (x != 0){bannertext.textContent += " --- "}
    bannertext.textContent += bannerlist[x]
}