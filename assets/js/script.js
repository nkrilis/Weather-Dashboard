// Current time
let currTime = moment();

let searchTextEl = $("#search-text");
let searchBtnEl = $("#search-button");

// Variables for the main card information
let cityEl = $("#city-main");
let tempEl = $("#temp");
let windEl = $("#wind");
let humidEl = $("#humidity");
let uvEl = $("#uv");
let iconEl = $("#main-icon");

// Array for storing the city names entered
let cityInfoList = [];
let cityName;

// Main function that gets api and does all the work
function getApi ()
{
    let urlCheck;
    
    // call api to convert city name to lon and lad
    let convertCityUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" +searchTextEl.val()+ "&limit=5&appid=508452a6fa84f5b2f7dd18f0d69be33b";
    fetch(convertCityUrl)
    .then(function (response) 
    {
        urlCheck = response.status;
        return response.json();
        console.log(urlCheck);
    })
    .then(function (data) 
    {
        $("#error-message").addClass("visually-hidden");
        // Saving the city name in local storage through function
        console.log(data);
        cityName = data[0].name;
        cityInfoList.push(cityName); 
        saveInLocalStorage(data[0].name);

        // Api request for the 5 day forecast
        let requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ data[0].lat +"&lon="+ data[0].lon +"&exclude=hourly,alerts,minutely&units=metric&appid=508452a6fa84f5b2f7dd18f0d69be33b";
        fetch(requestUrl)
        .then(function (response) 
        {
            return response.json();
        })
        .then(function (data) 
        {
            console.log(data);

            // Updating all the elements on the page to display the information from the api call
            $("#All-info").removeClass("visually-hidden");
            $("#error-message").addClass("visually-hidden");
            console.log( cityName + " Weather \n----------");

            cityEl.text(cityName + " " + currTime.format("M/D/YYYY"));

            iconEl.attr("src", "http://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png")

            tempEl.text("Temp: " + data.current.temp + "°C");

            windEl.text("Wind: " + data.current.wind_speed + " km/h");

            humidEl.text("Humidity: " + data.current.humidity);

            uvEl.text("UV Index: " + data.current.uvi)

            if(data.current.uvi <= 2)
            {
                uvEl.addClass("bg-success p-2 rounded");
            }
            else if(data.current.uvi <= 7)
            {
                uvEl.addClass("bg-warning p-2 rounded");
            }
            else if(data.current.uvi >= 11)
            {
                uvEl.addClass("bg-danger p-2 rounded");
            }
            
            // loop to populate each day of the forecast
            for(let i = 0; i < 5; i++)
            {

                $("[id=date]").eq(i).text(moment.unix(data.daily[i].dt).format("M/D/YYYY"));
                $("[id=icon]").eq(i).attr("src", "http://openweathermap.org/img/wn/"+data.daily[i].weather[0].icon+".png")
                $("[id=day-temp]").eq(i).text("Temp: " +data.daily[i].temp.day+ "°C");
                $("[id=day-wind]").eq(i).text("Wind: " +data.daily[i].wind_speed+ " km/h");
                $("[id=day-humid]").eq(i).text("Humidity: " +data.daily[i].humidity);
            }

        });
        // Function call to create the list of searched cities
        cityHistory();
    });  
}

// Creates the history list
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

    // Add a click event listener to update the search result
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

// Function to save the history in local storage
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
