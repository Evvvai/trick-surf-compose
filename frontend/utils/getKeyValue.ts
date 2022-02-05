const getKeyValue =
  <T extends object, U extends keyof T>(obj: T) =>
  (key: U) => {
    return obj[key]
  }

export default getKeyValue
