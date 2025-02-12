import dayjs, { Dayjs } from "dayjs";

export function formatDateToString(
  date?: Dayjs | string | null,
  formatType = "DD/MM/YYYY"
) {
  if (!date) return "";
  return dayjs(date).format(formatType);
}

export const formatToTimeString = (date?: Dayjs | string | null) =>
  formatDateToString(date, "DD/MM/YYYY HH:mm:ss");

export const disabledBeforeNow = (date: Dayjs) =>
  date.valueOf() < dayjs().valueOf();

export function checkDisableFrom(
  startDate: Dayjs,
  toDateValue: Dayjs,
  disableAfterToday = true
) {
  if (disableAfterToday && startDate?.valueOf() > dayjs().valueOf()) {
    return true;
  }

  if (!startDate || !toDateValue) {
    return false;
  }

  return startDate.valueOf() >= toDateValue.valueOf();
}

export function checkDisableTo(
  endDate: Dayjs,
  fromDateValue: Dayjs,
  disableAfterToday = true
) {
  if (disableAfterToday && endDate?.valueOf() > dayjs().valueOf()) {
    return true;
  }

  if (!fromDateValue || !endDate) {
    return false;
  }

  return endDate.valueOf() <= fromDateValue.valueOf();
}

const isDateAAfterDateB =
  (dateB = dayjs()) =>
  (dateA: Dayjs) => {
    // Set both dates to the start of the day
    const startOfDateA = dateA.startOf("day");
    const startOfDateB = dateB.startOf("day");

    // Compare if startOfDateA is after startOfDateB
    return startOfDateA.isAfter(startOfDateB);
  };

const isDateABeforeDateB =
  (dateB = dayjs()) =>
  (dateA: Dayjs) => {
    // Set both dates to the start of the day
    const startOfDateA = dateA.startOf("day");
    const startOfDateB = dateB.startOf("day");

    // Compare if startOfDateA is before startOfDateB
    return startOfDateA.isBefore(startOfDateB);
  };

export const checkDayDisabledFrom =
  (toDateValue?: Dayjs, hasFuture = false) =>
  (date: Dayjs) => {
    if (!hasFuture && isDateAAfterDateB()(date)) {
      return true;
    }
    if (!toDateValue) {
      return false;
    }

    return isDateAAfterDateB(toDateValue)(date);
  };

export const checkDayDisabledTo =
  (fromDateValue?: Dayjs, hasFuture = false) =>
  (date: Dayjs) => {
    if (!hasFuture && isDateAAfterDateB()(date)) {
      return true;
    }
    if (!fromDateValue) {
      return false;
    }

    return isDateABeforeDateB(fromDateValue)(date);
  };
