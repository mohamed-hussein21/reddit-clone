import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// '2026-11-27T17:29:18Z' -> '5 hours ago'
export function formatTime(date) {
  return dayjs(date).fromNow();
}
