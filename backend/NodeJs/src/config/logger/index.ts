import { DEBUG_COLOR, ERROR_COLOR, LOG_COLOR } from '@environments';
import { ConsoleLogger } from '@nestjs/common';
import * as chalk from 'chalk';

export class MyLogger extends ConsoleLogger {
  log(message: string) {
    super.log(chalk.hex(LOG_COLOR).bold(message.toString()));
  }
  error(message: string, trace: string) {
    super.error.apply(chalk.hex(ERROR_COLOR).bold(message.toString()), trace);
  }
  warn(message: string) {
    super.warn(message);
  }
  debug(message: string) {
    super.debug(chalk.hex(DEBUG_COLOR).bold(message.toString()));
  }
  verbose(message: string) {
    super.verbose(message);
  }
}
