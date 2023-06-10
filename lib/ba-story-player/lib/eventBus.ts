import { Events } from "@/types/events";
import mitt from "mitt";

const eventBus = mitt<Events>();
export default eventBus;
