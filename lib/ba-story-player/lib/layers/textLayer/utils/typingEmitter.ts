import { BaseTypingEvent } from "@/layers/textLayer/types";
import mitt from "mitt";

type BaseEvent = {
  [key in BaseTypingEvent]: string | undefined;
};

const TypingEmitter = mitt<BaseEvent>();

export default TypingEmitter;
