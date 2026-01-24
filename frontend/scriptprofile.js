const profileBtn = document.getElementById("profileBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

const setBtn = document.getElementById("setbtn");
const dropupMenu = document.getElementById("dropupmenu");

profileBtn.addEventListener("click", () => {
    dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
});

// Close dropdown when clicking outside
window.addEventListener("click", (e) => {
    if (!e.target.matches('.profile')) {
        dropdownMenu.style.display = "none";
    }
});


// Settings menu
setbtn.addEventListener("click", () => {
    dropupmenu.style.display =
        dropupmenu.style.display === "block" ? "none" : "block";
});
// Close dropup when clicking outside
window.addEventListener("click", (e) => {
    if (!e.target.matches('.set')) {
        dropupmenu.style.display = "none";
    }
});

