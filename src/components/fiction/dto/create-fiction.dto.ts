export class CreateFictionDto {
  readonly name: string;
  readonly chapter: number;
  readonly content: string;
  readonly readCount: number;
  readonly label: FictionLabel[];
  readonly words: number;
}

export class FictionLabel {
  readonly id: string;
  readonly name: string;
}
