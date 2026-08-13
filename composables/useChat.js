import { ref } from "vue";
import api from "../services/api";
import { getBotReply } from "../services/chatbot";

const chatOpen = ref(false);
const messages = ref([
  {
    from: "bot",
    text: "Xin chào! Tôi là trợ lý ảo của DriveHub. Bạn cần tư vấn gì về đào tạo lái xe?",
    time: new Date(),
  },
]);
const botTyping = ref(false);
const quickQuestions = [
  "Học phí bao nhiêu?",
  "Có khóa học nào?",
  "Cách đăng ký?",
  "Liên hệ trung tâm",
];

let typingTimer = null;
let coursesLoaded = false;
const courses = ref([]);

const openChat = () => {
  chatOpen.value = true;
  if (!coursesLoaded) {
    coursesLoaded = true;
    api
      .get("/khoa-hoc")
      .then((res) => {
        courses.value = Array.isArray(res.data) ? res.data : [];
      })
      .catch(() => {});
  }
};

const closeChat = () => {
  chatOpen.value = false;
};

const toggleChat = () => {
  chatOpen.value ? closeChat() : openChat();
};

const botReply = (text, list) => getBotReply(text, list);

const pushBot = (text) => {
  messages.value.push({ from: "bot", text, time: new Date() });
};

const sendMessage = (text) => {
  const content = (text || "").trim();
  if (!content) return;
  messages.value.push({ from: "user", text: content, time: new Date() });

  botTyping.value = true;
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    botTyping.value = false;
    pushBot(getBotReply(content, courses.value));
  }, 700);
};

export function useChat() {
  return {
    chatOpen,
    messages,
    botTyping,
    quickQuestions,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    botReply,
  };
}