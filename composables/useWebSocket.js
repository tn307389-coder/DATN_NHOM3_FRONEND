import { ref, onMounted, onUnmounted } from "vue";

const isConnected = ref(false);
const messages = ref([]);
let stompClient = null;

export function useWebSocket() {
  const connect = () => {
    if (stompClient && isConnected.value) { disconnect(); }
    const token = localStorage.getItem("token");
    if (!token) return;

    const SockJS = window.SockJS;
    const Stomp = window.Stomp;

    if (!SockJS || !Stomp) {
      // Load libraries dynamically if not available
      loadWebSocketLibs(() => {
        doConnect(token);
      });
      return;
    }
    doConnect(token);
  };

  const doConnect = (token) => {
    try {
      const wsBase = import.meta.env.VITE_WS_URL || "http://localhost:8081";
      const socket = new SockJS(wsBase.replace(/\/$/, "") + "/ws");
      stompClient = Stomp.over(socket);

      stompClient.connect({ Authorization: `Bearer ${token}`, login: token }, () => {
        isConnected.value = true;

        // Subscribe to admin notifications
        stompClient.subscribe("/topic/thongbao", (msg) => {
          const data = JSON.parse(msg.body);
          messages.value.unshift(data);
          if (window.$toast) {
            window.$toast.add(data.tieuDe + ": " + data.noiDung, "info");
          }
        });

        // Subscribe to user-specific notifications
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            stompClient.subscribe(`/user/${user.id}/queue/thongbao`, (msg) => {
              const data = JSON.parse(msg.body);
              messages.value.unshift(data);
              if (window.$toast) {
                window.$toast.add(data.tieuDe, "info");
              }
            });
          } catch (e) {
            // ignore parse errors
          }
        }
      });
    } catch (e) {
      console.error("WebSocket connection failed:", e);
    }
  };

  const disconnect = () => {
    if (stompClient) {
      stompClient.disconnect(() => {
        isConnected.value = false;
      });
    }
  };

  const loadWebSocketLibs = (callback) => {
    // Dynamically load SockJS and Stomp libraries
    const sockjs = document.createElement("script");
    sockjs.src = "https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js";
    sockjs.onload = () => {
      const stomp = document.createElement("script");
      stomp.src = "https://cdn.jsdelivr.net/npm/stompjs@2/lib/stomp.min.js";
      stomp.onload = callback;
      document.head.appendChild(stomp);
    };
    document.head.appendChild(sockjs);
  };

  // Auto-connect on mount if token exists (called by App.vue on demand instead)
  // onMounted(() => { connect(); });
  // onUnmounted(() => { disconnect(); });



  return {
    isConnected,
    messages,
    connect,
    disconnect,
  };
}
