export function getStatus(meter) {

  const today = new Date()

  // -----------------------
  // TIME STATUS
  // -----------------------

  let timeStatus = "GOOD"

  if (meter?.next_due_date) {

    const nextDue = new Date(meter.next_due_date)

    const daysUntilDue = Math.floor(
      (nextDue.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    )

    if (daysUntilDue < 0)
      timeStatus = "OVERDUE"
    else if (daysUntilDue <= 7)
      timeStatus = "CRITICAL"
    else if (daysUntilDue <= 14)
      timeStatus = "DUE SOON"

  }

  // -----------------------
  // VOLUME STATUS
  // -----------------------

  const volumeDue =

    meter?.volume_threshold != null &&

    meter?.current_volume != null &&

    Number(meter.current_volume) >=
    Number(meter.volume_threshold)

  // -----------------------
  // PROVING METHOD
  // -----------------------

  switch (meter?.proving_method) {

    case "TIME":

      return timeStatus

    case "VOLUME":

      return volumeDue
        ? "OVERDUE"
        : "GOOD"

    case "WHICHEVER_COMES_FIRST":

      if (
        timeStatus === "OVERDUE" ||
        volumeDue
      ) {

        return "OVERDUE"

      }

      return timeStatus

    default:

      return timeStatus

  }

}

export function getPriority(status) {
  switch (status) {
    case "OVERDUE":
      return 1;

    case "CRITICAL":
      return 2;

    case "DUE SOON":
      return 3;

    default:
      return 4;
  }
}

export function isDueThisWeek(meter) {
  if (!meter?.next_due_date) return false;

  const today = new Date();

  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const due = new Date(meter.next_due_date);

  return due >= today && due <= nextWeek;
}

export function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString();
}

export function sortMetersByPriority(meters) {
  return [...meters].sort((a, b) => {
    const priorityA = getPriority(getStatus(a));
    const priorityB = getPriority(getStatus(b));

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return (
      new Date(a.next_due_date) -
      new Date(b.next_due_date)
    );
  });
}