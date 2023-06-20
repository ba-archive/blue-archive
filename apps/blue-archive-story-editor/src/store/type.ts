import { NetworkAdapterType } from "@/interface/http";

export type BaseStoreState = {
  adapter: NetworkAdapterType;
  theme: {
    themeType: string;
    themeColor: string | number;
  };
};
