import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect } from "react";

const EmojiPicker = ({ onSelect }) => {
  const emojis = [// Smileys and People
    "😀", "😂", "😍", "🥳", "👍", "🎉", "🔥", "❤️", "😊", "🤣", "😎", "😜", "😢",
    "😡", "🤔", "🙌", "🎂", "🌟", "💖", "🚀", "👏", "😇", "😏", "🤩", "💯", "🥰",
    "🤗", "😴", "😅", "😆", "🤓", "🧐", "🤯", "😰", "😨", "😓", "😤", "😠", "😩",
    "😭", "🤪", "😵", "🤠", "🥴", "🤡", "👀", "🙈", "🦉"
  ];
  return (
    <div className="absolute bottom-full mb-2 right-0 w-64 bg-gray-200 p-2 rounded-lg shadow-lg grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
      {emojis.map((emoji) => (
        <button key={emoji} className="text-2xl p-1 hover:bg-gray-300 rounded" onClick={() => onSelect(emoji)}>
          {emoji}
        </button>
      ))}
    </div>
  );
};
const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const emojiRef=useRef(null);

   useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-circle flex items-center justify-center transition
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
          <div className="relative" ref={emojiRef}>
            <button
              type="button"
              className="btn btn-circle flex items-center justify-center text-gray-500"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
            <Smile size={20} />
          </button>
          {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
          </div>
        </div>
        
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;