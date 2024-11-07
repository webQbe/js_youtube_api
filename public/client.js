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


// Globals
let tokenClient;
let apiKey
let channelId = 'UC29ju8bIPH5as8OGnQzwJyA';


// Form Submit & Change Channel
channelForm.addEventListener('submit', e => {

    e.preventDefault(); // Stop submission

    // Get channel title
    channelTitle = channelInput.value;

    // Pass input to searchChannelByTitle()
    searchChannelByTitle(channelTitle, apiKey)

});


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
            getChannel(channelId, apiKey); // Pass API Key to your API call
        },
    })

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


function searchChannelByTitle(channelTitle, apiKey) {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelTitle)}&type=channel&key=${apiKey}`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const channelId = data.items[0].snippet.channelId;
                console.log("Found channel ID:", channelId);
                
                // Now use the channel ID to fetch full channel details
                getChannel(channelId, apiKey);
            } else {
                alert('No channel found with that title.');
            }
        })
        .catch(error => console.error("Error searching for channel:", error));
}


// Get channel from API
function getChannel(channelId, apiKey){

    console.log("Getting channel data for:", channelId);

    // Construct URL specify the fields we need
    // Pass API Key
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`;

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
                <li class="collection-item">Subscribers: ${NumberWithCommas(channel.statistics.subscriberCount)}</li>
                <li class="collection-item">Views: ${NumberWithCommas(channel.statistics.viewCount)}</li>
                <li class="collection-item">Videos: ${NumberWithCommas(channel.statistics.videoCount)}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <a href="https://youtube.com/${channel.snippet.customUrl}" class="btn grey darken-2" target="_blank">Visit Channel</a>
            `;

            // Pass Output to showChannelData()
            showChannelData(output);

            // Get PlaylistID From Response
            const playlistId = channel.contentDetails.relatedPlaylists.uploads;

            // Get Playlist Item Data
            // Pass PlaylistID to requestVideoPlaylist()
            requestVideoPlaylist(playlistId);

        })
        .catch(error => console.error("Error fetching channel data:", error));
    }


// Display Channel Data
// Pass getChannel() Output
function showChannelData(data){

    // Select Element 
    const channelData = document.getElementById('channel-data');  

    // Add Output Data
    channelData.innerHTML = data;

}

// Format a number with commas as thousands separators
function NumberWithCommas(number) {

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    /* Explanation

        \B asserts that the position is not at the start or end of a word (non-word boundary).

        (?=(\d{3})+(?!\d)) is a lookahead that ensures each group of three digits is followed by a position where there is no further digit.
        
        g is the global flag to apply the regex throughout the string.
    
     */

}


function requestVideoPlaylist(playlistId, apiKey){

    // Define the API endpoint with the parameters
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${apiKey}`;

     // Make the request
     fetch(url)
     .then(response => response.json())
     .then(data => {

        // Log Response
        console.log(data);

        // Select Items
        const playlistItems = data.items
        
        // If playlistItems Available
         if (playlistItems) {

             // Display Playlist Title
             let output = '<h4 class="center-align">Latest Videos</h4>';

             // Loop Through playlistItems & 
             // Append to Output
             playlistItems.forEach(item => {

                // Select Video ID
                const videoId = item.snippet.resourceId.videoId;

                output += `
                    <div class="col s3">
                        <iframe 
                            width="100%" 
                            height="auto" 
                            src="https://www.youtube.com/embed/${videoId}" 
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                        </iframe>
                    </div>
                `;
             });

             // Output Playlist to UI
             videoContainer.innerHTML = output;

         } else {

           videoContainer.innerHTML = 'No Uploaded Videos!';

         }
     })
     .catch(error => console.error("Error fetching playlist videos:", error));
}


// Event Listeners
authorizeButton.onclick = handleAuthClick;
signoutButton.onclick = handleSignoutClick;
