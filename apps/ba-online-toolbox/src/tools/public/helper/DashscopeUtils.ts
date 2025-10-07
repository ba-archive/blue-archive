import axios from "axios";
import secrets from "../secrets.json";

const { DASHSCOPE_API_KEY } = secrets;

export const createDashscopeInstance = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DASHSCOPE_API_KEY}`,
    },
    method: "POST",
  });
};