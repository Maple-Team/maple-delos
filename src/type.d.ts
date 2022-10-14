// TODO move to base type lib
declare interface BaseList<T> {
  pagination: {
    total: number
    current: number
    pageSize: number
  }
  records: T[]
}

declare interface BaseResponse<T> {
  status: number
  message: string
  data: T
}

declare type LabelType = 'normal' | 'fiction' | 'image'
