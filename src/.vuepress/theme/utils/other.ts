export function toISODate(d: number | string | Date) {
  // @ts-ignore
  const ISODate = new Date(d)
  ISODate.setHours(ISODate.getHours(), ISODate.getMinutes() - ISODate.getTimezoneOffset())
  return ISODate.toISOString().replace("T", " ").replace("Z", "").split(".")[0]
}
