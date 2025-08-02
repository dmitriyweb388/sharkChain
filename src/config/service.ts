import fs from "fs";
import { CONFIG_PATH } from "./types";
import { ConfigSchema } from "./schemas";
import { Config } from "./types";
import { LoggerService } from "../logger/service";

export class ConfigService {
  private constructor() {}

  private static _config: Config | null;

  static async importAndValidateConfig() {
    try {
      if (!fs.existsSync(CONFIG_PATH)) {
        LoggerService.logError(`${CONFIG_PATH} was not provided`, true);
      }

      const configData = await import(`../../${CONFIG_PATH}`);
      const config: Config = configData?.default;

      const configValidation = ConfigSchema.safeParse(config);

      if (!configValidation.success) {
        LoggerService.logError(
          `Provided invalid config: ${configValidation.error}`,
          true
        );
      }

      this._config = config;

      LoggerService.logInfo(`Imported config from ${CONFIG_PATH}`);
    } catch {
      LoggerService.logError("Failed to import and (or) validate config", true);
    }
  }

  static get config() {
    if (!this._config) {
      LoggerService.logError("Failed to read config", true);
    }

    return this._config!;
  }
}
