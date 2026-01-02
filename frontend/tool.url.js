

 
const scanBtn = document.getElementById("scanBtn");
const urlInput = document.getElementById("urlInput");
const resultBox = document.getElementById("resultBox");
const statusText = document.getElementById("statusText");
const jsonOutput = document.getElementById("jsonOutput");
const errorText = document.getElementById("error");
const loadingBox = document.getElementById("loadingBox");
const loadingText = document.getElementById("loadingText");

scanBtn.addEventListener("click", async () => {
    const url = urlInput.value.trim();

    if (!url) {
        errorText.textContent = "Please enter a URL!";
        return;
    }

 
    errorText.textContent = "";
    statusText.textContent = "";
    jsonOutput.textContent = "";
    resultBox.style.display = "none";

    //  loading
    loadingBox.style.display = "block";
    loadingText.textContent = "CyberAI is analyzing the URL...";

    scanBtn.textContent = "Scanning...";
    scanBtn.disabled = true;

    try {
        const response = await fetch("http://localhost:4002/api/url/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (data.error) {
            loadingText.textContent = data.error;
            scanBtn.textContent = "Scan URL";
            scanBtn.disabled = false;
            return;
        }

        displayResult(data);

    } catch (err) {
        errorText.textContent = "Failed to scan URL";
        console.error(err);

    } finally {
        loadingBox.style.display = "none"; 
        scanBtn.textContent = "Scan URL";
        scanBtn.disabled = false;
    }
});

// result
function displayResult(data) {
    resultBox.style.display = "block";

    if (data.status === "danger") {
        statusText.textContent = "Malicious / Dangerous";
        statusText.style.color = "red";
        resultBox.style.borderColor = "red";
    } else if (data.status === "suspicious") {
        statusText.textContent = "Suspicious";
        statusText.style.color = "yellow";
        resultBox.style.borderColor = "yellow";
    } else {
        statusText.textContent = "Safe";
        statusText.style.color = "lightgreen";
        resultBox.style.borderColor = "lightgreen";
    }

 jsonOutput.textContent = JSON.stringify(data.vtRaw, null, 2);
}
