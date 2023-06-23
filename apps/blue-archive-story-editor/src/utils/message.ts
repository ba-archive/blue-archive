import { ElMessage, ElMessageBox } from "element-plus";
import { ElMessageBoxOptions, MessageBoxData } from "element-plus/es/components/message-box/src/message-box.type";

export function infoMessage(info: string) {
  return ElMessage.info(info);
}
export function successMessage(info: string) {
  return ElMessage.success(info);
}
export function warningMessage(info: string) {
  return ElMessage.warning(info);
}
export function errorMessage(info: string) {
  return ElMessage.error(info);
}

export function IPrompt(title: string, message: string, config?: ElMessageBoxOptions): Promise<MessageBoxData> {
  return ElMessageBox.prompt(message, title, config);
}

export function IConfirm(title: string, message: string, config?: ElMessageBoxOptions) {
  return ElMessageBox.confirm(message, title, config);
}

export function IWarningConfirm(title: string, message: string, config?: ElMessageBoxOptions) {
  return IConfirm(title, message, {
    ...config,
    type: "warning",
  });
}
