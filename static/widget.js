// Guahro AI Chatbot Widget - Horizontal loading dots & fixed message alignment
document.addEventListener("DOMContentLoaded", function () {
  // 1. Create Chat Button (hidden since box is open by default)
  const chatBtn = document.createElement("div");
  chatBtn.id = "guahro-chatbot-btn";
  chatBtn.innerHTML = `💬 Chat`;
  chatBtn.style.display = "none";
  document.body.appendChild(chatBtn);

  // 2. Create Chat Container (visible by default)
  const chatContainer = document.createElement("div");
  chatContainer.id = "guahro-chatbot-container";
  chatContainer.innerHTML = `
    <div class="guahro-chat-header">
      <div class="guahro-chat-title">Guahro AI</div>
      <button id="guahro-close-chat" class="guahro-close-btn">&times;</button>
    </div>
    <div class="guahro-chat-box" id="guahro-chat-box">
      <div class="guahro-bot-message">Hello! How can I help you?</div>
    </div>
    <div class="guahro-input-area">
      <input type="text" id="guahro-user-input" placeholder="Type your message..." autocomplete="off">
      <button id="guahro-send-btn">Send</button>
    </div>
  `;
  document.body.appendChild(chatContainer);

  // 3. Add Styles - Horizontal dots & fixed alignment
  const style = document.createElement("style");
  style.textContent = `
    /* Chat Button (hidden) */
    #guahro-chatbot-btn {
      display: none;
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #318fa1;
      color: white;
      padding: 10px 16px;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 9999;
      font-size: 14px;
    }

    /* Chat Container */
    #guahro-chatbot-container {
      position: fixed;
      bottom: 70px;
      right: 20px;
      width: 300px;
      height: 400px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9998;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Header */
    .guahro-chat-header {
      background: #318fa1;
      color: white;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }
    .guahro-close-btn {
      background: transparent;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
    }

    /* Chat Box with fixed message alignment */
    .guahro-chat-box {
      height: 300px;
      padding: 10px;
      overflow-y: auto;
      background: #f8f9fa;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    /* Messages - Fixed alignment */
    .guahro-bot-message {
      background: #e3f2fd;
      align-self: flex-start;
      max-width: 80%;
      padding: 8px 12px;
      margin: 6px 0;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.4;
    }
    .guahro-user-message {
      background: #318fa1;
      color: white;
      align-self: flex-end;
      max-width: 80%;
      padding: 8px 12px;
      margin: 6px 0;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.4;
    }

    /* Input Area */
    .guahro-input-area {
      display: flex;
      padding: 10px;
      border-top: 1px solid #eee;
      background: white;
    }
    #guahro-user-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 15px;
      font-size: 13px;
    }
    #guahro-send-btn {
      padding: 8px 12px;
      margin-left: 8px;
      background: #318fa1;
      color: white;
      border: none;
      border-radius: 15px;
      font-size: 13px;
      cursor: pointer;
    }

    /* Horizontal Loading Dots */
    .guahro-loading {
      background: #e3f2fd !important;
      padding: 8px 12px !important;
      width: 60px;
      overflow: hidden;
    }
    .guahro-loading-dots {
      display: flex;
      width: 100%;
      position: relative;
      height: 12px;
    }
    .guahro-loading-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      background: #318fa1;
      border-radius: 50%;
      animation: guahro-slide 1.5s infinite ease-in-out;
    }
    .guahro-loading-dot:nth-child(1) {
      animation-delay: 0s;
    }
    .guahro-loading-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    .guahro-loading-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes guahro-slide {
      0% { transform: translateX(-15px); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translateX(60px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // 4. Chat Functionality
  const chatBox = document.getElementById("guahro-chat-box");
  const userInput = document.getElementById("guahro-user-input");

  // Close button shows the chat button
  document
    .getElementById("guahro-close-chat")
    .addEventListener("click", function () {
      chatContainer.style.display = "none";
      chatBtn.style.display = "block";
    });

  // Chat button reopens the chat
  chatBtn.addEventListener("click", function () {
    chatContainer.style.display = "flex";
    chatBtn.style.display = "none";
    userInput.focus();
  });

  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message (aligned right)
    const userMsg = document.createElement("div");
    userMsg.className = "guahro-user-message";
    userMsg.textContent = message;
    chatBox.appendChild(userMsg);

    // Clear input
    userInput.value = "";

    // Add loading indicator (aligned left with horizontal dots)
    const loading = document.createElement("div");
    loading.className = "guahro-bot-message guahro-loading";
    loading.innerHTML = `
      <div class="guahro-loading-dots">
        <div class="guahro-loading-dot"></div>
        <div class="guahro-loading-dot"></div>
        <div class="guahro-loading-dot"></div>
      </div>
    `;
    chatBox.appendChild(loading);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Send to your API
    fetch("https://chat-hzpm.onrender.com/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then((response) => response.json())
      .then((data) => {
        loading.remove();
        const botMsg = document.createElement("div");
        botMsg.className = "guahro-bot-message";
        botMsg.textContent = data.response;
        chatBox.appendChild(botMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
      })
      .catch((error) => {
        loading.remove();
        const errorMsg = document.createElement("div");
        errorMsg.className = "guahro-bot-message";
        errorMsg.textContent = "Sorry, I'm having trouble connecting.";
        chatBox.appendChild(errorMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
      });
  }

  // Send message events
  document
    .getElementById("guahro-send-btn")
    .addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  // Focus input on load
  userInput.focus();
});
