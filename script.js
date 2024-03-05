const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const isGeoLocationEnabled = 'geolocation' in window.navigator;
// console.log(window.navigator)

const getUsersCurrentLocationData = () => {
    if(!isGeoLocationEnabled) throw new Error('GeoLocation not enabled for the user');

    return new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition((position) => {
            resolve({latitude: position.coords.latitude, longitude: position.coords.longitude});
        },
        (error) => reject(error))
    })
}

const getWeatherData = async (latitude, longitude) => {
    const URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=667cfabcac7584e4df2329a98a5b905a`
    
    const r = await fetch(URL);
    const res = await r.json();

    return res;
}


const init = async () => {
    try {
        const loc = await getUsersCurrentLocationData();
        const weather = await getWeatherData(loc.latitude, loc.longitude);
        
        console.log(weather);
        displayWeatherInfo(weather, loc);
        
    }
    catch(error) {
        console.log('Something went wrong');
    }
}

const locationName = async (latitude, longitude) => {
    const url = `https://www.mapquestapi.com/geocoding/v1/reverse?key=RXjZSNBN3RpHQigvv8tgPufQhAHkRjOU&location=${latitude},${longitude}&includeRoadMetadata=true&includeNearestIntersection=true`
    const r = await fetch(url);
    const res = await r.json();
    return res;
}

//--------------------------Set Background Image----------------//
const setBackgroundImage = (id, hr) => {
    const body = document.getElementById('main');
    const id_s = Math.round(id/100);
    if(id_s === 2)  setImage_fontWhite(body, 'thunderstorm');
    else if(id_s === 3) setImage_fontWhite(body, 'drizzle');
    else if(id_s === 5) setImage_fontWhite(body, 'rain');
    else if(id_s === 6) setImage_fontWhite(body, 'snow');
    else if(id_s === 7) setImage_fontWhite(body, 'mist');
    else if(id === 800) setDayNightImage_fontWhite (body, hr, 'clear_sky_day', 'clear_sky_night');
    else if(id === 801 || id === 802) setImage_font_Day_Night(body, hr, 'few_scattered_clouds_3', 'few_scatterd_clouds_night_1');
    else if(id === 803 || id === 804) setImage_font_Day_Night(body, hr, 'overcast_clouds_day', 'overcast_clouds_night');
}

const setImage_fontWhite = (body, image) => {
    body.style.backgroundImage = `url('/images/${image}.jpg')`;
    body.style.color = 'white';
}

const setDayNightImage_fontWhite = (body, hr, dayImage, nightImage) => {
    if(hr > 5 && hr < 19) body.style.backgroundImage = `url('/images/${dayImage}.jpg')`;
    else body.style.backgroundImage = `url('/images/${nightImage}.jpg')`;
    body.style.color = 'white';
}

const setImage_font_Day_Night = (body, hr, dayImage, nightImage) => {
    if(hr > 5 && hr < 19){
        body.style.backgroundImage = `url('/images/${dayImage}.jpg')`;
        body.style.color = 'black';
    }
    else{
        body.style.backgroundImage = `url('/images/${nightImage}.jpg')`;
        body.style.color = 'white';
    }
}
//---------------------------------------------------------------//

//----------Functions for epoch date conversion to normal mode and reusing it------------------//
const convert_epoch = (epoch) => new Date(epoch * 1000);

const getDay = (full_date) => days[`${full_date.getDay()}`];

const getDate = (full_date) => full_date.getDate();

const getMonth = (full_date) => months[`${full_date.getMonth()}`];

const getYear = (full_date) => full_date.getFullYear();

const getHours = (full_date) => {
    if(full_date.getHours() === 0)
        return 12;
    else if(full_date.getHours() < 10) 
        return '0' + full_date.getHours();
    else if(full_date.getHours() >= 10 && full_date.getHours() <= 12) 
        return full_date.getHours();
    else if(full_date.getHours() > 12 && full_date.getHours() < 22)
        return '0' + (full_date.getHours() - 12);
    else if(full_date.getHours() >= 22 && full_date.getHours() <= 23)
        return (full_date.getHours() - 12);
}

