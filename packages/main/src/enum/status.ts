/**
 * 业务状态码
 */
export enum StatusEnum {
  OK = 0,
  FAILED = 1,
}

export enum VideoStatusEnum {
  /**
   * 仅有基础元数据
   */
  META = 0x00,
  /**
   * 有详情数据
   */
  DETAIL = 0x01,
  /**
   * 有图片(含封面和预览图)
   */
  PREVIEW = 0x02,
  /**
   * 有视频
   */
  VIDEO = 0x03,
  // 待拓展出更多状态，如评分，
  // CANCELLED = -0x03,
}
