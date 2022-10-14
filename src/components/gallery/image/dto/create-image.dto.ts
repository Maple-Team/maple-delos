export class CreateImageDto {
  readonly filename: string
  readonly width: number
  readonly height: number
  readonly imageViews?: number
  // 关联label albumid
}
