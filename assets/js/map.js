

   let cityName = null;
   let querySelected = null;

   let radio = $("input[type='radio']");
   radio.change(function() {
      let filteredRadio = radio.filter(":checked");
      querySelected = filteredRadio.val();
      console.log(querySelected)
   });

   $("#submitCity").on("click", (e) => {
     e.preventDefault();
     cityName = $("#inputCity").val();

      $("#map").remove();
      $("#container-map").append('<div id="map" height="100px" width="100px"></div>');

     getVenues();

     console.log(cityName)
   })

   getVenues();

// Foursquer API

function getVenues() {

   const endPoint = "https://api.foursquare.com/v2/venues/explore?";
   const client_id = "FHYZP5IIDLYMMWGXEGXQU0SDZANGGKMEIU1ZWFUCOINVQFWT";
   const client_secret = "350EQKKN5RFDLJEEMMRLQZ2ESRVNQUAEB2EAR2PYZWQWWPUF";
   const query = querySelected;
   const near = cityName;
   const v = 20180323;

  fetch(`${endPoint}client_id=${client_id}&client_secret=${client_secret}&v=${v}&limit=20&near=${near}&query=${query}`)
    .then(function(response) {
        // Code for handling API response
        return response.json();
    })
    .then(function(data) {
      let dataAPI = [];
      dataAPI = data.response.groups[0].items;
      console.log(dataAPI)
      getMap(dataAPI)
    })
    .catch(function(error) {
        // Code for handling errors
        console.log("Error!!!" + error)
    });
}

// Rendering the map

function getMap(dataAPI) {

   // if value in input is empty, then set view Europe, else the selected city
   if (cityName === null) {
      var mymap = L.map('map').setView([50.058362, 14.454384], 5);
   } else {
      var mymap = L.map('map').setView([dataAPI[0].venue.location.lat, dataAPI[0].venue.location.lng], 8);
   }
   

   L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoidG9tYXMta2Fpc2VyIiwiYSI6ImNqaWsxcXBlZjFzYXUzcG43d3Z3dzBnengifQ.mQDUjX4MQ49QWM-Yz4u19g'
   }).addTo(mymap);

   dataAPI.map( myVenue => {
      var marker = L.marker([myVenue.venue.location.lat, myVenue.venue.location.lng]).addTo(mymap);
      marker.bindPopup(`
         <h4>${myVenue.venue.name}</h4>
         <p>Adress of venue:</p>
         <ul>
            <li>${myVenue.venue.location.address}</li>
            <li>${myVenue.venue.location.city}</li>
            <li>${myVenue.venue.location.country}</li>
         </ul>
      `);
   });
}