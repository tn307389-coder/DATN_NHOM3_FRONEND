import { describe, it, expect } from "vitest";

describe("validation helpers", () => {
  it("api baseURL uses env or fallback", () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";
    expect(baseURL).toBeTruthy();
    expect(baseURL).toMatch(/^https?:\/\//);
  });

  it("Google Client ID from env", () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
    expect(clientId).toBeTruthy();
  });
});
