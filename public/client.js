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
const defaultChannel = 'Veritasium';

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
                console.error(response.error);
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
    if (!tokenClient) {
        console.error("Error: tokenClient is not initialized");
        return;
    }
    tokenClient.requestAccessToken({ prompt: "" });
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
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forUsername=${channel}&access_token=${accessToken}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No channel by that name.');  // Error Handling
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Further processing with channel data if needed
        })
        .catch(error => {
            console.error("Error fetching channel data:", error);  // Error Handling
            alert('No channel by that name.');
        });


        /*  Explanation

            Construct URL: 
            The URL is built with part=snippet,contentDetails,statistics and forUsername=${channel}, allowing us to specify the fields we need.

            Pass Access Token: 
            access_token=${accessToken} is added to the URL to authenticate the request.

            Error Handling: 
            If the response.ok is false, the code throws an error that will trigger the .catch block, showing an alert with a "No channel by that name" message.
        
        */

}


// Event Listeners
authorizeButton.onclick = handleAuthClick;
signoutButton.onclick = handleSignoutClick;

