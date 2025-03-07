/**
Proyek ini dilindungi oleh hak cipta dan lisensi ISC. Pengembangan proyek ini dilakukan oleh Dani Technology (Full Stack Developer & Software Engineer) pada tanggal 7 Maret 2025. Perlu diingat bahwa pelanggaran hak cipta dapat mengakibatkan konsekuensi hukum yang serius, termasuk ganti rugi dan tindakan hukum lainnya. Oleh karena itu, kami berharap Anda untuk menghormati hak cipta kami dan tidak melakukan tindakan yang dapat melanggar hak cipta ini.

KONTAK DEVELOPER:

- WhatsApp: +62 838-3499-4479 atau +62 823-2066-7363
- Email: dani.technology.id@gmail.com
- GitHub: @dani-techno

SYARAT-SYARAT LISENSI:

- Anda tidak diperbolehkan mengklaim proyek ini sebagai milik Anda sendiri.
- Anda tidak diperbolehkan menjual proyek ini tanpa izin tertulis dari pemilik hak cipta.
- Anda tidak diperbolehkan mengubah atau menghapus atribusi hak cipta dari proyek ini.

KONSEKUENSI PELANGGARAN

Jika Anda melanggar syarat-syarat lisensi ini, maka Anda dapat menghadapi konsekuensi hukum berikut:

- Ganti rugi atas pelanggaran hak cipta sebesar Rp 1.000.000.000 (satu miliar rupiah) atau lebih, sesuai dengan ketentuan Pasal 113 Undang-Undang Hak Cipta No. 28 Tahun 2014.
- Penghentian penggunaan proyek ini dan semua derivatifnya, sesuai dengan ketentuan Pasal 114 Undang-Undang Hak Cipta No. 28 Tahun 2014.
- Tindakan hukum lainnya yang sesuai, termasuk tuntutan pidana dan perdata, sesuai dengan ketentuan Pasal 115 Undang-Undang Hak Cipta No. 28 Tahun 2014.

PASAL-PASAL YANG RELEVAN

- Pasal 113 Undang-Undang Hak Cipta No. 28 Tahun 2014 tentang ganti rugi atas pelanggaran hak cipta.
- Pasal 114 Undang-Undang Hak Cipta No. 28 Tahun 2014 tentang penghentian penggunaan proyek yang melanggar hak cipta.
- Pasal 115 Undang-Undang Hak Cipta No. 28 Tahun 2014 tentang tindakan hukum lainnya yang sesuai.

DENGAN MENGGUNAKAN PROYEK INI, ANDA MENYATAKAN BAHWA ANDA TELAH MEMBACA, MEMAHAMI, DAN MENYETUJUI SYARAT-SYARAT LISENSI DAN HAK CIPTA INI.

PERINGATAN AKHIR:

Dengan ini, kami memberikan peringatan bahwa pelanggaran hak cipta atas proyek ini akan diambil tindakan hukum yang serius. Jika Anda terbukti menjual atau mengklaim proyek ini sebagai milik Anda sendiri tanpa izin, kami akan mengambil langkah-langkah hukum yang diperlukan untuk melindungi hak cipta kami, termasuk ganti rugi dan tindakan hukum lainnya.
*/

const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

const modelSelect = document.createElement("select");
modelSelect.innerHTML = `
  <option value="wotty">Wotty AI (By ForestAPI)</option>
  <option value="chatgpt3">ChatGPT 3</option>
  <option value="chatgpt35">ChatGPT 3.5</option>
  <option value="chatgpt4">ChatGPT 4</option>
  <option value="gemini">Gemini</option>
  <option value="bing">Bing AI</option>
  <option value="blackbox">BlackBox AI</option>
  <option value="meta">Meta AI</option>
`;
document.body.insertBefore(modelSelect, chatContainer);

let userText = null;
let secretKey = localStorage.getItem("apiKey");
let selectedModel = localStorage.getItem("aiModel") || "wotty";

modelSelect.value = selectedModel;

const requestApiKey = () => {
  secretKey = /*prompt("Masukkan API Key forestapi.web.id Anda:") || */"sk-danitechno";
  if (secretKey && secretKey.trim()) {
    localStorage.setItem("apiKey", secretKey);
  } else {
    alert("API Key tidak valid.");
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
  <p><b>Wotty dikembangkan sepenuhnya dari awal tanpa memanfaatkan API dari proyek lain.</b><br><br>Mulailah percakapan dan jelajahi kekuatan AI.<br><br><b>Powered by: <a style="color: skyblue; text-decoration: none;" href="https://forestapi.web.id">ForestAPI</a></b></p>
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

const getApiEndpoint = () => {
  const modelEndpoints = {
    wotty: "wotty",
    chatgpt3: "chatgpt-3",
    chatgpt35: "chatgpt-3.5",
    chatgpt4: "chatgpt-4",
    gemini: "gemini",
    bing: "bing",
    blackbox: "blackbox",
    meta: "meta"
  };
  return modelEndpoints[selectedModel] || "wotty";
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
    const apiEndpoint = getApiEndpoint();
    /*const response = await fetch(`https://forestapi.web.id/api/ai/${apiEndpoint}?api_key=${secretKey}&question=${encodeURIComponent(userText)}`);
    const data = await response.json();*/
    
    const response = await fetch('https://forestapi.web.id/api/ai/' + apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: userText,
          api_key: secretKey
        })
    });
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
  if (confirm("Apakah Anda yakin ingin menghapus semua chat?")) {
    localStorage.removeItem("all-chats");
    localStorage.removeItem("apiKey");
    localStorage.removeItem("aiModel");
    loadDataFromLocalstorage();
    window.location.reload();
  }
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("themeColor", document.body.classList.contains("light-mode") ? "light_mode" : "dark_mode");
  themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

modelSelect.addEventListener("change", () => {
  selectedModel = modelSelect.value;
  localStorage.setItem("aiModel", selectedModel);
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

sendButton.addEventListener("click", showTypingAnimation);

function closeAds() {
  const adsContainer = document.querySelector(".ads-container");
  adsContainer.style.display = "none";
}

loadDataFromLocalstorage();