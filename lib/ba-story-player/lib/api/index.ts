import axios, { AxiosInstance } from "axios";
import { getResourcesUrl } from "@/utils";
import { retry } from "radash";

const api: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

interface ExcelResponse<T> {
  DataList: T[];
}

// 封装重试请求
async function retryableRequest<T>(fn: () => Promise<T>): Promise<T> {
  return retry(
    {
      times: 3,
      delay: 1000,
    },
    async () => fn()
  );
}

// exceltable API
export const excelApi = {
  async getBGNameExcel() {
    return retryableRequest(async () => {
      const { data } = await api.get<ExcelResponse<any>>(
        getResourcesUrl("excel", "ScenarioBGNameExcelTable.json")
      );
      return data.DataList;
    });
  },

  async getCharacterNameExcel() {
    return retryableRequest(async () => {
      const { data } = await api.get<ExcelResponse<any>>(
        getResourcesUrl("excel", "ScenarioCharacterNameExcelTable.json")
      );
      return data.DataList;
    });
  },

  async getBGMExcel() {
    return retryableRequest(async () => {
      const { data } = await api.get<ExcelResponse<any>>(
        getResourcesUrl("excel", "BGMExcelTable.json")
      );
      return data.DataList;
    });
  },

  async getTransitionExcel() {
    return retryableRequest(async () => {
      const { data } = await api.get<ExcelResponse<any>>(
        getResourcesUrl("excel", "ScenarioTransitionExcelTable.json")
      );
      return data.DataList;
    });
  },

  async getBGEffectExcel() {
    return retryableRequest(async () => {
      const { data } = await api.get<ExcelResponse<any>>(
        getResourcesUrl("excel", "ScenarioBGEffectExcelTable.json")
      );
      return data.DataList;
    });
  },

  async getEmotionExcel() {
    return retryableRequest(async () => {
      const { data } = await api.get<ExcelResponse<any>>(
        getResourcesUrl("excel", "ScenarioCharacterEmotionExcelTable.json")
      );
      return data.DataList;
    });
  },
};
