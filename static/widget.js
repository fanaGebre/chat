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

  // Inject minimal styles
  const style = document.createElement("style");
  style.innerHTML = `
    #chatbot-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #007bff;
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
      width: 300px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999;
    }
    .hidden {
      display: none;
    }
    .chat-header {
      background: #007bff;
      color: white;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chat-box {
      height: 250px;
      overflow-y: auto;
      padding: 10px;
      background: #fafafa;
    }
    .input-container {
      display: flex;
      padding: 10px;
      border-top: 1px solid #ddd;
    }
    .input-container input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .input-container button {
      padding: 8px 12px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      margin-left: 5px;
    }
    .bot-message, .user-message {
      margin: 5px 0;
      padding: 8px;
      border-radius: 5px;
    }
    .bot-message {
      background: #e1f5fe;
      text-align: left;
    }
    .user-message {
      background: #c8e6c9;
      text-align: right;
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

  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    userInput.value = "";

    fetch("https://chat-hzpm.onrender.com/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => appendMessage(data.response, "bot"))
      .catch((err) => appendMessage("Error: Unable to reach chatbot.", "bot"));
  }

  chatBtn.onclick = () => chatContainer.classList.toggle("hidden");
  closeChatBtn.onclick = () => chatContainer.classList.add("hidden");
  sendBtn.onclick = sendMessage;
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
