import mitt from "mitt";
import { Events } from "@/types/events";

const eventBus = mitt<Events>();
export default eventBus;
