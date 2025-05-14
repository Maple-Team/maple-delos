import dayjs from 'dayjs'

export const getTimeStr = () => dayjs().format('YYYY-MM-DD HH:mm:ss SSS')

/**
 *
 * @param name
 * @returns
 */
export const normalizeName = (name: string) => {
  return name
    .replace(/▼.*?▲/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[()（）]/g, '_')
    .replace(/["&]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
}
