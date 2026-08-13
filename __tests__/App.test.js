import { describe, it, expect, vi, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../App.vue";

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    (() => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
});

vi.mock("vue-router", () => ({
  useRoute: () => vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
  createRouter: vi.fn(),
  createWebHistory: vi.fn(),
}));

vi.mock("../composables/useSite", () => ({
  useSite: () => ({
    role: "",
    authVersion: { value: 0 },
    showLogin: { value: false },
    loggedIn: { value: false },
    displayName: { value: "" },
    authTab: { value: "login" },
    registerForm: { value: {} },
    registerLoading: { value: false },
    registerError: { value: "" },
    registerSuccess: { value: "" },
    khoaHocList: { value: [] },
    hangGPLXList: { value: [] },
    submitRegister: vi.fn(),
    loadKhoaHocPublic: vi.fn(),
    loadHangGPLX: vi.fn(),
    renderGoogleButton: vi.fn(),
    otpSent: { value: false },
    otpVerified: { value: false },
    otpCode: { value: "" },
    otpSending: { value: false },
    otpVerifying: { value: false },
    otpTimer: { value: 0 },
    sendOtp: vi.fn(),
    verifyOtp: vi.fn(),
    handleGoogleLogin: vi.fn(),
  }),
}));

vi.mock("../composables/useWebSocket", () => ({
  useWebSocket: () => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

describe("App", () => {
  it("renders without crashing", () => {
    const wrapper = mount(App, {
      global: {
        stubs: ["router-view", "SiteNavbar", "Sidebar", "Header", "Footer", "ToastContainer", "ChatBox"],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
