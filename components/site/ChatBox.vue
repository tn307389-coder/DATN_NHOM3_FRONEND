<template>
  <button v-if="!chatOpen" class="chat-launcher" @click="openChat" aria-label="Mở chat tư vấn">
    <span class="launcher-pill">Tư vấn</span>
    <i class="bi bi-chat-dots-fill"></i>
    <span class="launcher-ring"></span>
  </button>

  <div v-if="chatOpen" class="chat-widget">
    <div class="chat-header">
      <div class="chat-brand">
        <div class="chat-logo">🚘</div>
        <div>
          <h6 class="mb-0">DriveHub Chat</h6>
          <small><span class="status-dot"></span> Trợ lý ảo trực tuyến</small>
        </div>
      </div>
      <button class="chat-close" @click="closeChat" aria-label="Đóng hộp chat">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div ref="bodyEl" class="chat-body">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="chat-row"
        :class="msg.from === 'user' ? 'right' : 'left'"
      >
        <div class="chat-bubble" :class="msg.from">
          <span class="chat-text">{{ msg.text }}</span>
          <small class="chat-time">{{ formatTime(msg.time) }}</small>
        </div>
      </div>

      <div v-if="botTyping" class="chat-row left">
        <div class="chat-bubble bot typing">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
      </div>
    </div>

    <div class="chat-quick" v-if="!botTyping">
      <button
        v-for="q in quickQuestions"
        :key="q"
        class="chip"
        @click="sendMessage(q)"
      >{{ q }}</button>
    </div>

    <div class="chat-footer">
      <input
        v-model="draft"
        class="chat-input"
        placeholder="Nhập câu hỏi của bạn..."
        @keyup.enter="onSend"
      />
      <button class="chat-send" :disabled="botTyping || !draft.trim()" @click="onSend">
        <i class="bi bi-send-fill"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import { useChat } from "../../composables/useChat";
import { useSite } from "../../composables/useSite";

const { chatOpen, messages, botTyping, quickQuestions, openChat, closeChat, sendMessage } = useChat();
const { openRegister } = useSite();

const draft = ref("");
const bodyEl = ref(null);

const formatTime = (d) => {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

const onSend = () => {
  if (!draft.value.trim()) return;
  sendMessage(draft.value);
  draft.value = "";
};

watch(
  () => [...messages.value.map((m) => m.text), botTyping.value],
  async () => {
    await nextTick();
    if (bodyEl.value) bodyEl.value.scrollTop = bodyEl.value.scrollHeight;
  }
);
</script>

<style scoped>
.chat-launcher {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 58px;
  height: 58px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(13, 110, 253, 0.45);
  z-index: 1060;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  animation: launcherPulse 2.6s ease-in-out infinite;
}

.chat-launcher:hover {
  transform: scale(1.08);
  box-shadow: 0 14px 32px rgba(13, 110, 253, 0.55);
}

.launcher-pill {
  position: absolute;
  right: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  color: #1d4ed8;
  font-size: 12.5px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.16);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.chat-launcher:hover .launcher-pill {
  opacity: 1;
}

.launcher-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(13, 110, 253, 0.35);
  animation: ringRipple 2.6s ease-out infinite;
}

@keyframes ringRipple {
  0% { transform: scale(1); opacity: 0.9; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { opacity: 0; }
}

@keyframes launcherPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 340px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.22);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1060;
  animation: chatIn 0.22s ease-out;
  font-family: "Segoe UI", "Roboto", Arial, sans-serif;
}

@keyframes chatIn {
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
}

.chat-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-logo {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.chat-header h6 {
  font-weight: 700;
  font-size: 15px;
}

.chat-header small {
  font-size: 11.5px;
  opacity: 0.9;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  margin-right: 4px;
}

.chat-close {
  border: none;
  background: transparent;
  color: #fff;
  font-size: 18px;
  line-height: 1;
  padding: 4px;
}

.chat-body {
  height: 300px;
  overflow-y: auto;
  padding: 14px;
  background: #f4f6fb;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-row {
  display: flex;
}
.chat-row.right {
  justify-content: flex-end;
}
.chat-row.left {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 78%;
  padding: 9px 12px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.45;
  white-space: pre-line;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
}

.chat-bubble.bot {
  background: #fff;
  color: #1f2937;
  border-bottom-left-radius: 4px;
}

.chat-bubble.user {
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chat-time {
  display: block;
  font-size: 10.5px;
  opacity: 0.65;
  margin-top: 3px;
  text-align: right;
}

.chat-bubble.typing {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px 14px;
}

.chat-bubble.typing .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
  animation: blink 1.2s infinite;
}
.chat-bubble.typing .dot:nth-child(2) { animation-delay: 0.2s; }
.chat-bubble.typing .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
}

.chat-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 14px;
  border-top: 1px solid #eef2f7;
  background: #fff;
}

.chip {
  border: 1px solid #c7d8f5;
  background: #f0f6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.chip:hover {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}

.chat-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #eef2f7;
  background: #fff;
}

.chat-input {
  flex: 1;
  border: 1px solid #dbe3ef;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13.5px;
  outline: none;
}

.chat-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.12);
}

.chat-send {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.chat-send:disabled {
  opacity: 0.5;
}

@media (max-width: 480px) {
  .chat-widget {
    bottom: 12px;
    right: 12px;
  }
  .chat-launcher {
    bottom: 12px;
    right: 12px;
  }
}
</style>
