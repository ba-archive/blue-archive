import { Application } from "pixi.js";
import { HandlerMap, StoryNode } from "../type";
import { BgLayer } from "../layers/bgLayer";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ShowLayer } from "../playerSubLayers/showLayer";
const PIXIHeight = 1012.5;
gsap.registerPlugin(PixiPlugin);

const registerServers = {
  bg: BgLayer,
  show: ShowLayer,
};
type RegisterServers = typeof registerServers;
type ServerInstances = {
  [server in keyof RegisterServers]: InstanceType<
    (typeof registerServers)[server]
  >;
};
export default class NodePlayer {
  app: Application;
  handlerMap: HandlerMap;
  serversInstance: ServerInstances;
  constructor(width: number) {
    this.app = new Application({ width: width, height: PIXIHeight });
    this.handlerMap = {} as HandlerMap;
    const tempInstances: Record<string, any> = {};
    for (const key of Object.keys(registerServers) as Array<
      keyof RegisterServers
    >) {
      tempInstances[key] = new registerServers[key](this.app, this.handlerMap);
    }
    this.serversInstance = tempInstances as ServerInstances;
  }
  mouted(parent: HTMLElement) {
    parent.appendChild(this.app.view);
  }
  async playNode(node: StoryNode) {
    const checkPromises: Promise<void>[] = [];
    for (const server of Object.values(this.serversInstance)) {
      checkPromises.push(server.check(node, this.app, this.handlerMap));
    }
    await Promise.all(checkPromises);
  }
  async stop() {
    await Promise.all(
      Object.values(this.serversInstance).map(instance => instance.stop())
    );
  }
  unMounted() {
    this.app.destroy();
  }
}

export { PIXIHeight };
