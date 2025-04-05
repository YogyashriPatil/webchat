// src/components/Chatbot.jsx
import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // 👈 Controls chatbot open/close
  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    const lowerInput = input.toLowerCase();
    let replyText = "I'm not sure how to respond to that. Try asking for help!";
    if (["hi", "hello", "hey"].includes(lowerInput)) {
        replyText = "Hello! 👋 How can I assist you today?";
      } else if (lowerInput.includes("help")) {
        replyText = "I'm here to help! You can ask about features, support, or say hi.";
      } else if (lowerInput.includes("features")) {
        replyText = "This app lets you chat with friends, view profiles, and now chat with me 🤖!";
      } else if (lowerInput.includes("support")) {
        replyText = "For support, contact us via the 'Contact Us' page or send an email to support@example.com.";
      } else if (lowerInput.includes("who are you")) {
        replyText = "I'm your friendly chatbot assistant built to help you use this app.";
      } else if (lowerInput.includes("bye")) {
        replyText = "Goodbye! Have a great day! 👋";
      } else if (lowerInput.includes("joke")) {
        replyText = "Why don’t skeletons fight each other? Because they don’t have the guts. 😂";
      } else if (lowerInput.includes("time")) {
        replyText = `The current time is ${new Date().toLocaleTimeString()}`;
      }else if (lowerInput.includes("how to send a message")) {
        replyText = "To send a message, just select a user from the sidebar, type your message, and press Enter.";
      } else if (lowerInput.includes("create group")) {
        replyText = "Group chat feature is coming soon! Stay tuned 😉";
      } else if (lowerInput.includes("features")) {
        replyText = "This app lets you: 👥 chat 1-on-1, 📝 view message history, 🔔 get real-time updates, and 🤖 chat with me!";
      } else if (lowerInput.includes("is this real time")) {
        replyText = "Yes! All messages are sent and received in real-time using WebSockets.";
      } else if (lowerInput.includes("how to start chat")) {
        replyText = "Click on a user in the sidebar to start chatting with them.";
      } else if (lowerInput.includes("profile") || lowerInput.includes("account")) {
        replyText = "You can view and edit your profile from the top-right menu in the sidebar.";
      } else if (lowerInput.includes("logout")) {
        replyText = "To log out, click the logout button in the sidebar or top-right corner.";
      } else if (lowerInput.includes("support")) {
        replyText = "For support, email us at support@yourapp.com or reach out through the contact form.";
      } else if (lowerInput.includes("bye")) {
        replyText = "Goodbye! 👋 If you need help again, I’ll be right here.";
      }
    const botReply = { sender: 'bot', text: replyText }; // Replace with actual logic
    setMessages(prev => [...prev, userMessage, botReply]);
    setInput('');
  };

  return (
    <>
        {/* floating chatbot button */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className='fixed bottom-6 right-6 bg-blue-600 text-white p-5 rounded-full shadow-lg z-50 hover:scale-110 transition-transform'>
              💬  
        </button>

        {/* chatbot window */}
        {isOpen && (
            <div className="p-4 border-l border-gray-300 w-80 bg-white flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Chatbot</h2>
            <div className="flex-1 overflow-y-auto mb-2 space-y-1">
              {messages.map((msg, idx) => (
                <div key={idx} className={`text-sm p-2 rounded ${msg.sender === 'bot' ? 'bg-gray-100' : 'bg-blue-100 self-end'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 border rounded px-2 py-1"
                placeholder="Ask something..."
              />
              <button onClick={handleSend} className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
            </div>
          </div>
        )}
    </>
  );
};

export default Chatbot;
