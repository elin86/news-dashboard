import dayjs from "dayjs";

export function isWithinLast24Hours(dateString) {
  if (!dateString) return false;

  const now = dayjs();
  const target = dayjs(dateString);

  if (!target.isValid()) return false;

  return now.diff(target, "hour", true) <= 24;
}