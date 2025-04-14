document.addEventListener("DOMContentLoaded", function () {
  console.log("Chatbot widget initialized"); // Debug log

  // Create Chat Button
  const chatBtn = document.createElement("div");
  chatBtn.id = "chatbot-btn";
  chatBtn.innerText = "💬 Chat";
  document.body.appendChild(chatBtn);

  // Create Chat Container
  const chatContainer = document.createElement("div");
  chatContainer.id = "chat-container";
  chatContainer.style.display = "none";
  chatContainer.innerHTML = `
    <div class="chat-header">
      <span>Guahro AI Chatbot</span>
      <button class="close-chat">&times;</button>
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

  // Add External CSS - Using inline CSS as fallback
  try {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "http://127.0.0.1:5000/static/styles.css";
    document.head.appendChild(link);
  } catch (e) {
    console.log("Couldn't load external CSS, using inline styles");
    const style = document.createElement("style");
    style.textContent = `
      #chatbot-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #318fa1;
        color: white;
        padding: 12px 20px;
        border-radius: 50px;
        cursor: pointer;
        z-index: 1000;
        font-family: sans-serif;
      }
      #chat-container {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 320px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        z-index: 1000;
        font-family: sans-serif;
      }
      .chat-header {
        background: #318fa1;
        color: white;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .close-chat {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      }
      .chat-box {
        height: 250px;
        overflow-y: auto;
        padding: 10px;
        background: #f1f1f1;
        display: flex;
        flex-direction: column;
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
        border-radius: 5px;
      }
      .input-container button {
        margin-left: 6px;
        padding: 8px 12px;
        background: #38A3A5;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .bot-message, .user-message {
        padding: 8px 12px;
        margin: 6px 0;
        border-radius: 10px;
        max-width: 80%;
        word-wrap: break-word;
      }
      .bot-message {
        background-color: #e0f7fa;
        align-self: flex-start;
      }
      .user-message {
        background-color: #b2dfdb;
        align-self: flex-end;
        margin-left: auto;
      }
      .typing {
        display: flex;
        gap: 4px;
        padding: 8px 12px;
      }
      .typing .dot {
        width: 8px;
        height: 8px;
        background-color: #38A3A5;
        border-radius: 50%;
        animation: bounce 1.3s infinite;
      }
      .typing .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0.9); opacity: 0.6; }
        40% { transform: scale(1.2); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // Function to append messages
  function appendMessage(text, sender, isTyping = false) {
    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "bot" ? "bot-message" : "user-message";

    if (isTyping) {
      msgDiv.classList.add("typing");
      msgDiv.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    } else {
      msgDiv.innerText = text;
    }

    document.getElementById("chat-box").appendChild(msgDiv);
    document.getElementById("chat-box").scrollTop =
      document.getElementById("chat-box").scrollHeight;
  }

  // Show Chat
  chatBtn.onclick = () => {
    chatContainer.style.display = "block";
  };

  // Close Chat
  chatContainer.querySelector(".close-chat").onclick = () => {
    chatContainer.style.display = "none";
  };

  // Send Message
  document.getElementById("send-btn").onclick = () => {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    input.value = "";

    appendMessage("", "bot", true); // show animated typing

    fetch("https://chat-hzpm.onrender.com/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => {
        const chatBox = document.getElementById("chat-box");
        chatBox.removeChild(chatBox.lastChild); // remove typing
        appendMessage(data.response, "bot");
      })
      .catch(() => {
        const chatBox = document.getElementById("chat-box");
        chatBox.removeChild(chatBox.lastChild); // remove typing
        appendMessage("Oops! Something went wrong.", "bot");
      });
  };

  // Enter Key support
  document
    .getElementById("user-input")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") document.getElementById("send-btn").click();
    });
});
