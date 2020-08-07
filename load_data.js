//import gapi from "https://apis.google.com/js/api.js"

// Client ID and API key from the Developer Console
var CLIENT_ID = '468244446404-9ve3tahnk9ihbpomp1k7hrqru2krmqpe.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDwftw9IiwqEkpf5Bsx5gT73X1Ws-GKcyU';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    listImages()
  }, function (error) {
    console.log(JSON.stringify(error, null, 2));
  });
}


/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listImages() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1BPwDzWroFk-hSNZ4qFr5FFwItIMb6uvkoFJYBbQoe5w',
    range: 'B:J',
  }).then(function (response) {
    var range = response.result;
    if (range.values.length > 0) {
      //response_dict = {'Type': [], 'Name': [], 'Email':[], 'Year':[], 'Image':[], 'Bio':[], 'Comments':[], 'Socials':[], 'Accounts':[]}
      response_list = []
      for (i = 1; i < range.values.length; i++) {
        var row = range.values[i];
        response_list.push(row)
      }
      shuffle(response_list)
    } else {
      console.log('No data found.');
    }
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
