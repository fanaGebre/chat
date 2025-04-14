document.addEventListener("DOMContentLoaded", function () {
  console.log("Chatbot widget initialized"); // Debug log

  // Create Chat Button
  const chatBtn = document.createElement("div");
  chatBtn.id = "chatbot-btn";
  chatBtn.innerText = "💬 Guahro AI";
  document.body.appendChild(chatBtn);

  // Create Chat Container
  const chatContainer = document.createElement("div");
  chatContainer.id = "chat-container";
  chatContainer.style.display = "block"; // Changed to 'block' to show by default
  chatContainer.innerHTML = `
    <div class="chat-header">
      <span>Guahro AI Agent</span>
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

  // Toggle Chat visibility
  chatBtn.onclick = () => {
    chatContainer.style.display =
      chatContainer.style.display === "none" ? "block" : "none";
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
