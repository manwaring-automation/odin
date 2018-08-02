import { createLogger, format, transports } from 'winston';

const custom = format.printf(info => {
  return `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`;
});

export const log = createLogger({
  level: process.env.LOG_LEVEL,
  format: custom,
  transports: [
    new transports.Console({
      format: custom
    })
  ]
});
