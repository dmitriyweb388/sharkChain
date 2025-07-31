export type Config = {
  port: number;
  nodeAddress: string;
  bootstrapNodes: string[];
};

export const CONFIG_PATH = "config.json";
