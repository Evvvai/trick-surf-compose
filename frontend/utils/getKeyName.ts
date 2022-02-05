const getKeyName = (obj: any) => (key: string) => {
  return (Object.keys(obj) as Array<keyof typeof obj>).filter((x) => {
    return obj[x] === key
  })[0]
}

export default getKeyName
