import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { YAHOO_SEMANTIC_ID } from "../secrets.json";
import { Semantic } from "../../ScenarioEditor/types/Semantic";

const instance = axios.create({
  baseURL: "https://toolbox.blue-archive.io/MAService/V2/parse",
  headers: {
    "Content-Type": "application/json",
    // "User-Agent": `Yahoo AppID: ${YAHOO_SEMANTIC_ID}`,
  },
});

function distillText(text: string) {
  // replace all square brackets and contents inside, "\\"" with ""
  const regexp = /\[.*?\]|\\"|\s/g;
  return text.replace(regexp, "");
}

export async function parseSemantics(text: string) {
  // const response = instance
  //   .post("", {
  //     id: uuidv4(),
  //     jsonrpc: "2.0",
  //     method: "jlp.maservice.parse",
  //     params: {
  //       q: distillText(text),
  //     },
  //   })
  //   .then(res => {
  //     console.log(res);
  //     return res.data;
  //   });
  // return response;
  const response = await fetch("https://toolbox.blue-archive.io/MAService/V2/parse", {
    method: "OPTIONS",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `Yahoo AppID: ${YAHOO_SEMANTIC_ID}`,
    },
    body: JSON.stringify({
      id: uuidv4(),
      jsonrpc: "2.0",
      method: "jlp.maservice.parse",
      params: {
        q: distillText(text),
      },
    }),
  });
  const json = await response.json();
  return json as Semantic;
}
