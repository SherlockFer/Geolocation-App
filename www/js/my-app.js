// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");

});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

});

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
});

currentLoc();
weather();



function currentLoc(){
    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
    var lat2 = position.coords.latitude;
    var lon2 = position.coords.longitude;
    //var lat2=+document.getElementById('latcall').value;
    //var lon2=+document.getElementById('loncall').value;

    var apikey = 'c9f0eeb45f7a47448d8a056a87452acd';
    var latitude = lat2;
    var longitude = lon2;
    var api_url = 'https://api.opencagedata.com/geocode/v1/json';
  
    var request_url = api_url+ '?'+ 'key=' +encodeURIComponent(apikey)+ '&q=' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude)+ '&pretty=1' + '&no_annotations=0';
  
    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward
  
    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
  
    request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes
  
      if (request.status == 200){ 
        // Success!
        var data = JSON.parse(request.responseText);
        //alert(data.results[0].formatted);
        console.log(data);
        
        //fill in data to show the current position
        var flag = data.results[0].annotations.flag;
        var address=data.results[0].formatted;
        var postcode=data.results[0].components.postcode;
        var city = data.results[0].components.city;
        var country = data.results[0].components.country;
        var currency = data.results[0].annotations.currency.name;
        var isocode = data.results[0].annotations.currency.iso_code;
        

        // Formattng data to put it on the front end
        var location = "</br>Country: " + country +flag+"</br>City: " + city +"</br>PostCode: " + postcode +"</br>house number: " + address ;
        var weatherLocation = "City: " + city ;


        // Placing formatted data on the front ed
        document.getElementById('city').innerHTML = city;
        document.getElementById('cityWelcome').innerHTML = city;
        document.getElementById('location').innerHTML = location;
        document.getElementById('currency').innerHTML = currency;
        document.getElementById('isocode').innerHTML = isocode;

        document.getElementById('cityWeather').innerHTML = weatherLocation;

  
      } else if (request.status <= 500){ 
      // We reached our target server, but it returned an error
                             
        console.log("unable to geocode! Response code: " + request.status);
        var data2 = JSON.parse(request.responseText);
        console.log(data2.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        console.log("unable to connect to server");        
    };

    request.send();

    //to display the map for the current location

    // Defining a position to display
    var myposition = {lat: lat2, lng: lon2};
    
    // Creating the map, centred on the position 
    // defined above
    var myMap = new google.maps.Map(document.getElementById('myMap2'),
        {zoom: 18,
        center: myposition });
    
    // Creating a marker to place on the map
    // at the position defined above
    var marker = new google.maps.Marker(
        { position: myposition,
         map: myMap });
    

    // REMEMBER: I added some style to the style file
    // to be able to display the map!!!

    }
    
    function error() {
        location.innerHTML = "Unable to retrieve your location";
      }
}

function weather() {

  //var location = document.getElementById("location");
  var apiKey = 'f536d4c3330c0a1391370d1443cee848'; // PLEASE SIGN UP FOR YOUR OWN API KEY
  var url = 'https://api.forecast.io/forecast/';

  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    jQuery.getJSON(url + apiKey + "/" + latitude + "," + longitude + "?callback=?", function(data) {
      console.log(data);
        var farentemp = data.currently.temperature;
        var centtemp=(farentemp-32)*5/9;
        centtempform = parseFloat(Math.round(centtemp * 100) / 100).toFixed(1);
        document.getElementById('temperature').innerHTML = centtempform+' °C';
        document.getElementById('temperatureC').innerHTML = "Temperature: "+centtempform+' °C';

        var apartemp = data.currently.apparentTemperature;
        var centtemp2=(apartemp-32)*5/9;
        centtempform2 = parseFloat(Math.round(centtemp2 * 100) / 100).toFixed(1);
        document.getElementById('apartemperature').innerHTML = "Feels like: "+centtempform2+' °C';

        var icon = data.currently.icon;
        document.getElementById('icon').innerHTML = icon;

        var condition=data.minutely.summary;
        document.getElementById('condition').innerHTML = condition;

        var humidity = data.currently.humidity;
        document.getElementById('humidity').innerHTML = humidity*100+" %";
        
        var summary = data.currently.summary;
        document.getElementById('summary').innerHTML = summary;

        var pressure = data.currently.pressure;
        document.getElementById('pressure').innerHTML = pressure+" hPa";
        
        var precipProbability = data.currently.precipProbability;
        document.getElementById('precipProbability').innerHTML = precipProbability*100+" %";

        var dayly= data.daily.summary;
        document.getElementById('today').innerHTML = "today : "+dayly;
    });
  }

  function error() {
    location.innerHTML = "Unable to retrieve your location";
  }

  //location.innerHTML = "Locating...";
}


