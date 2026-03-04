export const logger = {
  info: (msg: string, meta?: unknown) => console.info(msg, meta ?? ""),
  error: (msg: string, meta?: unknown) => console.error(msg, meta ?? ""),
  time: (label: string) => console.time(label),
  timeEnd: (label: string) => console.timeEnd(label)
};
