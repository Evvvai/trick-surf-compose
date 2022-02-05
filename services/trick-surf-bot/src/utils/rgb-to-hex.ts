import { HexColorString } from 'discord.js'

export const componentToHex = (c: number) => {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export const rgbToHex = (r: number, g: number, b: number): HexColorString => {
  return ('#' + componentToHex(r) + componentToHex(g) + componentToHex(b)) as HexColorString
}
