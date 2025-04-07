from flask import Flask, render_template, request, jsonify, send_from_directory
from chatbot.chatbot import chatbot_response  # Import the chatbot logic
from flask_cors import CORS

app = Flask(__name__, static_folder="static", static_url_path="/static")
CORS(app)

@app.route("/")
def home():
    return render_template("index.html")  # Render the homepage

@app.route("/chatbot", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")
    if not user_message:
        return jsonify({"response": "No message received."}), 400
    try:
        bot_reply = chatbot_response(user_message)  # Call the chatbot response
        return jsonify({"response": bot_reply})
    except Exception as e:
        print(f"❌ [ERROR] {e}")
        return jsonify({"response": "Sorry, an error occurred."}), 500

# Serve static files like JS, CSS, images, etc.
@app.route("/static/<path:path>")
def serve_static(path):
    return send_from_directory("static", path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
