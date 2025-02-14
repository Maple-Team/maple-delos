import { PartialType } from '@nestjs/mapped-types'
import { CreateTimelineDto } from './create-timeline.dto'

export class UpdateTimelineDto extends PartialType(CreateTimelineDto) {
  //   @ApiProperty({ description: 'id主键', example: 'xxxx' })
  //   @IsNotEmpty({ message: 'id主键不能为空' })
  //   @IsString({ message: 'id主键必须是字符串' })
  //   id: string
}

// https://kimi.moonshot.cn/chat/cu1reu76rtpci1kl9l2g
// 在 NestJS 中，当你使用 PartialType 自动生成 UpdateTimelineDto 类时，该类的字段会自动从 CreateTimelineDto 继承，但所有字段都会变为可选的。这意味着在更新操作中，客户端可以只发送需要更新的字段。
// 如果你希望为 UpdateTimelineDto 中的字段定义额外的校验规则，可以通过以下几种方式实现：
// 方法 1：直接在 UpdateTimelineDto 中覆盖字段并添加校验规则
// 你可以在 UpdateTimelineDto 中覆盖字段，并为这些字段添加新的校验规则。例如：
// TypeScript复制
// // update-timeline.dto.ts
// import { PartialType, ApiProperty } from '@nestjs/swagger';
// import { IsEnum, IsString, IsOptional } from 'class-validator';
// import { CreateTimelineDto } from './create-timeline.dto';
// import { TimelineEnum } from './enums/timeline.enum';

// export class UpdateTimelineDto extends PartialType(CreateTimelineDto) {
//   @ApiProperty({ description: '树洞内容', example: '更新后的内容' })
//   @IsString({ message: '树洞内容必须是字符串' })
//   @IsOptional({ message: '树洞内容是可选的' })
//   content?: string;

//   @ApiProperty({ description: '树洞类型', example: 'timeline', enum: TimelineEnum })
//   @IsEnum(TimelineEnum, { message: '树洞类型必须是 timeline 或 treehole' })
//   @IsOptional({ message: '树洞类型是可选的' })
//   type?: TimelineEnum;
// }
// 方法 2：使用 IsOptional 装饰器
// 如果你希望保留 PartialType 自动生成的可选字段，但仍然需要对某些字段进行校验，可以使用 IsOptional 装饰器。IsOptional 装饰器会标记字段为可选，但仍然会应用其他校验规则。
// TypeScript复制
// // update-timeline.dto.ts
// import { PartialType, ApiProperty } from '@nestjs/swagger';
// import { IsEnum, IsString, IsOptional } from 'class-validator';
// import { CreateTimelineDto } from './create-timeline.dto';
// import { TimelineEnum } from './enums/timeline.enum';

// export class UpdateTimelineDto extends PartialType(CreateTimelineDto) {
//   @ApiProperty({ description: '树洞内容', example: '更新后的内容' })
//   @IsString({ message: '树洞内容必须是字符串' })
//   @IsOptional({ message: '树洞内容是可选的' })
//   content?: string;

//   @ApiProperty({ description: '树洞类型', example: 'timeline', enum: TimelineEnum })
//   @IsEnum(TimelineEnum, { message: '树洞类型必须是 timeline 或 treehole' })
//   @IsOptional({ message: '树洞类型是可选的' })
//   type?: TimelineEnum;
// }
// 方法 3：使用 ValidationPipe 的 skipMissingProperties 选项
// 在某些情况下，你可能希望在更新操作中跳过未提供的字段。可以通过 ValidationPipe 的 skipMissingProperties 选项实现这一点。这会确保只有客户端提供的字段才会被校验。
// TypeScript复制
// // main.ts
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       transform: true,
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       skipMissingProperties: true, // 跳过未提供的字段
//     })
//   );

//   await app.listen(3000);
// }

// bootstrap();
// 方法 4：为特定字段禁用校验
// 如果你希望某些字段在更新操作中完全禁用校验，可以在 UpdateTimelineDto 中覆盖这些字段，并使用 @ApiProperty 装饰器标记为可选，但不添加任何校验规则。
// TypeScript复制
// // update-timeline.dto.ts
// import { PartialType, ApiProperty } from '@nestjs/swagger';
// import { CreateTimelineDto } from './create-timeline.dto';

// export class UpdateTimelineDto extends PartialType(CreateTimelineDto) {
//   @ApiProperty({ description: '树洞内容', example: '更新后的内容' })
//   content?: string;

//   @ApiProperty({ description: '树洞类型', example: 'timeline' })
//   type?: string;
// }
// 总结
// 直接覆盖字段并添加校验规则：适用于需要对更新字段进行严格校验的场景。
// 使用 IsOptional 装饰器：适用于保留字段可选性，但仍然需要校验的场景。
// 使用 ValidationPipe 的 skipMissingProperties 选项：适用于跳过未提供的字段，减少校验开销。
// 禁用特定字段的校验：适用于某些字段在更新时不需要校验的场景。
// 通过这些方法，你可以灵活地为 UpdateTimelineDto 中的字段定义校验规则，确保更新操作符合业务需求。
