const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

/**
 * Converts a datetime-local input into a UTC timestamp for the API.
 *
 * The input contains no timezone. Its values are interpreted using the
 * creator's device timezone, including the offset applicable on that date.
 *
 * For example, 2026-09-20T18:00 on a device using Singapore time becomes
 * 2026-09-20T10:00:00.000Z. Both represent the same moment.
 *
 * JavaScript resolves repeated clock-change times to the earlier instant.
 * Times shifted forward through a daylight-saving gap are rejected here.
 *
 * @param value - Minute-precision value from a datetime-local input.
 * @returns An ISO timestamp in UTC, identified by its trailing Z.
 * @throws If the value is invalid or its local time does not exist.
 */
export function localDateTimeToIso(value: string): string {
  const input = value.trim();

  if (!input) {
    throw new Error("Choose an auction deadline.");
  }

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input)) {
    throw new Error("Enter a valid date and time.");
  }

  const [datePart, timePart] = input.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // No timezone suffix: JavaScript interprets this as device-local time.
  const date = new Date(input);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    throw new Error(
      "Enter a valid date and time. This local time may not exist because of a daylight-saving change.",
    );
  }

  return date.toISOString();
}

/**
 * Formats an API timestamp in the viewer's device timezone.
 *
 * API timestamps must identify an instant using Z or a numeric UTC offset.
 * Omitting timeZone from the formatter uses the viewer's device timezone.
 * The en-US locale controls presentation, not the timezone.
 *
 * @param value - Timestamp supplied by the API.
 * @returns Local date and time with a timezone label, or a fallback message.
 */
export function formatLocalDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return dateTimeFormatter.format(date);
}
