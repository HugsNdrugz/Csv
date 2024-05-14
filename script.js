const appIconsDiv = document.getElementById("app-icons");
const textMessagesDiv = document.getElementById("text-messages");
const backButton = document.getElementById("back-button");

// Fetch CSV Data from Netlify
fetch('https://hugsndrugz.netlify.app/data.csv') // Updated URL
    .then(response => response.text())
    .then(data => {
        const parsedData = parseCSV(data);
        localStorage.setItem("appUsageData", JSON.stringify(parsedData));
        displayAppIcons(parsedData);
    })
    .catch(error => console.error('Error fetching CSV:', error));

// Function to parse CSV data
function parseCSV(csvData) {
    const rows = csvData.split("\n");
    const parsedData = [];

    for (let i = 0; i < rows.length; i++) { 
        const row = rows[i].split(",");
        if (row.length === 3) {

            // Check if the first row is a header row
            if (i === 0 && row[0].toLowerCase().includes("application") && row[1].toLowerCase().includes("time") && row[2].toLowerCase().includes("text")) {
                continue; // Skip the header row
            }

            parsedData.push({
                app: row[0].replace(/"/g, ''), 
                time: row[1].replace(/"/g, ''), 
                text: row[2].replace(/"/g, ''),
            });
        }
    }
    return parsedData;
}

// Function to display app icons
function displayAppIcons(data) {
    const uniqueApps = new Set(data.map(item => item.app));

    appIconsDiv.innerHTML = ""; 

    uniqueApps.forEach(appName => {
        const icon = document.createElement("div");
        icon.classList.add("app-icon");

        // Extract app name from package name
        const appNameParts = appName.split(".");
        const displayName = appNameParts[appNameParts.length - 2]; 
        icon.textContent = displayName; 

        icon.addEventListener("click", () => {
            displayTextMessages(data, appName);
        });

        appIconsDiv.appendChild(icon);
    });
}

// Function to display text messages
function displayTextMessages(data, appName) {
    appIconsDiv.style.display = "none";
    textMessagesDiv.style.display = "block";

    const filteredMessages = data.filter(item => item.app === appName);

    textMessagesDiv.innerHTML = ""; 

    filteredMessages.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerHTML = `
            <p class="message-text">${message.text}</p>
            <p class="message-time">${message.time}</p>
        `;
        textMessagesDiv.appendChild(messageDiv);
    });

    backButton.style.display = "block";
    backButton.addEventListener("click", () => {
        appIconsDiv.style.display = "grid";
        textMessagesDiv.style.display = "none";
        backButton.style.display = "none";
    });
}
