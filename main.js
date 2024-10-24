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

