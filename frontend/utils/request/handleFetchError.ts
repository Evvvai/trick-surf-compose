const handleFetchError = (err: Error): Promise<any> => {
  console.error(err)

  return Promise.reject()
}

export default handleFetchError
