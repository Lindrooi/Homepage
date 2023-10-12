console.log("settings.js init");

let settings;
document.querySelector('#btn-settings-open').addEventListener('click', openSettings);

// Remove redundant "undefined" string when API keys are undefined
function scrubKeyString(api_key) {
    if (api_key == "undefined") {
        api_key = "";
    }
}

let saveMsg; // Message displayed when API keys are saved

// Open settings modal
function openSettings() {
    //console.log("execute openSettings()");
    settings = document.querySelector('#settings');
    settings.showModal();

    activeSettings();
}

// Close settings modal
function closeSettings() {
    //console.log("execute closeSettings()")
    saveMsg.innerHTML = "";
    settings.close();
}

// Global variables for API key input fields
let input_weather_key;
let input_gpt_key;
let input_todo_key;

// Define elements inside settings modal
function activeSettings() {
    document.querySelector('#btn-settings-close').addEventListener('click', closeSettings);
    document.querySelector('#btn-settings-apply').addEventListener('click', saveAPIkeys);

    saveMsg = document.querySelector('#msg-saved');

    input_weather_key = document.querySelector('#weather-apikey');
    input_gpt_key = document.querySelector('#gpt-apikey');
    input_todo_key = document.querySelector('#todo-apikey');

    input_weather_key.value = localStorage.weather_key;
    input_gpt_key.value = localStorage.gpt_key;
    input_todo_key.value = localStorage.todo_key;

    let api_keys = document.querySelectorAll('.input-api-key')
    api_keys.forEach((api_key) => {
        scrubKeyString(api_key);
    });
    
}

// Save new API keys to localStorage
function saveAPIkeys() {
    localStorage.weather_key = input_weather_key.value;
    localStorage.gpt_key = input_gpt_key.value;
    localStorage.todo_key = input_todo_key.value;
    console.log("API keys updated");
    saveMsg.innerHTML = "API keys updated";
}