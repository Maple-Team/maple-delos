export class CreateBlogDto {
  readonly title: string
  readonly reads: number
  readonly content: string
  readonly category: string
  readonly date: string
  readonly url: string
  readonly isRecommend: boolean
}
