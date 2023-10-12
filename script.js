console.log("script.js init");

// Input sanitization
function sanitizeInput(input) {
    const escapeChars = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#x60;'
    };
    
    return input.replace(/[<>"'`]/g, char => escapeChars[char]);
  }

// Load settings.html
async function loadSettings() {
    const resp = await fetch("settings.html");
    const content = await resp.text();
    
    const settingsContainer = document.querySelector('#container-settings');
    settingsContainer.innerHTML = content;
}

loadSettings();

async function getIP() {

    const resp = await fetch("https://api.ipify.org/?format=json");
    const ip = await resp.json();
    console.log(ip);


    document.querySelector('#ipOutput').innerHTML = `Your ip is ${ip.ip}`;

}

getIP()

async function getJoke() {
    const resp = await fetch("https://official-joke-api.appspot.com/random_joke");
    const joke = await resp.json();
    console.log(joke);

    document.querySelector('#jokeOutput').innerHTML = `<span id="jokeSetup">${joke.setup}</span> <br> <span id="jokePunch">${joke.punchline}</span>`;

}

getJoke()

//https://www.w3schools.com/jsref/prop_nav_geolocation.asp
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeather);
} else {
    console.log()
}



async function getWeather(pos) {

    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;

    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${localStorage.weather_key}&units=metric`);
    const weather = await resp.json();

    console.log(weather);

    document.querySelector('#weatherOutput').innerHTML = `<span id="wHeader">Weather in ${weather.name}: </span><br><span id="wContent">temp ${weather.main.temp}&deg;C <br>wind ${weather.wind.speed} m/s <br>${weather.weather[0].description}</span>`;

    var icon = weather.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

    document.querySelector('#wIcon').setAttribute('src', iconUrl);
}

//gpt()
document.querySelector('#btn-gpt').addEventListener('click', async () => {
    
    const resp = await fetch(`https://openai-ama-api-fw-teaching.rahtiapp.fi/?api_key=${localStorage.gpt_key}`, {
        method: "POST",
        body: JSON.stringify(
            document.querySelector('#gptInput').value
        ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"

        }
    });
    const ans = await resp.json();

    console.log(ans);
    document.querySelector('#gptOutput').innerHTML = ans.answer;

    document.querySelector('#gptInput').value = "";
});


async function getExchangeRate() {
    const resp = await fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json");
    const xrate = await resp.json();

    console.log(xrate);

    const curr = xrate.eur;

    const selectedCurrencies = [
        { "name": "USD", "val": curr.usd },
        { "name": "GBP", "val": curr.gbp },
        { "name": "JPY", "val": curr.jpy },
        { "name": "SEK", "val": curr.sek }
    ]

    for (i = 0; i < selectedCurrencies.length; i++) {
        listItem = selectedCurrencies[i];
        document.querySelector('#exrateList').innerHTML += `
                <div id="exrateList"><li>${listItem.name}    ${listItem.val}</li></div>
            `;
    }

}
getExchangeRate();