const getMeridian = (full_date) => {
    if(full_date.getHours() > 12) return 'PM';
    return 'AM';
}

const getMinutes = (full_date) => {
    if(full_date.getMinutes() < 10)
        return '0' + full_date.getMinutes();
    return full_date.getMinutes();
}

const getCurrentTime = (curr_hours, curr_minutes, meridian) => curr_hours + ":" + curr_minutes + " " + meridian;

//----------------Create and set data in hr(hourly data) containers-----------------------//
//----------------Create hr(hourly data) containers----------------//
const createHrContainers = (i) => {
    const parent_container = document.getElementById('next_24_hours_container');

    const container = document.createElement('div');
    container.setAttribute('id', 'hr'+i);
    container.setAttribute('class', 'hr');

    const temp_container = document.createElement('div');
    temp_container.setAttribute('id', 'hr'+i+'_temp_value');
    temp_container.setAttribute('class', 'hr_temp_val');

    const icon_container = document.createElement('div');
    icon_container.setAttribute('id', 'hr'+i+'_wthr_icon');
    icon_container.setAttribute('class', 'hr_wthr_icon');

    const time_container = document.createElement('div');
    time_container.setAttribute('id', 'hr'+i+'_time');
    time_container.setAttribute('class', 'hr_time');

    container.append(temp_container);
    container.append(icon_container);
    container.append(time_container);

    parent_container.append(container);
}
//------------------------------------------------------------//

//----------------Set hr(hourly data) containers----------------//
const setDataInHrContainers = (wthr, i) => {
    //-----set temp value-----//
    const hr_temp_value = document.getElementById('hr'+i+'_temp_value');
    hr_temp_value.innerHTML = Math.round(wthr.hourly[`${i}`].temp) + '&deg;';
    //-----------------------//

    //-----set weather icon-----//
    const hr_wthr_icon = document.getElementById('hr'+i+'_wthr_icon');
    const hr_iconNo = wthr.hourly[`${i}`].weather[0].icon;

    const hr_icon = document.createElement('img');
    hr_icon.setAttribute('src', `/icon/${hr_iconNo}.png`);
    hr_icon.setAttribute('alt', wthr.hourly[`${i}`].weather[0].description);
    hr_icon.setAttribute('height', '40px');
    hr_icon.setAttribute('width', '40px');

    hr_wthr_icon.prepend(hr_icon);
    //-----------------------//

    //-----set time value-----//
    const hr_date_time = convert_epoch(wthr.hourly[`${i}`].dt);
    const hr_hours = typeof(getHours(hr_date_time)) === 'number' ? getHours(hr_date_time) : getHours(hr_date_time).slice(1);
    const hr_meridian = getMeridian(hr_date_time);

    const hr_time = document.getElementById('hr'+i+'_time');
    hr_time.innerHTML = hr_hours + ' ' + hr_meridian.toLowerCase();
    //-----------------------//
}
//------------------------------------------------------------//

//---------------------------------------------------------------------------//

//----------------Create and set data in next 7 days weather containers-----------------------//
//----------------Create next 7 days weather containers----------------//
const createDayContainers = (i) => {
    const parent_container = document.getElementById('next_7_days_container');

    const container = document.createElement('div');
    container.setAttribute('id', 'day'+i);
    container.setAttribute('class', 'day');

    const temp_container = document.createElement('div');
    temp_container.setAttribute('id', 'day'+i+'_temp_value');
    temp_container.setAttribute('class', 'day_temp_val');

    const icon_container = document.createElement('div');
    icon_container.setAttribute('id', 'day'+i+'_wthr_icon');
    icon_container.setAttribute('class', 'day_wthr_icon');

    const day_name_container = document.createElement('div');
    day_name_container.setAttribute('id', 'day'+i+'_name');
    day_name_container.setAttribute('class', 'day_name');

    container.append(temp_container);
    container.append(icon_container);
    container.append(day_name_container);

    parent_container.append(container);
}
//------------------------------------------------------------//

