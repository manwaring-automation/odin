import { format, createLogger, transports } from 'winston';

export const log = createLogger({
  level: process.env.LOG_LEVEL,
  format: format.simple(),
  transports: [new transports.Console()]
});
