import secrets from "../secrets.json";
import type { AxiosError } from "axios";
import { createDashscopeInstance } from "./DashscopeUtils";
import { llmModels as models } from "./config/llmModels";
const { DASHSCOPE_API_KEY } = secrets;

const instance = createDashscopeInstance();

interface DashscopeContent {
  status_code: number;
  message: string;
  output: {
    choices: {
      finish_reason: "null" | "stop" | "length" | "tool_calls";
      message: {
        role: "assistant";
        content: string;
      }
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }
}

enum TranslationMode {
  "new",
  "amend",
}

const dashscope_request = {
  model: "qwen3-max",
  
};

export { instance };