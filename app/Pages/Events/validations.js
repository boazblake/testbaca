import { curryN, identity, lensProp, mergeAll } from "ramda"
import { Success } from "data.validation"
import { validate, isRequired } from "@/Utils"
import dayjs from "dayjs"

const hasDaysOfWeekSelected = (data) => (isRecur) =>
  isRecur ? data.daysRecur.any() : true

const datesAreGreaterThanOneDay = (data) => (isRecur) =>
  isRecur
    ? dayjs(data.end).isAfter(dayjs(data.start).add(1, "day"), "day")
    : true

const DatesAreChrono = (data) => (start) =>
  dayjs(data.end).isAfter(dayjs(start))

const ValidateEvent = Success(curryN(5, identity))

const titleLens = lensProp("title")
const detailsLens = lensProp("description")
const locationLens = lensProp("location")
const isRecurLens = lensProp("isRecur")
const startDateLens = lensProp("start")

const validateDates = (data) =>
  Success(data).apLeft(
    validate(
      DatesAreChrono(data),
      startDateLens,
      "Start date must precede End Date.",
      data
    )
  )

const validateTitle = (data) =>
  Success(data).apLeft(
    validate(isRequired, titleLens, "Your event needs a title.", data)
  )

const validateDescription = (data) =>
  Success(data).apLeft(
    validate(
      isRequired,
      detailsLens,
      "Your event needs some information.",
      data
    )
  )

const validateLocation = (data) =>
  Success(data).apLeft(
    validate(isRequired, locationLens, "Your event needs a location.", data)
  )

const validateRecur = (data) =>
  Success(data)
    .apLeft(
      validate(
        hasDaysOfWeekSelected(data),
        isRecurLens,
        "You need to select at least one day to recure on",
        data
      )
    )
    .apLeft(
      validate(
        datesAreGreaterThanOneDay(data),
        isRecurLens,
        "Start and End date need to be greater than one day apart",
        data
      )
    )

export const validateEventTask = (data) => {
  console.log(data)
  return ValidateEvent.ap(validateTitle(data))
    .ap(validateDescription(data))
    .ap(validateLocation(data))
    .ap(validateRecur(data))
    .ap(validateDates(data))
    .failureMap(mergeAll)
    .toTask()
}

