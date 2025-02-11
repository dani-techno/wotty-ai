/**
* Made by: Dani Technology (Full Stack Engineer)
* Created on: January 10, 2024
* Contact developer:
* - WhatsApp: +62 838-3499-4479 or +62 823-2066-7363
* - Email: dani.technology.id@gmail.com
* - GitHub: https://github.com/dani-techno
*/

const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
let secretKey = localStorage.getItem("apiKey");

const requestApiKey = () => {
  secretKey = prompt("Masukkan API Key forestapi.web.id Anda:");
  if (secretKey) {
    localStorage.setItem("apiKey", secretKey);
  } else {
    alert("API Key diperlukan untuk menggunakan aplikasi ini.");
    requestApiKey();
  }
};

if (!secretKey) {
  requestApiKey();
}

const loadDataFromLocalstorage = () => {
  const themeColor = localStorage.getItem("themeColor");

  document.body.classList.toggle("light-mode", themeColor === "light_mode");
  themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

  const defaultText = `<div class="default-text">
  <h1>Wotty AI</h1>
  <p><b>AI ini dikembangkan sepenuhnya dari awal tanpa memanfaatkan API dari proyek lain.</b><br><br>Mulailah percakapan dan jelajahi kekuatan AI.</p>
  </div>`;

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

const createChatElement = (content, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = content;
  return chatDiv;
};

const showTypingAnimation = async () => {
  userText = chatInput.value.trim();
  if (!userText) return;

  chatInput.value = "";
  chatInput.style.height = "45px";

  const html = `<div class="chat-content">
  <div class="chat-details">
  <img src="./assets/images/user.png" alt="user-img">
  <p>${userText}</p>
  </div>
  </div>`;

  const outgoingChatDiv = createChatElement(html, "outgoing");
  chatContainer.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);

  async function typeText(element, text, delay) {
    for (let i = 0; i < text.length; i++) {
      element.innerHTML += text.charAt(i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  try {
    const response = await fetch(`https://forestapi.web.id/api/ai/wotty?api_key=${secretKey}&question=${encodeURIComponent(userText)}`);
    const data = await response.json();

    if (data && data.status === "success") {
      const answerText = data.data.text;
      const responseHtml = `<div class="chat-content">
      <div class="chat-details">
      <img src="./assets/images/bot.png" alt="bot-img">
      <p></p>
      </div>
      </div>`;

      const incomingChatDiv = createChatElement(responseHtml, "incoming");
      chatContainer.appendChild(incomingChatDiv);
      const paragraphElement = incomingChatDiv.querySelector("p");

      await typeText(paragraphElement, answerText, 50);

      localStorage.setItem("all-chats", chatContainer.innerHTML);
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
    } else {
      throw new Error("Error in API response");
    }
  } catch (error) {
    console.error(error);
  }
};

deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
  }
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("themeColor", themeButton.innerText);
  themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialInputHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    showTypingAnimation();
  }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", showTypingAnimation);

function closeAds() {
  const adsContainer = document.querySelector(".ads-container");
  adsContainer.style.display = "none";
}