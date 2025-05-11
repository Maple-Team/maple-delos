import dayjs from 'dayjs'

export const getTimeStr = () => dayjs().format('YYYY-MM-DD HH:mm:ss SSS')
