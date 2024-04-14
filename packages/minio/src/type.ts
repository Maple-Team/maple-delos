export interface LocaleData {
  locale: 'zh-cn' | 'zh-hk' | 'en-us'
  data: Record<string, string>
  version: string
  ns?: string
}
