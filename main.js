// PSEUDOCODE: Our game plan
// 1. Define our variables: score, game area, list of websites
// 2. Load the AI data (our websites.json)
// 3. Have a function to create a new cookie
//    - Pick a random doc from the list
//    - Decide its type (safe, moderate, top secret) based on the website
//    - Create a new div element with the correct image
//    - Place it at a random position at the top
//    - Make it start falling down the screen
// 4. When the cookie is clicked, send the doc to summarise and encrypt

// REAL CODE STARTS HERE
// 1. Game Variables
let score = 0;
const scoreDisplay = document.getElementById('score');
const gameContainer = document.getElementById('game-container');

// This object will be filled from websites.json
// For now, we'll use a simple example. REPLACE THIS LATER.
const websites = {
    "pbskids.org": "yummy",
    "tiktok.com": "spy",
    "youtube.com": "suspicious"
    // ... more websites from your AI-generated JSON
};

// 2. Function to create and drop a cookie
function createCookie() {
    // Get a random website name from our list
    const siteNames = Object.keys(websites);
    const randomSite = siteNames[Math.floor(Math.random() * siteNames.length)];
    const cookieType = websites[randomSite]; // Find its type (e.g., "yummy")

    // Create a new HTML div element for the cookie
    const cookie = document.createElement('div');
    cookie.className = 'cookie ' + cookieType; // This applies the CSS style with the image
    cookie.style.left = Math.random() * (gameContainer.offsetWidth - 60) + 'px'; // Random horizontal position
    cookie.style.top = '0px';

    // Tell the cookie what to do when clicked
    cookie.onclick = function() {
        // Handle the click based on the cookie type
        if (cookieType === 'yummy') {
            score += 10;
            // playSound('munch'); // Uncomment later
        } else if (cookieType === 'spy') {
            score += 20;
            // playSound('smash'); // Uncomment later
        } else if (cookieType === 'suspicious') {
            score += 5;
            // playSound('munch'); // Uncomment later
        }
        scoreDisplay.textContent = 'Score: ' + score; // Update the score display
        cookie.remove(); // Remove the cookie from the game
    };

    // Add the cookie to the game container
    gameContainer.appendChild(cookie);

    // 3. Make the cookie fall!
    let fallSpeed = 2;
    let cookieInterval = setInterval(function() {
        let currentTop = parseInt(cookie.style.top);
        cookie.style.top = (currentTop + fallSpeed) + 'px';

        // If the cookie falls out of the bottom, remove it and stop its animation
        if (currentTop > gameContainer.offsetHeight) {
            clearInterval(cookieInterval);
            cookie.remove();
        }
    }, 20); // This runs every 20 milliseconds
}

// 4. Start the game loop! Create a new cookie every 1.5 seconds.
setInterval(createCookie, 1500);

// 5. (Optional) Function to play sounds
// function playSound(soundName) {
//    let audio = new Audio('assets/sounds/' + soundName + '.mp3');
//    audio.play();
// }