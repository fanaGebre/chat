document.addEventListener("DOMContentLoaded", function () {
  const chatContainer = document.getElementById("chat-container");
  const chatbotBtn = document.getElementById("chatbot-btn");
  const closeChatBtn = document.getElementById("close-chat");
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  chatbotBtn.addEventListener("click", () => {
    chatContainer.classList.remove("hidden");
  });

  closeChatBtn.addEventListener("click", () => {
    chatContainer.classList.add("hidden");
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.classList.add("bot-message");
    typing.id = "typing-indicator";
    typing.innerHTML = `
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
  }

  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    userInput.value = "";
    showTyping();

    fetch("/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => {
        removeTyping();
        appendMessage(data.response, "bot");
      })
      .catch(() => {
        removeTyping();
        appendMessage("Error: Unable to reach chatbot.", "bot");
      });
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
