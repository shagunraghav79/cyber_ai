const passwordInput = document.getElementById("password");
const checkBtn = document.getElementById("btn");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

checkBtn.addEventListener("click", async () => {

    const password = passwordInput.value;

    const res = await fetch("http://localhost:4002/api/password/strength", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });

    const data = await res.json();

    const colors = ["red", "orange", "yellow", "lightgreen", "green"];
    const messages = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];

    strengthBar.style.background = colors[data.score] || "#ddd";
    strengthText.textContent = messages[data.score] || "";
});









  


