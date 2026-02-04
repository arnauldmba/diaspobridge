export function normalizeToStartOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function futureDatesOnly(d: Date | null): boolean {
  if (!d) return false;

  const today = normalizeToStartOfDay(new Date());
  const date = normalizeToStartOfDay(d);

  return date >= today;
}