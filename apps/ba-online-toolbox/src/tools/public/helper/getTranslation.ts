import axios from "axios";

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// import { appKey, appSecret } from './translationSecrets';
import secrets from "../secrets.json";
import sha256 from "crypto-js/sha256";

const { YOUDAO_APP_ID, YOUDAO_APP_SECRET } = secrets;

const salt = crypto.randomUUID();
const api = "/api";
const signType = "v3";

function getSign(input: string, currtime: number): string {
  // sign = sha256(应用ID + input + salt + currtime + 应用密钥)；
  const querySign =
    input.length > 20
      ? input.slice(0, 10) + input.length.toString() + input.slice(-10)
      : input;
  const signStr =
    YOUDAO_APP_ID + querySign + salt + currtime + YOUDAO_APP_SECRET;

  return sha256(signStr).toString();
}

// 半角符号转全角符号
function halfToFull(str: string) {
  return str.replaceAll(/([\u0021-\u002F\u003A-\u003F])/g, s =>
    String.fromCharCode(s.charCodeAt(0) + 0xfee0)
  );
}

function translate(text: string, from = "ja", to = "zh-CHS") {
  const currtime = Math.round(new Date().getTime() / 1000);
  const sign = getSign(text, currtime);
  return axios
    .get(api, {
      params: {
        q: text,
        appKey: YOUDAO_APP_ID,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
        signType: signType,
        curtime: currtime,
      },
      headers: {
        "Access-Control-Allow-Origin": "*", // CORS
      },
    })
    .then(res => res.data);
}

export { getSign, halfToFull, translate };
