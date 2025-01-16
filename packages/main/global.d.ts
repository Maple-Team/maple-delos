/// <reference types="@liutsing/types-utils/global" />

declare type LabelType = 'normal' | 'fiction' | 'image'

declare interface LocaleData {
  locale: 'zh-cn' | 'zh-hk' | 'en-us'
  data: Record<string, string>
  version: string
  ns?: string
  project: string
}

declare interface RequestLogInfo {
  method: string
  ip: string
  url: string
  ua: string
  payload?: string
  uid?: string
  username?: string
  body?: string
}
