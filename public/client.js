// Options
const CLIENT_ID = '610977770552-2reklne551tb7n57dohvfrksmcf865se.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

// Select DOM Elements
const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

// Define default channel
const defaultChannel = 'techguyweb';

// Token client
let tokenClient;


// Load Auth2 Library
function handleClientLoad(){

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            if (response.error) {
                console.error(response.error);
                return;
            }
            console.log("Access token:", response.access_token);
            updateSignInStatus(true); // Indicate user is signed in
            getChannel(defaultChannel, response.access_token); // Pass token to your API call
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

    tokenClient.requestAccessToken();
}

// Handle Sign Out
function handleSignoutClick() {
    google.accounts.oauth2.revoke(tokenClient.access_token, () => {
        console.log('Token revoked');
        updateSignInStatus(false);
    });
}


// Get channel from API
function getChannel(channel, accessToken){

    console.log("Getting channel data for:", channel);

    // Call the YouTube API with the access token
    fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${channel}&access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error fetching channel data:", error));
}


// Event Listeners
authorizeButton.onclick = handleAuthClick;
signoutButton.onclick = handleSignoutClick;

