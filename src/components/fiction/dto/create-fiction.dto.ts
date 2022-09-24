export class CreateFictionDto {
  readonly bookName: string;
  readonly chapterName: string;
  readonly chapterNo: number;
  readonly chapterContent: string;
  readonly readCount?: number;
  // readonly label?: Label[]; // 多对多 关联表
  readonly words: number;
}
