import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../services/api";

vi.mock("../services/api", () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return { default: mockApi };
});

import { getAll, getById, createData, updateData, deleteData } from "../services/crudService";

describe("crudService", () => {
  beforeEach(() => {
    api.get.mockReset();
    api.post.mockReset();
    api.put.mockReset();
    api.delete.mockReset();
  });

  it("getAll gọi GET endpoint", async () => {
    api.get.mockResolvedValue({ data: [1, 2] });
    const res = await getAll("/hoc-vien");
    expect(api.get).toHaveBeenCalledWith("/hoc-vien");
    expect(res.data).toEqual([1, 2]);
  });

  it("getById gọi GET endpoint/id", async () => {
    api.get.mockResolvedValue({ data: { id: 5 } });
    await getById("/tai-khoan", 5);
    expect(api.get).toHaveBeenCalledWith("/tai-khoan/5");
  });

  it("createData gọi POST endpoint với body", async () => {
    const body = { hoten: "A" };
    api.post.mockResolvedValue({ data: body });
    await createData("/hoc-vien", body);
    expect(api.post).toHaveBeenCalledWith("/hoc-vien", body);
  });

  it("updateData gọi PUT endpoint/id với body", async () => {
    const body = { hoten: "B" };
    api.put.mockResolvedValue({ data: body });
    await updateData("/tai-khoan", 3, body);
    expect(api.put).toHaveBeenCalledWith("/tai-khoan/3", body);
  });

  it("deleteData gọi DELETE endpoint/id", async () => {
    api.delete.mockResolvedValue({});
    await deleteData("/tai-khoan", 7);
    expect(api.delete).toHaveBeenCalledWith("/tai-khoan/7");
  });
});
