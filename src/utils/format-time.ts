import dayjs from 'dayjs';

export function fDate(date: Date, newFormat = 'DD MMM YYYY') {
  return dayjs(date).format(newFormat);
}

export function fDatetime(date: Date, newFormat = 'DD MMM YYYY HH:mm:ss') {
  return dayjs(date).format(newFormat);
}

export function fDateDifference(min: Date, max: Date) {
  return dayjs(min).diff(dayjs(max), 'day', false);
}

export function fTime(date: Date) {
  return date ? dayjs(date).format('HH:mm:ss') : '';
}

export function fDateDifferenceAutoText(now: Date, date: Date) {
  const day = dayjs(now).diff(dayjs(date), 'day', false);
  if (day > 0) return `${day} gün önce`;

  const hour = dayjs(now).diff(dayjs(date), 'hour', false);
  if (hour > 0) return `${hour} saat önce`;

  const minute = dayjs(now).diff(dayjs(date), 'minute', false);
  if (minute > 0) return `${minute} dakika önce`;

  return 'Az önce';
}
