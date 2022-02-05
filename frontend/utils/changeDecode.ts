import iconv from 'iconv-lite'

export const changeDecode = (
  str: string,
  fromEncode?: string | undefined,
  intoEncode?: string | undefined
) => {
  return iconv.decode(
    iconv.encode(str, fromEncode || 'win1252'),
    intoEncode || 'utf8'
  )
}
