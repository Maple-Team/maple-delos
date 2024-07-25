import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Screenshots } from './entities'

@Injectable()
export class ScreenshotService {
    constructor(@InjectRepository(Screenshots) private repo: Repository<Screenshots>) { }

    create(src: string) {
        return this.repo.save({ src })
    }

    /**
     * 根据多个id获取多条记录
     * @param ids
     * @returns
     */
    findByIDs(ids: number[]) {
        return this.repo.findBy({
            id: In(ids)
        })
    }
}
