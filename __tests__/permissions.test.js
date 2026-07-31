import { describe, it, expect } from "vitest";
import { canAccess, getPageMode, roleHome, allowedPaths, ROLE_ADMIN, ROLE_GV, ROLE_HV, ROLE_NV } from "../services/permissions";

describe("permissions", () => {
  it("ADMIN can access all pages and home is /dashboard", () => {
    const paths = allowedPaths(ROLE_ADMIN);
    expect(paths.includes("/dashboard")).toBe(true);
    expect(paths.includes("/hoc-vien")).toBe(true);
    expect(paths.includes("/tai-khoan")).toBe(true);
    expect(roleHome(ROLE_ADMIN)).toBe("/dashboard");
  });

  it("GV can view /gv-portal and edit /diem-danh", () => {
    expect(getPageMode(ROLE_GV, "/gv-portal")).toBe("view");
    expect(getPageMode(ROLE_GV, "/diem-danh")).toBe("edit");
    expect(canAccess(ROLE_GV, "/diem-danh")).toBe(true);
  });

  it("GV cannot access admin-only pages", () => {
    expect(canAccess(ROLE_GV, "/tai-khoan")).toBe(false);
    expect(canAccess(ROLE_GV, "/thanh-toan")).toBe(false);
  });

  it("HV can only view pages", () => {
    expect(getPageMode(ROLE_HV, "/hv-portal")).toBe("view");
    expect(getPageMode(ROLE_HV, "/diem-danh")).toBe("view");
  });

  it("HV cannot access admin pages", () => {
    expect(canAccess(ROLE_HV, "/tai-khoan")).toBe(false);
  });

  it("roleHome returns correct routes", () => {
    expect(roleHome(ROLE_GV)).toBe("/gv-portal");
    expect(roleHome(ROLE_HV)).toBe("/hv-portal");
  });

  it("NV gets allowed non-admin paths", () => {
    const paths = allowedPaths(ROLE_NV);
    expect(paths.includes("/hoc-vien")).toBe(true);
    expect(paths.length).toBeGreaterThan(0);
  });
});
