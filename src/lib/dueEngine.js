export function calculateDueData(meter) {

  const today = new Date()

  let nextDueDate = null
  let nextVolumeDue = null
  let status = "GOOD"

  //
  // TIME CALCULATION
  //
  if (
    meter.last_prove_date &&
    meter.time_interval_days
  ) {

    const due = new Date(
      meter.last_prove_date
    )

    due.setDate(
      due.getDate() +
      Number(
        meter.time_interval_days
      )
    )

    nextDueDate = due

  }

  //
  // VOLUME CALCULATION
  //
  if (
    meter.last_prove_volume != null &&
    meter.volume_interval
  ) {

    nextVolumeDue =
      Number(
        meter.last_prove_volume
      ) +
      Number(
        meter.volume_interval
      )

  }

  //
  // STATUS
  //
  switch (
    meter.proving_method
  ) {

    case "TIME":

      if (nextDueDate) {

        const days =
          Math.floor(
            (
              nextDueDate -
              today
            ) /
            (1000*60*60*24)
          )

        if (days < 0)
          status = "OVERDUE"

        else if (days <= 7)
          status = "CRITICAL"

        else if (days <= 14)
          status = "DUE SOON"

      }

      break

    case "VOLUME":

      if (
        nextVolumeDue &&
        Number(
          meter.current_volume
        ) >= nextVolumeDue
      ) {

        status = "OVERDUE"

      }

      break

    case "WHICHEVER_COMES_FIRST":

      let dueByTime = false
      let dueByVolume = false

      if (nextDueDate) {

        dueByTime =
          nextDueDate <= today

      }

      if (
        nextVolumeDue &&
        Number(
          meter.current_volume
        ) >= nextVolumeDue
      ) {

        dueByVolume = true

      }

      if (
        dueByTime ||
        dueByVolume
      ) {

        status = "OVERDUE"

      }

      break

    default:

      break

  }

  return {

    nextDueDate,

    nextVolumeDue,

    status,

  }

}