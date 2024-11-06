// Options
const CLIENT_ID = '610977770552-2reklne551tb7n57dohvfrksmcf865se.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

// Select DOM Elements
const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

// Define default channel by ID
// Define default channel by ID
const defaultChannel = 'UC29ju8bIPH5as8OGnQzwJyA';

// Globals
let tokenClient;
let apiKey

// Get API Key
fetch('/config')
  .then(response => response.json())
  .then(config => {
    apiKey = config.apiKey;
    console.log(apiKey); // Now use apiKey safely in client code
  });



// Load Auth2 Library
function handleClientLoad(){

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            if (response.error) {
                console.error("Error with token response:", response.error);
                return;
            }
            accessToken = response.access_token; // Store the access token
            console.log("Access token:", accessToken);
            updateSignInStatus(true); // Indicate user is signed in
            getChannel(defaultChannel, apiKey); // Pass API Key to your API call
        },
    });

}


// Update UI sign in state changes
function updateSignInStatus(isSignedIn){

    // Check if user signed in
    if(isSignedIn){

        authorizeButton.style.display = 'none'; // Hide sign in button
        signoutButton.style.display = 'block'; // Show sign out button
        content.style.display = 'block'; // Show content
        videoContainer.style.display = 'block'; // Show videos
        getChannel(defaultChannel); // Interact with API

    } else {

        // When signed out
        authorizeButton.style.display = 'block'; // Show sign in button
        signoutButton.style.display = 'none'; 
        content.style.display = 'none'; 
        videoContainer.style.display = 'none'; 

    }
}

// Handle Login
function handleAuthClick(){
    // Check if tokenClient is initialized
    if (tokenClient) {

        tokenClient.requestAccessToken({ prompt: "" });

    } else {

        console.error("Error: tokenClient is not initialized");
        return;

    }
}

// Handle Sign Out
function handleSignoutClick() {
    google.accounts.oauth2.revoke(accessToken, () => {
        console.log('Token revoked');
        updateSignInStatus(false);
    });
}


// Display Channel Data
// Pass getChannel() Output
function showChannelData(data){

    // Select Element 
    const channelData = document.getElementById('channel-data');  

    // Add Output Data
    channelData.innerHTML = data;

}




// Get channel from API
function getChannel(channel, apiKey){

    console.log("Getting channel data for:", channel);

    // Construct URL specify the fields we need
    // Pass API Key
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channel}&key=${apiKey}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {

        // Log Full API Response
        console.log(data);

        // Select Channel Data
        const channel = data.items[0];

        // Create UI Output
        const output = `
            <ul class="collection">
                <li class="collection-item">Title: ${channel.snippet.title}</li>
                <li class="collection-item">ID: ${channel.id}</li>
                <li class="collection-item">Subscribers: ${channel.statistics.subscriberCount}</li>
                <li class="collection-item">Views: ${channel.statistics.viewCount}</li>
                <li class="collection-item">Videos: ${channel.statistics.videoCount}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <a href="https://youtube.com/${channel.snippet.customUrl}" class="btn grey darken-2" target="_blank">Visit Channel</a>
            `;

            // Pass Output to showChannelData()
            showChannelData(output);
        })
        .catch(error => console.error("Error fetching channel data:", error));


}


// Event Listeners
authorizeButton.onclick = handleAuthClick;
signoutButton.onclick = handleSignoutClick;