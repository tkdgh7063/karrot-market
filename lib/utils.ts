import { DAY, HOUR, MINUTE, MONTH, SECOND, YEAR } from "./constants";

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
  else return formatter.format(Math.floor(diff / SECOND), "second");
}
