import { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import { instanceObject } from "@/utils/format";
import { ActualBaseExcelTable, ExcelTable, ExcelTableType } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IRequestConfig<D = any> extends AxiosRequestConfig<D> {
  // 当网络请求错误时是否显示错误
  showResponseError?: boolean;
  // 当http 200但是 serverResponse.code !== 200 时是否显示 serverResponse.message
  // 默认开启
  showServerResponseError?: boolean;
  // 返回值是否是文件流
  isBlob?: boolean;
}

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IResponseError<T = any, D = any> extends AxiosError<T, D> {
  config: IRequestConfig<D>;
}

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IResponse<T = any, D = any> extends AxiosResponse<T, D> {
  config: IRequestConfig<D>;
}
// export type ServerResponse<T> = {
//   code: number;
//   message: string;
//   data: T;
// };

export type ServerResponse<T> = T;

export interface ApiServiceAdapter {
  upload(url: string, file: FormData | File): Promise<ServerResponse<string>>;
  download(id: string): AxiosPromise;
  raw<T>(config: IRequestConfig): Promise<ServerResponse<T>>;
  excel<T extends ExcelTableType>(
    type: T,
  ): Promise<ServerResponse<ExcelTable<NonNullable<ReturnType<ActualBaseExcelTable[T]["get"]>>>>>;
  urlDownload(url: string, data: instanceObject): void;
}

export const NetworkAdapter = {
  Offline: "离线",
  Localhost: "本地连接",
  Proxy: "代理",
};
export type NetworkAdapterType = keyof typeof NetworkAdapter;
