// Client ID and API key from the Developer Console
var CLIENT_ID =
  "468244446404-9ve3tahnk9ihbpomp1k7hrqru2krmqpe.apps.googleusercontent.com";
var API_KEY = "AIzaSyDwftw9IiwqEkpf5Bsx5gT73X1Ws-GKcyU";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        listImages();
      },
      function (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listImages() {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: "1BPwDzWroFk-hSNZ4qFr5FFwItIMb6uvkoFJYBbQoe5w",
      range: "B:J",
    })
    .then(
      function (response) {
        var range = response.result;
        var response_list = [];
        if (range.values.length > 0) {
          //response_dict = {'Type': [], 'Name': [], 'Email':[], 'Year':[], 'Image':[], 'Bio':[], 'Comments':[], 'Socials':[], 'Accounts':[]}
          for (i = 1; i < range.values.length; i++) {
            var row = range.values[i];
            response_list.push(row);
          }
          shuffle(response_list);
          loadImages(response_list);
          handleClick(response_list);
        } else {
          console.log("No data found.");
        }
      },
      function (response) {
        console.log("Error: " + response.result.error.message);
      }
    );
}

function loadImages(response_list) {
  const root = document.getElementById("root");
  for (i = 0; i < response_list.length; i++) {
    const column = root.children[i % 4];
    const image = document.createElement("img");
    image.setAttribute("src", response_list[i][4].replace("open", "thumbnail"));
    image.setAttribute("key", i);
    column.appendChild(image);
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

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

function handleClick(array) {
  // 'Type': [], 'Name': [], 'Email':[], 'Year':[], 'Image':[], 'Bio':[], 'Comments':[], 'Socials':[], 'Accounts':[]}
  document.getElementById("root").onclick = function (event) {
    if (event.target.tagName === "IMG") {
      const popup = document.createElement("div");
      popup.id = "popup";
      const popupNote = document.createElement("div");
      popupNote.id = "popup-note";
      document.body.appendChild(popup);
      popup.appendChild(popupNote);
      const index = event.target.getAttribute("key");
      const [
        type,
        nameee,
        email,
        year,
        imageSRC,
        bio,
        comments,
        socials,
        accounts,
      ] = array[index];

      var socialsAndAccs = "";
      try {
        // Make socials into a list
        const accs = accounts.replace(",", "").split(" ");
        const socs = socials.replace(",", "").split(" ");
        // Add image tags for each social
        for (const i in socs) {
          let img = "";
          // Set icon and hyper link for each social media
          let account_name = accs[i].substring(1,accs[i].length);
          console.log("THIS IS WHERE THE ACNT NAME SHOULD SHOW UP:" + account_name)
          switch (socs[i]) {
            case "Instagram":
              img = `
              <a 
                href="https://www.instagram.com/${account_name}/" 
                target="_ig"
                style="text-decoration:none;"
              >
                <img 
                  alt="Instagram" 
                  src="https://image.flaticon.com/icons/svg/174/174855.svg" 
                  width="24" 
                  height="24"
                >
                @${account_name}
              </a>`;
              break;
            case "Facebook":
              img = `
              <a 
                href="https://www.facebook.com/${account_name}/" 
                target="_ig"
                style="text-decoration:none;"
              >
                <img 
                  alt="Facebook" 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png
                  " 
                  width="24" 
                  height="24"
                >
                @${account_name}
              </a>`;
              break;
              case "Twitter":
                img = `
                <a 
                  href="https://www.twitter.com/${account_name}/" 
                  target="_ig"
                  style="text-decoration:none;"
                >
                  <img 
                    alt="Twitter" 
                    src="https://netstorage.ringcentral.com/dpw/apps/BsxqZkBRQaWJ414y5EQOUg/8feb68b7-b638-4f19-9155-cae10c8817db.png"                   " 
                    width="24" 
                    height="24"
                  >
                  @${account_name}
                </a>`;
                break;
          }
          // Add social media icon + link + name
          socialsAndAccs += img + '</br>';
        }
      } catch (e) {
        socialsAndAccs = []; // If organization then leave blank
      }

      // Add html to white background
      popupNote.innerHTML = `
        <div class = "popup-content" style={{"background-image":${imageSRC}}}>
          <p font-size = "20px"><b>${nameee}</b></p>
          <p>${isNaN(year) ? "MIT Group" : "Class of " + year}</p>
          <p>${bio}</p>
          <p>${socialsAndAccs}</p>
        </div>
      `;

      // remove the popup div and children if user clicks anywhere
      popup.onclick = function (event) {
        document.body.removeChild(popup);
        console.log(event.target);
      };
    }
  };
}
