export type Config = {
  port: number;
  nodeAddress: string;
  bootstrapNodes: string[];
  privateKey: string;
  mining: {
    enableMining: boolean;
  };
};

export const CONFIG_PATH = "config.json";
