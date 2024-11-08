// Twitch API credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

// Token storage
let accessToken = '';
let expiryTime = 0;

// Function to get an access token
async function getAccessToken() {
    if (accessToken && Date.now() < expiryTime) {
        return accessToken;
    }

    const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, {
        method: 'POST'
    });

    if (!response.ok) {
        throw new Error('Failed to get access token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    expiryTime = Date.now() + (data.expires_in * 1000);
    return accessToken;
}

// Function to search for a game
async function searchGame(query) {
    const token = await getAccessToken();
    const response = await fetch(`https://api.twitch.tv/helix/games?name=${encodeURIComponent(query)}`, {
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to search for game');
    }

    const data = await response.json();
    return data.data;
}

// Function to update stream information
async function updateStreamInfo(broadcasterId, title, gameId) {
    const token = await getAccessToken();
    const response = await fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`, {
        method: 'PATCH',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            game_id: gameId
        })
    });

    if (!response.ok) {
        throw new Error('Failed to update stream info');
    }

    return await response.json();
}

// Export functions for use in other files
export { searchGame, updateStreamInfo };