export interface RawMedia {
  id: number
  offset: number
  index: number
  /**
   * 简介
   */
  intro: string
  attr: number
  tid: number
  copy_right: number
  cnt_info: Cntinfo
  /**
   * 封面
   */
  cover: string
  /**
   * 时长
   */
  duration: number
  /**
   * 发布时间
   */
  pubtime: number
  like_state: number
  fav_state: number
  page: number
  pages: Page[]
  /**
   * 标题
   */
  title: string
  type: number
  /**
   * upper信息
   */
  upper: RawUpper
  link: string
  /**
   * 番号
   */
  bv_id: string
  /**
   * 短链
   */
  short_link: string
  rights: Rights
  elec_info?: any
  coin: Coin
}

type Upper = RawMedia['upper']

type Media =
  | Pick<RawMedia, 'bv_id' | 'intro' | 'cover' | 'duration' | 'pubtime' | 'title' | 'short_link'> &
      Pick<Upper, 'name' | 'face' | 'mid'> & { pubtime2: Date }

interface Coin {
  max_num: number
  coin_number: number
}

interface Rights {
  bp: number
  elec: number
  download: number
  movie: number
  pay: number
  ugc_pay: number
  hd5: number
  no_reprint: number
  autoplay: number
  no_background: number
}

/**
 * up主信息
 */
interface RawUpper {
  mid: number
  /**
   * 名称
   */
  name: string
  /**
   * 头像
   */
  face: string
  followed: number
  fans: number
  vip_type: number
  vip_statue: number
  vip_due_date: number
  vip_pay_type: number
  official_role: number
  official_title: string
  official_desc: string
  display_name: string
}