//----------------Set next 7 days weather data in containers----------------//
const setDataInDayContainers = (wthr, i) => {
    //-----set temp value-----//
    const day_temp_value = document.getElementById('day'+i+'_temp_value');
    day_temp_value.innerHTML = Math.round(wthr.daily[`${i}`].temp.max) + '&deg;/' + Math.round(wthr.daily[`${i}`].temp.min) + '&deg;';
    //-----------------------//

    //-----set weather icon-----//
    const day_wthr_icon = document.getElementById('day'+i+'_wthr_icon');
    const day_iconNo = wthr.daily[`${i}`].weather[0].icon;

    const day_icon = document.createElement('img');
    day_icon.setAttribute('src', `/icon/${day_iconNo}.png`);
    day_icon.setAttribute('alt', wthr.daily[`${i}`].weather[0].description);
    day_icon.setAttribute('height', '70px');
    day_icon.setAttribute('width', '70px');

    day_wthr_icon.prepend(day_icon);
    //-----------------------//

    //-----set day name value-----//
    const day_date_time = convert_epoch(wthr.daily[`${i}`].dt);
    const date = document.getElementById('day'+i+'_name');
    date.innerHTML = getDay(day_date_time).substring(0, 3) + ', ' + day_date_time.getDate() + ' ' + getMonth(day_date_time);
    //-----------------------//

    //-------set summary value for the day------//
    const day_summary = document.getElementById('day' + i);
    day_summary.setAttribute('title', wthr.daily[`${i}`].summary);
    //-----------------------------------------//
}
//------------------------------------------------------------//

//---------------------------------------------------------------------------//
//---------Main weather icon display-----------------//
const mainWeatherIcon = (wthr) => {
    const main_weather_icon = document.getElementById('curr_weather_icon');
    const iconNo = wthr.current.weather[0].icon;

    const img = document.createElement('img');
    img.setAttribute('src', `/icon/${iconNo}.png`);
    img.setAttribute('alt', wthr.current.weather[0].main);

    main_weather_icon.append(img);
}
//-------------------------------------------------------//

//---------Temperature display for the day-------------------//
const currentTempForTheDay = (wthr) => {
    const curr_weather_temp = document.getElementById('curr_weather_temp');
    const temp = Math.round(wthr.current.temp);
    curr_weather_temp.innerHTML = temp;

    const degree = document.getElementById('degree');
    degree.innerHTML = '&deg;C';
}
//-------------------------------------------------------//

//---------Current location display----------------------//
const currLocationDisplay = async (loc) => {
    const locName = await locationName(loc.latitude, loc.longitude);
    console.log(locName);
    const city = locName.results[0].locations[0].adminArea5;
    const state = locName.results[0].locations[0].adminArea3;
    const country = locName.results[0].locations[0].adminArea1;
    // console.log(city, state, country);
    const location = document.getElementById('locName');
    location.innerHTML = city + ", " + state + ", " + country;
}
//-------------------------------------------------------//

//---------Current day and date display------------------//
const currDayAndDateDisplay = (wthr) => {
    const full_date = convert_epoch(wthr.current.dt);
    const today_day = getDay(full_date);
    const today_date = getDate(full_date);
    const today_month = getMonth(full_date);
    const today_year = getYear(full_date);
    const curr_hours = getHours(full_date);
    const curr_minutes = getMinutes(full_date);
    const meridian = getMeridian(full_date);
    const curr_time = getCurrentTime(curr_hours, curr_minutes, meridian);
    

    const time = document.getElementById('curr_time');
    time.innerHTML = 'As of ' + curr_time;

    const day = document.getElementById('curr_day');
    day.innerHTML = today_day;

    const date = document.getElementById('curr_date');
    date.innerHTML = today_month + " " + today_date + ", " + today_year;
}
//-------------------------------------------------------//

