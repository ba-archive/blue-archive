import useSettingStore from "@/store/base";
import { ApiServiceAdapter, NetworkAdapterType } from "@/interface/http";
import LocalhostService from "@/api/adapter/localhost";

const ServiceHandler: ProxyHandler<ApiServiceAdapter> = {
  get(_, key) {
    const settingStore = useSettingStore();
    const adapter = Reflect.get(AdapterMap, settingStore.adapter) || LocalhostService;
    return Reflect.get(adapter, key);
  },
};
type AdapterMap = {
  [key in NetworkAdapterType]: ApiServiceAdapter;
};
// TODO
const AdapterMap: AdapterMap = {
  Localhost: LocalhostService,
  Offline: LocalhostService,
  Proxy: LocalhostService,
};

const service = new Proxy(LocalhostService, ServiceHandler);

export default service;
