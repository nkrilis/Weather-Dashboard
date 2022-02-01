let currTime = moment();

let searchTextEl = $("#search-text");
let searchBtnEl = $("#search-button");

// Variables for the main card information
let cityEl = $("#city-main");
let tempEl = $("#temp");
let windEl = $("#wind");
let humidEl = $("#humidity");
let uvEl = $("#uv");


let cityInfoList = [];
let cityName;


function getApi ()
{
    let urlCheck;

    let convertCityUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" +searchTextEl.val()+ "&limit=5&appid=508452a6fa84f5b2f7dd18f0d69be33b";
    fetch(convertCityUrl)
    .then(function (response) 
    {
        urlCheck = response.status;
        return response.json();
    })
    .then(function (data) 
    {
        console.log(data);
        cityName = data[0].name;
        cityInfoList.push(cityName); 
        saveInLocalStorage(data[0].name);

        let requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ data[0].lat +"&lon="+ data[0].lon +"&exclude=hourly,alerts,minutely&units=metric&appid=508452a6fa84f5b2f7dd18f0d69be33b";
        fetch(requestUrl)
        .then(function (response) 
        {
            return response.json();
        })
        .then(function (data) 
        {
            console.log(data);

            $("#All-info").removeClass("visually-hidden");
            $("#error-message").addClass("visually-hidden");
            console.log( cityName + " Weather \n----------");

            cityEl.text(cityName + " " + currTime.format("M/D/YYYY"));

            tempEl.text("Temp: " + data.current.temp + "°C");

            windEl.text("Wind: " + data.current.wind_speed + " km/h");

            humidEl.text("Humidity: " + data.current.humidity);

            uvEl.text("UV Index: " + data.current.uvi)
            
            for(let i = 0; i < 5; i++)
            {

                $("[id=date]").eq(i).text(moment.unix(data.daily[i].dt).format("M/D/YYYY"));
                $("[id=day-temp]").eq(i).text("Temp: " +data.daily[i].temp.day+ "°C");
                $("[id=day-wind]").eq(i).text("Wind: " +data.daily[i].wind_speed+ " km/h");
                $("[id=day-humid]").eq(i).text("Humidity: " +data.daily[i].humidity);
            }

        });
        cityHistory();
    });  
}

function cityHistory() 
{
    $( "[id=list-item]" ).remove();
    let list = JSON.parse(localStorage.getItem("Cities"))

    if(localStorage.getItem("Cities") === null)
    {
        localStorage.setItem("Cities", JSON.stringify(cityInfoList));
    }

    for(let i = 0; i < list.length; i++)
    {
        var listItem = $("<a></a>").text(list[i]);
        listItem.addClass("list-group-item list-group-item-action")
        listItem.attr("id", "list-item");
        $("#history").append(listItem);
        
    }

    document.querySelectorAll("#list-item").forEach(item => 
    {
        item.addEventListener('click', event => 
        {
            //handle click
            searchTextEl.val(item.text);
            getApi();
        })
    })
    

}

function saveInLocalStorage (name)
{
    let data = localStorage.getItem("Cities");

    if(!data.includes(name))
    {
        data = data ? JSON.parse(data) : [];

        data.push(name);
    
        localStorage.setItem("Cities", JSON.stringify(data));
    }
}

cityHistory();
searchBtnEl.click(getApi);