//---------Set Weather Type--------//
const setWeatherType = (wthr) => {
    const w_type = document.getElementById('weather_type');
    const weather_type = wthr.current.weather[0].description;
    const modified_weather_type = weather_type.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    w_type.innerHTML = modified_weather_type;
}
//---------------------------------//

//---------Set Feels Like--------//
const setFeelsLike = (wthr) => {
    const feels_like = document.getElementById('feels_like');
    feels_like.innerHTML = `Feels like &nbsp;${Math.round(wthr.current.feels_like)}&deg;C`;
}
//-------------------------------//

//---------Set Day Night Temp--------//
const setDayNightTemp = (wthr) => {
    const day_temp = document.getElementById('day_temp');
    day_temp.innerHTML = 'Day &nbsp;&nbsp;&nbsp;&nbsp;' + Math.round(wthr.daily[0].temp.day) + '&deg;C';

    const night_temp = document.getElementById('night_temp');
    night_temp.innerHTML = 'Night &nbsp;' + Math.round(wthr.daily[0].temp.night) + '&deg;C';
}
//-----------------------------------//

//------Create sunrise sunset container------//
const createSunriseSunsetContainer = (wthr, event, epoch) => {
    const event_date_time = convert_epoch(epoch);
    const event_time = getCurrentTime(getHours(event_date_time), getMinutes(event_date_time), 'AM');
    console.log(event_time);

    setEventTime(event_time, event);
    const event_icon = setEventIcon(event, '40px', '40px');

    const sun_event = document.getElementById(`${event}_container`);
    sun_event.prepend(event_icon);
}

//-------------Set Event Time------------------------------//
const setEventTime = (time, event) => {
    const event_time = document.getElementById(`${event}_time`);
    event_time.innerHTML = time;
}

//-------------Set Event Icon------------------------------//
const setEventIcon = (event, h, w) => {
    const event_icon = document.createElement('img');
    event_icon.setAttribute('src', `/icon/${event}.png`);
    event_icon.setAttribute('alt', `${event}`);
    event_icon.setAttribute('height', h);
    event_icon.setAttribute('width', w);

    return event_icon;
}
//------------Set Event Icon text--------------------------//
const setEventIconText = (event, icon) => {
    const event_icon_text = document.getElementById(`${event}_icon_text`);
    event_icon_text.prepend(icon);
}

//-------------Set High Low Temp value----------------//
const setHighLowValue = (wthr) => {
    const hi_lo_icon = setEventIcon('hi_lo', '25px', '25px');

    setEventIconText('hi_lo', hi_lo_icon);

    const today_hi_lo_temp_value = document.getElementById('today_hi_lo_temp_value');
    today_hi_lo_temp_value.innerHTML = Math.round(wthr.daily[0].temp.max) + '&deg;/' + Math.round(wthr.daily[0].temp.min) +'&deg;';
}
//-----------Set wind info----------------------//
const setWindInfo = (wthr) => {
    const wind_icon = setEventIcon('wind', '25px', '25px');
    
    setEventIconText('wind', wind_icon);

    const wind_value = document.getElementById('wind_value');
    wind_value.innerHTML = Math.round(wthr.current.wind_speed * 3.6) + ' km/h';
}
//----------Set Precipitation value-------------//
const setPrecipitationVal = (wthr) => {
    const precipitation_icon = setEventIcon('precipitation', '25px', '25px');

    setEventIconText('precipitation', precipitation_icon);

    const today_precipitation_value = document.getElementById('today_precipitation_value');
    today_precipitation_value.innerHTML = wthr.hourly[0].pop;
}
//----------Set Humidity value-------------//
const setHumidityVal = (wthr) => {
    const humidity_icon = setEventIcon('humidity', '25px', '25px');

    setEventIconText('humidity', humidity_icon);

    const humidity_value = document.getElementById('humidity_value');
    humidity_value.innerHTML = wthr.current.humidity + '%';
}
//----------Set Visibility value-------------//
const setVisibility = (wthr) => {
    const visibility_icon = setEventIcon('visibility', '25px', '25px');

    setEventIconText('visibility', visibility_icon);

    const visibility_value = document.getElementById('visibility_value');
    visibility_value.innerHTML = (wthr.current.visibility/1000).toFixed(2) + ' km';
}
//----------Set Visibility value-------------//
const setUVIndex = (wthr) => {
    const uv_index_icon = setEventIcon('uv', '25px', '25px');

    setEventIconText('uv_index', uv_index_icon);

    const uv_index_value = document.getElementById('uv_index_value');
    uv_index_value.innerHTML = wthr.current.uvi;
}

