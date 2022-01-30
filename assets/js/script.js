let searchTextEl = $("#search-text");
let searchBtnEl = $("#search-button");

let city;


let cityHistory = [];

function getApi ()
{
    let requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" +searchTextEl.val()+ "&units=metric&appid=508452a6fa84f5b2f7dd18f0d69be33b";
    fetch(requestUrl)
    .then(function (response) 
    {
        return response.json();
    })
    .then(function (data) 
    {
        if(data.cod === '200')
        {
            $("#error-message").addClass("visually-hidden");
            console.log( data.city.name + " Weather \n----------");
            console.log(data);
            
        }
        else
        {
            $("#error-message").text("Error: " + data.message);
            $("#error-message").removeClass("visually-hidden");
            console.log(data.message);
        }
    });
}

searchBtnEl.click(getApi);