import { useRef, useState } from "react";
import { useChartStore } from "../store/useChatStore";
import { Image, Send, X, Rocket, Hourglass } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [vedioPreview, setVedioPreview] = useState(null);
  const [vedioTransfer, setVedioTrasfer] = useState(null);
  const fileInputRef = useRef(null);
  const vedioInputRef = useRef(null);
  const { sendMessage } = useChartStore();
  const [showTimedMessageModal, setShowTimedMessageModal] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please select an image or video file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Image size cannot exceed 50MB");
      return;
    }

    if (file.type.startsWith("video/")) {
      setVedioPreview(URL.createObjectURL(file));
      const videoReader = new FileReader();
      videoReader.onloadend = () => {
        setVedioTrasfer(videoReader.result);
      };
      videoReader.readAsDataURL(file);
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
  const removeVedio = () => {
    setVedioPreview(null);
    if (vedioInputRef.current) vedioInputRef.current.value = "";
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !vedioPreview) return;
    if (text.length > 1000) {
      toast.error("Message text cannot exceed 1000 characters");
      return;
    }
    if (imagePreview && imagePreview.length > 50 * 1024 * 1024) {
      toast.error("Image size cannot exceed 50MB");
      return;
    }

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        vedio: vedioTransfer,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setVedioPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (vedioInputRef.current) vedioInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTimedMessage = async (e) => {
    e.preventDefault();

    const text = e.target[0].value.trim();
    const scheduledTime = e.target[1].value;
    const readableTime = new Date(scheduledTime);
    console.log("Scheduling message:", { text, readableTime });
    if (readableTime < new Date()) {
      toast.error("Scheduled time must be in the future");
      return;
    }
    try {
      await sendMessage({
        text,
        isTimed: true,
        scheduledTime: readableTime,
      });
      toast.success(`Message scheduled for ${readableTime}`);
    } catch (error) {
      console.error("Failed to schedule timed message:", error);
      toast.error("Failed to schedule timed message");
      return;
    }
    // Implement logic to schedule message based on user input
    setShowTimedMessageModal(false);
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
      {vedioPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <video controls className="w-40 h-40 object-cover rounded-lg border border-zinc-700">
              <source src={vedioPreview} type="video/mp4" />
            </video>
            <button
              onClick={removeVedio}
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
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef||vedioInputRef}
            onChange={handleMediaChange}
          />
          

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-circle relative  hover:bg-base-300 text-zinc-400 "
          // disabled={!text.trim() && !imagePreview}
          onClick={() => setShowTimedMessageModal(true)}
        >
          <Rocket size={22} />
          <Hourglass size={15} className="absolute   right-4 bottom-6" />
        </button>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview && !vedioPreview}
        >
          <Send size={22} />
        </button>
      </form>

      {showTimedMessageModal && (
        <form onSubmit={handleTimedMessage}>
          <div className="fixed inset-0 bg-base-100 opacity-93 flex items-center justify-center z-50">
            <div className="bg-base-200 p-6 rounded-lg border border-zinc-700 w-120 h-64 opacity-100">
              <h2 className="text-lg font-semibold mb-4">Timed Message</h2>
              <input
                type="text"
                placeholder="Message text"
                className="input input-bordered w-full mb-4 h-10"
              />
              <input
                type="datetime-local"
                className="input input-bordered w-full mb-4"
              />
              <button
                onClick={() => {
                  setShowTimedMessageModal(false);
                  toast.error("Timed message scheduling cancelled");
                }}
                className="mt-4 btn btn-error"
              >
                Close
              </button>
              <input
                type="submit"
                value="Schedule"
                className="mt-4 btn btn-primary float-end"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
export default MessageInput;
