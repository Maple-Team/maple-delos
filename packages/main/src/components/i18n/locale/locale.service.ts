import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Like, Repository } from 'typeorm'
import { BaseList, BaseParams } from '@liutsing/types-utils'
import { ProjectsService } from '../projects/projects.service'
import { ScreenshotService } from '../screenshot/screenshot.service'
import { CreateLocaleDto, UpdateLocaleWithScreenShotsDto } from './dto/create-locale.dto'
import { UpdateLocaleDto } from './dto/update-locale.dto'
import { Locale } from './entities/locale.entity'

@Injectable()
export class LocaleService {
  constructor(
    @InjectRepository(Locale)
    private repo: Repository<Locale>,
    private projectService: ProjectsService,
    private screenShotService: ScreenshotService
  ) {}

  //   async create(createDto: CreateDirectiveSetDto) {
  //     const { name, opacity, isCycle } = createDto
  //     const exhibitsDto = await this.exhibitRepo.findOne({ where: { id: createDto.exhibits } })
  //     const directiveSet = this.repo.create({
  //       name: name,
  //       exhibits: exhibitsDto,
  //       opacity: opacity,
  //       isCycle: isCycle,
  //     })
  //     return this.repo.save(directiveSet)
  //   }

  create(_createLocaleDto: CreateLocaleDto) {
    return 'This action adds a new locale'
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    })
  }

  update(id: number, _updateLocaleDto: UpdateLocaleDto) {
    return `This action updates a #${id} locale`
  }

  async remove(id: number) {
    const locale = await this.findOne(id)
    if (locale) return this.repo.softRemove(locale)
  }

  /**
   * 批量插入
   * @param createLocaleDtos
   * @returns
   */
  batchCreate(createLocaleDtos: CreateLocaleDto[]) {
    return this.repo.save(createLocaleDtos)
  }

  /**
   * 分页查询
   * @param param0
   * @returns
   */
  async findMany({ pageSize, current, ...rest }: BaseParams<Locale>): Promise<BaseList<Locale>> {
    const condition: FindOptionsWhere<Locale> = {}
    const keys = Object.keys(rest).filter((k) => !!rest[k])
    for (const k of keys) condition[k] = Like(`%${rest[k]}%`)

    // 模糊查找 非空处理
    const [total, records] = await Promise.all([
      this.repo.count({
        where: condition,
      }),
      this.repo.find({
        where: condition,
        skip: (current - 1) * pageSize,
        take: pageSize,
        relations: ['screenshots'],
      }),
    ])

    return {
      pagination: {
        total,
        current,
        pageSize,
      },
      records,
    }
  }

  /**
   * 批量更新所属项目/截图
   * @param dtos
   */
  async batchCreateWithScreenShots(dtos: UpdateLocaleWithScreenShotsDto[]) {
    for await (const dto of dtos) {
      const { id, project: projectName, screenShotIDs } = dto
      const project = await this.projectService.findByName(projectName)
      if (!project) throw new BadRequestException(`[projectName]: ${[projectName]} not exist`)
      const record = await this.findOne(id)
      const projects = record.projects
      projects.push(project)
      const shots = await this.screenShotService.findByIDs(screenShotIDs)
      this.repo
        .update(id, {
          projects,
          screenshots: shots,
        })
        .catch(console.error)
    }
  }
}
