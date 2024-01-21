//using bun 1.0.14
import rawSetting from "./input/rawSetting.json";
type ResourcesTypes =
  | "emotionImg"
  | "emotionSound"
  | "fx"
  | "otherSound"
  | "bgEffectResources"
  | "bgEffectSounds";
type Setting = typeof rawSetting;

//settings
const dataUrl = "https://yuuka.cdn.diyigemt.com/image/ba-all-data";

/**
 * 根据资源类型和参数获取资源地址, 可根据服务器实际情况修改
 * @param type
 * @param arg
 * @returns
 */
function getResourcesUrl(type: ResourcesTypes, arg: string): string {
  switch (type) {
    case "emotionImg":
      return `${dataUrl}/emotions/${arg}`;
    case "emotionSound":
      return `${dataUrl}/Audio/Sound/SFX_Emoticon_Motion_${arg}.wav`;
    case "fx":
      return `${dataUrl}/effectTexture/${arg}`;
    case "otherSound":
      return `${dataUrl}/${arg}`;
    case "bgEffectResources":
      return `${dataUrl}/effectTexture/${arg}`;
    case "bgEffectSounds":
      return `${dataUrl}/Audio/Sound/UI_FX_${arg}.wav`;
    default:
      return "";
  }
}

const finalSetting: Setting = Object.create(rawSetting);

//other sound
for (const key of Object.keys(finalSetting["otherSounds"]) as Array<
  keyof Setting["otherSounds"]
>) {
  finalSetting["otherSounds"][key] = getResourcesUrl(
    "otherSound",
    finalSetting["otherSounds"][key]
  );
}

//emotion
for (const key of Object.keys(finalSetting["emotion"]) as Array<
  keyof Setting["emotion"]
>) {
  const imgs = finalSetting["emotion"][key]["imgs"];
  const imgUrls = [];
  for (const img of imgs) {
    imgUrls.push(getResourcesUrl("emotionImg", img));
  }
  finalSetting["emotion"][key]["imgs"] = imgUrls;
  finalSetting["emotion"][key]["sound"] = getResourcesUrl("emotionSound", key);
}

//fx
for (const key of Object.keys(finalSetting.fx) as Array<keyof Setting["fx"]>) {
  const imgs = finalSetting.fx[key];
  const finalImgs: string[] = [];
  for (const img of imgs) {
    finalImgs.push(getResourcesUrl("fx", img));
  }
  finalSetting.fx[key] = finalImgs;
}

//bgeffect
for (const key of Object.keys(finalSetting["bgEffect"]) as Array<
  keyof Setting["bgEffect"]
>) {
  const resources = finalSetting["bgEffect"][key]["effectResources"];
  for (const key in resources) {
    Reflect.set(
      resources,
      key,
      getResourcesUrl("bgEffectResources", Reflect.get(resources, key))
    );
  }
  const sound = finalSetting["bgEffect"][key]["sound"];
  if (sound !== "") {
    finalSetting["bgEffect"][key]["sound"] = getResourcesUrl(
      "bgEffectSounds",
      sound
    );
  }
}

//没有这布对象序列化会返回空对象
for (const key in finalSetting) {
  Reflect.defineProperty(finalSetting, key, {
    value: Reflect.get(finalSetting, key),
    enumerable: true,
  });
}
await Bun.write(
  "./src/ci/output/setting.json",
  JSON.stringify(finalSetting, null, 2)
);
