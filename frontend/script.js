
const inputBox = document.querySelector(".ask input");
const sendBtn = document.querySelector(".send i");
const disSection = document.querySelector(".dis");

// container to hold chat 
const chatContainer = document.createElement("div");
chatContainer.classList.add("chat-container");
disSection.insertBefore(chatContainer, document.querySelector(".searchbar"));

// send
sendBtn.addEventListener("click", sendMessage);

//  press Enter key
inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userText = inputBox.value.trim();
  if (!userText) return;

  //  user message
  addMessage(userText, "user");
  inputBox.value = "";

  try {
    
  const res = await fetch("http://localhost:4002/bot/v1/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userText }),
    });

    const data = await res.json();

    // reply
   
    addMessage(data.botmessage || "No response from server", "bot");


  } catch (error) {
    console.error("Error:", error);
    addMessage("⚠️ Server not responding", "bot");
  }
}



function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  chatContainer.appendChild(msg);

  
  const formattedText = text.replace(/\n/g, "<br>");

  let index = 0;

  function typeWriter() {
    if (index < formattedText.length) {
      msg.innerHTML = formattedText.substring(0, index + 1);
      index++;
      setTimeout(typeWriter, 15);
    }
  }

  if (sender === "bot") {
    typeWriter();
  } else {
    msg.innerHTML = formattedText;
  }

  chatContainer.scrollTop = chatContainer.scrollHeight;
}


// Greeting message

const greetBox = document.querySelector('.greeting-box');

function hideGreeting() {
    greetBox.style.opacity = "0";
    greetBox.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
        greetBox.style.display = "none";
    }, 500);
}


sendBtn.addEventListener("click", hideGreeting);

inputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        hideGreeting();
    }
});


