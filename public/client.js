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

// Define default channel
const defaultChannel = 'UC29ju8bIPH5as8OGnQzwJyA';

// Token client
let tokenClient;
let accessToken;


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
            getChannel(defaultChannel, accessToken); // Pass token to your API call
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


// Get channel from API
function getChannel(channel, accessToken){

    console.log("Getting channel data for:", channel);

    // Construct URL specify the fields we need
    // Pass Access Token
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channel}&access_token=${accessToken}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            console.log("Full API Response:", data); // Log the entire response
        })
        .catch(error => console.error("Error fetching channel data:", error));


}


// Event Listeners
authorizeButton.onclick = handleAuthClick;
signoutButton.onclick = handleSignoutClick;

