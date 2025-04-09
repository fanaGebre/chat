document.addEventListener("DOMContentLoaded", function () {
  const chatBtn = document.createElement("div");
  chatBtn.id = "chatbot-btn";
  chatBtn.innerText = "💬 Chat";
  document.body.appendChild(chatBtn);

  const chatContainer = document.createElement("div");
  chatContainer.id = "chat-container";
  chatContainer.classList.add("hidden");
  chatContainer.innerHTML = `
    <div class="chat-header">
        <span>Guahro AI Chatbot</span>
        <button id="close-chat">&times;</button>
    </div>
    <div class="chat-box" id="chat-box">
        <div class="bot-message">Hello! How can I assist you today?</div>
    </div>
    <div class="input-container">
        <input type="text" id="user-input" placeholder="Type your message...">
        <button id="send-btn">Send</button>
    </div>
  `;
  document.body.appendChild(chatContainer);

  const style = document.createElement("style");
  style.innerHTML = `
    #chatbot-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #22577A;
      color: white;
      padding: 12px 20px;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
      font-weight: bold;
      z-index: 999;
    }
    #chat-container {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999;
    }
    .hidden {
      display: none;
    }
    .chat-header {
      background: #22577A;
      color: white;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chat-box {
      height: 260px;
      overflow-y: auto;
      padding: 10px;
      background: #f1f1f1;
    }
    .input-container {
      display: flex;
      padding: 10px;
      border-top: 1px solid #ccc;
    }
    .input-container input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .input-container button {
      padding: 8px 14px;
      background: #219aa3;
      color: white;
      border: none;
      border-radius: 6px;
      margin-left: 6px;
    }
    .bot-message, .user-message {
      margin: 5px 0;
      padding: 8px 12px;
      border-radius: 8px;
      max-width: 90%;
      word-wrap: break-word;
    }
    .bot-message {
      background: #dff6ff;
      align-self: flex-start;
    }
    .user-message {
      background: #a3d2ca;
      align-self: flex-end;
    }
    .loading-dots {
      display: inline-block;
      width: 40px;
    }
    .loading-dots span {
      display: inline-block;
      width: 6px;
      height: 6px;
      margin: 0 2px;
      background: #22577A;
      border-radius: 50%;
      animation: blink 1.4s infinite both;
    }
    .loading-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .loading-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes blink {
      0%, 80%, 100% { opacity: 0; }
      40% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  const closeChatBtn = chatContainer.querySelector("#close-chat");
  const sendBtn = chatContainer.querySelector("#send-btn");
  const userInput = chatContainer.querySelector("#user-input");
  const chatBox = chatContainer.querySelector("#chat-box");

  function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showLoading() {
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("bot-message", "loading");
    loadingDiv.id = "loading-indicator";
    loadingDiv.innerHTML = `
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function removeLoading() {
    const loading = document.getElementById("loading-indicator");
    if (loading) loading.remove();
  }

  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    userInput.value = "";
    showLoading();

    fetch("https://chat-hzpm.onrender.com/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => {
        removeLoading();
        appendMessage(data.response, "bot");
      })
      .catch(() => {
        removeLoading();
        appendMessage("Error: Unable to reach chatbot.", "bot");
      });
  }

  chatBtn.onclick = () => {
    chatContainer.classList.remove("hidden");
  };

  closeChatBtn.onclick = () => {
    chatContainer.classList.add("hidden");
  };

  sendBtn.onclick = sendMessage;
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
