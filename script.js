const appIconsDiv = document.getElementById("app-icons");
const textMessagesDiv = document.getElementById("text-messages");
const backButton = document.getElementById("back-button");
const csvFileInput = document.getElementById("csvFileInput");

// Check local storage for existing data
const storedData = localStorage.getItem("appUsageData");
if (storedData) {
    const parsedData = JSON.parse(storedData);
    displayAppIcons(parsedData);
}

csvFileInput.addEventListener("change", (event) => {
    handleFileSelect(event);
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = e.target.result;
        const parsedData = parseCSV(data);
        localStorage.setItem("appUsageData", JSON.stringify(parsedData));
        displayAppIcons(parsedData);
    };

    reader.readAsText(file);
}

function parseCSV(csvData) {
    const rows = csvData.split("\n");
    const parsedData = [];

    for (let i = 1; i < rows.length; i++) { 
        const row = rows[i].split(",");
        if (row.length === 3) {
            parsedData.push({
                app: row[0].replace(/"/g, ''), 
                time: row[1].replace(/"/g, ''), 
                text: row[2].replace(/"/g, ''),
            });
        }
    }
    return parsedData;
}

function displayAppIcons(data) {
    const uniqueApps = new Set(data.map(item => item.app));

    appIconsDiv.innerHTML = ""; 

    uniqueApps.forEach(appName => {
        const icon = document.createElement("div");
        icon.classList.add("app-icon");
        const appNameParts = appName.split(".");
        const displayName = appNameParts[appNameParts.length - 2]; 
        icon.textContent = displayName;

        icon.addEventListener("click", () => {
            displayTextMessages(data, appName);
        });

        appIconsDiv.appendChild(icon);
    });
}

function displayTextMessages(data, appName) {
    appIconsDiv.style.display = "none";
    textMessagesDiv.style.display = "block";

    const filteredMessages = data.filter(item => item.app === appName);

    textMessagesDiv.innerHTML = ""; // Clear previous messages
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
