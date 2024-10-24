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


// Load Auth2 Library
function handleClientLoad(){

    gapi.load('client:auth2', initClient);

}

// Init API Client Library & 
// Set up Sign In Listeners
function initClient(){

    gapi.client.init({

        discoveryDocs : DISCOVERY_DOCS,
        clientId : CLIENT_ID,
        scope: SCOPES

    }) // Returns a Promise
    .then(() => {

        // Listen for Sign In state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

        // Handle initial Sign In state
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        // Handle Log In & Log Out button clicks
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;

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

    gapi.auth2.getAuthInstance().signIn();

}



