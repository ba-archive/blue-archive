import axios from "axios";
import secrets from "../secrets.json";

const { ANTHROPIC_TIER1_SECRET } = secrets;

export const createAnthropicInstance = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": ANTHROPIC_TIER1_SECRET || "",
      "anthropic-beta": "prompt-caching-2024-07-31",
      "anthropic-dangerous-direct-browser-access": "true",
    },
  });
};
