import instance from "./index";
import type { History, HistoryInfo } from "../types/historyInfo";

// Backend history endpoints (all require authorization)
// GET /api/history
// GET /api/history/type/:type
// GET /api/history/:id
// POST /api/history
// DELETE /api/history/:id

const getAllHistory = async (): Promise<History[]> => {
  const { data } = await instance.get("/history");
  return data.history || data;
};

const getHistoryById = async (id: string): Promise<History> => {
  const { data } = await instance.get(`/history/${id}`);
  return data.history || data;
};

const getHistoryByType = async (type: string): Promise<History[]> => {
  const { data } = await instance.get(`/history/type/${type}`);
  return data.history || data;
};

const createHistory = async (history: Partial<History>): Promise<History> => {
  const { data } = await instance.post("/history", history);
  return data.newHistory || data.history || data;
};

const deleteHistory = async (id: string): Promise<void> => {
  await instance.delete(`/history/${id}`);
};

export {
  getAllHistory,
  getHistoryById,
  getHistoryByType,
  createHistory,
  deleteHistory,
};