//invoke toUSD function to display the convertion of money from Dollars to Euros
function convert(id){

    //declaration of variables to make an HTTP request
    var apikey = '033bd71ee6e561787d172fcccb6f9e64';
    var api_url = 'http://apilayer.net/api/live';
    var fromcurrancy='PEN';
    
    //declaration of variable url to access the currancylayer data
    var request_url = api_url+ '?' + 'access_key=' +encodeURIComponent(apikey)+'&currancies='+encodeURIComponent(fromcurrancy)+'&format=1';
    
    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
    
    request.onload = function() {
    
      if (request.status == 200){ 
        // Success!
        var data = JSON.parse(request.responseText);
        console.log(data);

        var isoCodeUSD='USD';
        var myIsoCode=document.getElementById('isocode').innerHTML;
        
        var currentCode=isoCodeUSD+myIsoCode;
        console.log(currentCode);
        var amount=+document.getElementById('number').value;
        if(amount<0){
            alert("number must be greater than 0");
            document.getElementById('result').innerHTML="Waiting";
            return false;
        }


        var rate =data.quotes[currentCode];

        if (id==1){
        resultA = parseFloat(Math.round(amount/rate * 100) / 100).toFixed(2);
        document.getElementById('result').innerHTML=resultA+" USD";
        }else if(id==2){
        resultB = parseFloat(Math.round(amount*rate * 100) / 100).toFixed(2);
        document.getElementById('result').innerHTML=resultB+" "+myIsoCode;
        }
        document.getElementById('rateA').innerHTML=parseFloat(Math.round(1*rate * 100) / 100).toFixed(2);
        document.getElementById('rateB').innerHTML=parseFloat(Math.round(1/rate * 100) / 100).toFixed(2);
        
    
    } else if (request.status <= 500){ 
        // We reached our target server, but it returned an error
                               
          console.log("unable to geocode! Response code: " + request.status);
          var data2 = JSON.parse(request.responseText);
          console.log(data2.status.message);
        } else {
          console.log("server error");
        }
      };
    
      request.onerror = function() {
          // There was a connection error of some sort
          console.log("unable to connect to server");        
      };
      request.send();
    
    
    }

        //document.getElementById('result').innerHTML=(data.quotes.USDEUR)*numberfrom+' euros';

    function convertA(){
        convert(1);
    }

    function convertB(){
        convert(2);
    }

  function goScreen(number){
    document.getElementById('screen'+[number]).scrollIntoView();
  }

  function goHome(){

    document.getElementById('Home').scrollIntoView();
  }

  function initMap() {} // now it IS a function and it is in global
  

  //Picture
  function pics(){
    navigator.camera.getPicture(cameraCallback, onError);
    }
    function cameraCallback(imageData) {
    var image = document.getElementById("myImage");
    image.src= imageData;
    }


//files
function tryingFile(){

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
 
}

function fileSystemCallback(fs){

  // Name of the file I want to create
  var fileToCreate = "newPersistentFile.txt";

  // Opening/creating the file
  fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };

function getFileCallback(fileEntry){
  
  var dataObj = new Blob(['Hello'], { type: 'text/plain' });
  // Now decide what to do
  // Write to the file
  writeFile(fileEntry, dataObj);

  // Or read the file
  readFile(fileEntry);
}

// Let's write some files
function writeFile(fileEntry, dataObj) {

  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(function (fileWriter) {

      // If data object is not passed in,
      // create a new Blob instead.
      if (!dataObj) {
          dataObj = new Blob(['Hello'], { type: 'text/plain' });
      }

      fileWriter.write(dataObj);

      fileWriter.onwriteend = function() {
          console.log("Successful file write...");
      };

      fileWriter.onerror = function (e) {
          console.log("Failed file write: " + e.toString());
      };

  });
}

// Let's read some files
function readFile(fileEntry) {

  // Get the file from the file entry
  fileEntry.file(function (file) {
      
      // Create the reader
      var reader = new FileReader();
      reader.readAsText(file);

      reader.onloadend = function() {

          console.log("Successful file read: " + this.result);
          console.log("file path: " + fileEntry.fullPath);

      };

  }, onError);
}

function onError(msg){
  console.log(msg);
}