const setPressureVal = (wthr) => {
    const pressure_icon = setEventIcon('pressure', '25px', '25px');

    setEventIconText('pressure', pressure_icon);

    const pressure_value = document.getElementById('pressure_value');
    pressure_value.innerHTML = wthr.current.pressure + ' mb';
}

const setDewVal = (wthr) => {
    const dew_icon = setEventIcon('dew', '25px', '25px');

    setEventIconText('dew', dew_icon);

    const dew_value = document.getElementById('dew_value');
    dew_value.innerHTML = Math.round(wthr.current.dew_point) + '&deg;';
}
//---------------------------------------------------------------------------------------------------------------//

const displayWeatherInfo = async (wthr, loc) => {

    //---------Current weather icon display-----------------//
    mainWeatherIcon(wthr);
    
    //---------Current temperature display-------------------//
    currentTempForTheDay(wthr);

    //---------Current location display----------------------//
    currLocationDisplay(loc);

    //---------Current day and date display------------------//
    currDayAndDateDisplay(wthr);
    //-------------------------------------------------------//

    const full_date = convert_epoch(wthr.current.dt);

    //------------Set Background Image---------------------//
    setBackgroundImage(wthr.current.weather[0].id, full_date.getHours());


    //--------------------Left container--------------------------------------------//
    //---------Weather Type--------//
    setWeatherType(wthr);

    //---------Feels Like--------//
    setFeelsLike(wthr);

    //---------Day Night Temp--------//
    setDayNightTemp(wthr);

    //---------Sunrise & Sunset--------//
    createSunriseSunsetContainer(wthr, 'sunrise', wthr.daily[0].sunrise);

    createSunriseSunsetContainer(wthr, 'sunset', wthr.daily[0].sunset);
    //-------------------------------//

    //--------------------------------------------------------------------------------//

    //--------------------Right container---------------------------------------------//
    //----hi_lo_weather_and_wind_info_container----//
    setHighLowValue(wthr);

    setWindInfo(wthr);

    //----precipitation_and_humidity_info_container----//
    setPrecipitationVal(wthr);

    setHumidityVal(wthr);

    //----visibility_and_uv_index_info_container----//
    setVisibility(wthr);

    setUVIndex(wthr);

    //----pressure_and_dew_info_container----//
    setPressureVal(wthr);

    setDewVal(wthr);
    //-------------------------------------------------------------------------------//

    //--------------------Container 3------------------------//
    //----------Summary--------------//
    const summary_description = document.getElementById('summary_description');
    summary_description.innerHTML = wthr.daily[0].summary;
    //-------------------------------------------------------//


    //----------------Hourly weather container----------------------//
    //------Create 24 containers for next 24 hours data------//
    for(let i=1; i<25; i++) {
        createHrContainers(i);
    }

    //------Fill 24 containers with next 24 hours data------//
    for(let i=1; i<25; i++) {
        setDataInHrContainers(wthr, i);
    }
    //----------------------------------------------------------------//
    

    //----------------Weekly weather container----------------------//
    //------Create 7 containers for next 7 days data------//
    for(let i=0; i<8; i++) {
        createDayContainers(i);
    }

    //------Fill 7 containers with next 7 days data------//
    for(let i=0; i<8; i++) {
        setDataInDayContainers(wthr, i);
    }
    //-------------------------------------------------------------//

}

init();