import chalk from "chalk";

export class LoggerService {
  private static info = chalk.bold.bgBlue(" INFO ");
  private static warning = chalk.bold.bgYellow(" WARNING ");
  private static error = chalk.bold.bgRed(" ERROR ");

  static logInfo(text: string) {
    console.log(`${this.info} ${text}`);
  }

  static logWarning(text: string) {
    console.log(`${this.warning} ${text}`);
  }

  static logError(text: string, stopNode?: boolean) {
    console.log(`${this.error} ${text}`);

    if (stopNode) {
      process.exit(1);
    }
  }
}
