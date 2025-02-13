import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type { BaseList } from '@liutsing/types-utils'
import dayjs from 'dayjs'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import type { AnyBulkWriteOperation } from 'mongodb'
import type { VideoDocument } from './schemas/video.schema'
import { Video } from './schemas/video.schema'
import { Actress } from './schemas/actress.schema'
import type { ActressDocument } from './schemas/actress.schema'

interface RestParams {
  code?: Video['code']
  actress?: string
  actresses?: string
}
@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private model: Model<VideoDocument>,
    @InjectModel(Actress.name) private actressModel: Model<ActressDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.model.schema.post('save', (res, next) => {
      // FIXME hook
      const { thumb, previews, cover } = res
      this.logger.debug('post save: %o', { thumb, previews, cover })
      next()
    })
  }

  async findWithPagination(page: number, pageSize: number, rest: RestParams): Promise<BaseList<Video>> {
    const filterKeys: RestParams = {}
    if (rest.code) filterKeys.code = rest.code
    if (rest.actress) filterKeys.actresses = rest.actress

    const condition = {
      ...filterKeys,
      hasDetail: true,
    }

    const total = await this.model.countDocuments(condition).exec()

    const query = this.model.find(condition)
    // @https://github.com/scalablescripts/nest-search-mongo
    // https://article.arunangshudas.com/top-10-advanced-pagination-techniques-with-mongoose-2320a6ac49a7
    const data = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec()

    return {
      pagination: {
        total,
        current: +page,
        pageSize,
      },
      records: data,
    }
  }

  containsJapanese(text?: string): boolean {
    // 正则表达式匹配日文字符
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\uFF66-\uFF9D\u31F0-\u31FF]/
    return japaneseRegex.test(text)
  }

  /**
   * 添加或更新详细数据
   * @param data - 要添加或更新的视频数据
   * @returns 返回更新后的视频数据
   */
  async add(data: Partial<Video>) {
    const { title, releaseDate, ...rest } = data

    const titleObj = this.containsJapanese(title)
      ? {
          title,
        }
      : {
          enTitle: title,
        }
    const dateObj = releaseDate
      ? {
          releaseDate: dayjs(releaseDate).toDate(),
        }
      : {}
    const res = await this.model
      .findOneAndUpdate(
        { code: data.code }, // 查询条件，根据视频代码查找视频
        [
          {
            $set: {
              ...rest,
              ...titleObj,
              ...dateObj,
              hasDetail: true,
            },
          },
        ],
        {
          upsert: true, // 如果找不到匹配的文档，则插入新文档
          new: true, // 返回更新后的文档
        }
      )
      .exec()
    if (res) return res
    this.logger.debug('findOneAndUpdate res: %o', res)
    // 如果没有找到匹配的文档，则创建新文档并保存
    return (
      await this.model.create({
        ...data,
        releaseDate: dayjs(data.releaseDate).toDate(), // 将 releaseDate 转换为 Date 类型
        hasDetail: true,
      })
    ).save()
  }

  async findAll() {
    // 移除主键_id
    return this.model
      .find({
        hasVideo: true,
      })
      .select('code hasDetail hasVideo')
      .exec()
  }

  /**
   * 批量添加基础数据
   *
   export declare interface UpdateOneModel<TSchema extends Document = Document> {
        The filter to limit the updated documents. filter 是一个 Filter 类型的属性，用于指定更新操作的筛选条件。只有满足这些条件的文档才会被更新。
       filter: Filter<TSchema>;
       A document or pipeline containing update operators. update 是一个 UpdateFilter 类型的属性，它可以是一个包含更新操作符的文档，或者是一个包含多个更新操作符的数组。这些操作符定义了如何更新文档。
       update: UpdateFilter<TSchema> | UpdateFilter<TSchema>[];
         A set of filters specifying to which array elements an update should apply.   arrayFilters 是一个可选属性，它是一个包含筛选条件的数组。这些条件用于指定数组字段中哪些元素应该被更新。
       arrayFilters?: Document[];
        Specifies a collation.  collation 是一个可选属性，用于指定排序规则。排序规则定义了字符串比较的方式，例如大小写敏感或不敏感。
       collation?: CollationOptions; collation 的常见翻译为“排序规则”或“校对规则”。它用于指定字符串比较和排序的规则，例如大小写敏感性、重音符号处理等。在数据库中，collation 通常用于定义文本字段的排序和比较行为。
        The index to use. If specified, then the query system will only consider plans using the hinted index. hint 是一个可选属性，用于指定查询优化器应该使用的索引。如果指定了索引，查询系统将只考虑使用该索引的查询计划。
       hint?: Hint;
         When true, creates a new document if no document matches the query.  upsert 是一个可选属性，当设置为 true 时，如果没有文档匹配查询条件，将插入一个新文档。
       upsert?: boolean;
   }
   * @param data
   * @returns
   */
  async batchAdd(data: Partial<Video[]>): Promise<AnyToFix> {
    const bulkData = data.map((item) => {
      const { title, ...rest } = item
      const titleObj = this.containsJapanese(title)
        ? {
            title,
          }
        : {
            enTitle: title,
          }

      const config: AnyBulkWriteOperation<Video> = {
        // 这个操作只会更新匹配到的第一个文档。如果查询条件匹配到多个文档，只有第一个文档会被更新
        updateOne: {
          // updateMany：这个操作会更新所有匹配到的文档。如果查询条件匹配到多个文档，所有这些文档都会被更新
          filter: { code: item.code },
          update: {
            $set: {
              ...rest,
              ...titleObj,
            },
            $setOnInsert: {
              hasDetail: false,
            },
          },
          upsert: true,
        },
      }
      return config
    })
    return this.model.bulkWrite(bulkData)
  }

  /**
   * 根据视频代码查找视频
   * @param code - 视频代码
   * @returns 返回一个包含视频信息的Promise对象
   */
  findByCode(code: string) {
    // 使用Mongoose的findOne方法在数据库中查找具有指定代码的视频
    return (
      this.model
        .findOne({
          // 指定查找条件为视频代码
          code,
        })
        // 执行查询并返回结果
        .exec()
    )
  }

  async getAllActresses(page: number, pageSize: number) {
    const condition = {}
    const total = await this.actressModel.find(condition).count()

    const query = this.actressModel.find(condition)

    const data = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .exec()

    return {
      pagination: {
        total,
        current: +page,
        pageSize,
      },
      records: data,
    }
  }

  async getAllDistinctActresses() {
    const data = await this.model
      .distinct('actresses', {
        hasVideo: true,
      })
      .exec()
    return data
  }

  batchAddActress(data: Actress[]): Promise<AnyToFix> {
    return this.model.bulkWrite(
      data.map((item) => {
        const config: AnyBulkWriteOperation<Actress> = {
          // 这个操作只会更新匹配到的第一个文档。如果查询条件匹配到多个文档，只有第一个文档会被更新
          updateOne: {
            // updateMany：这个操作会更新所有匹配到的文档。如果查询条件匹配到多个文档，所有这些文档都会被更新
            filter: { name: item.name },
            update: {
              $set: {
                ...item,
              },
            },
            upsert: true,
          },
        }
        return config
      })
    )
  }
}
