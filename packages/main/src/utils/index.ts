import dayjs from 'dayjs'

export const getTimeStr = () => dayjs().format('YYYY-MM-DD HH:mm:ss SSS')
export const formatName = (name: string) => {
  return `${name
    .replace(/\s*\(/g, '_')
    .replace(/\s*（/g, '_')
    .replace(/\)/g, '')
    .replace(/）/g, '')
    .replace(/"/g, '')
    .replace(/&/g, '')
    .replace('▼SonYoonJoo▲', '')}`
}
