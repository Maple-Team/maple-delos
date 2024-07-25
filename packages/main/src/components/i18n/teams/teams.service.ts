import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTeamDto } from './dto/create-team.dto'
import { UpdateTeamDto } from './dto/update-team.dto'
import { Team } from './entities/team.entity'

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private repo: Repository<Team>
  ) {}

  create(_createTeamDto: CreateTeamDto) {
    return 'This action adds a new team'
  }

  findAll() {
    return 'This action returns all teams'
  }

  findOne(id: number) {
    return `This action returns a #${id} team`
  }

  update(id: number, _updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`
  }

  remove(id: number) {
    return `This action removes a #${id} team`
  }
}
