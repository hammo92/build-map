import { themeDefault } from './themeDefault'
import { themeOverrides } from './themeOverrides'

export { themeDefault, themeOverrides }
export const theme = { ...themeDefault, ...themeOverrides }
