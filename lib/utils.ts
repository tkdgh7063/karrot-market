import { DAY, HOUR, MINUTE, MONTH, YEAR } from "./constants";

export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}

export function formatDate(date: Date): string {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const time = new Date(date).getTime();
  const nowTime = new Date().getTime();
  const diff = time - nowTime;
  const absDiff = Math.abs(diff);

  if (absDiff > YEAR) return formatter.format(Math.floor(diff / YEAR), "year");
  else if (absDiff > MONTH)
    return formatter.format(Math.floor(diff / MONTH), "month");
  else if (absDiff > DAY)
    return formatter.format(Math.floor(diff / DAY), "day");
  else if (absDiff > HOUR)
    return formatter.format(Math.floor(diff / HOUR), "hour");
  else if (absDiff > MINUTE)
    return formatter.format(Math.floor(diff / MINUTE), "minute");
  else return "just now";
}

export function formatMessageDate(date: Date): string {
  const dateStr = date.toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return `${dateStr}`;
}

export function formatStreamDate(date: Date): string {
  const now = new Date().getTime();
  const streamStart = new Date(date).getTime();
  let diff = now - streamStart;

  if (diff < 0) diff = 0;

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (day > 0) return `${day}d ${hour % 24}h ${min % 60}m`;
  if (hour > 0) return `${hour}h ${min % 60}m`;
  if (min > 0) return `${min}m ${sec % 60}s`;
  return `Just now`;
}

export function formatStreamChatDate(date: Date): string {
  const timeStr = date.toLocaleTimeString("ko-KR", {
    hour12: false,
    timeStyle: "short",
  });
  return `${timeStr}`;
}
