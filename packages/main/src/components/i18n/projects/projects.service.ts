import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { Project } from './entities/project.entity'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private repo: Repository<Project>
  ) {}

  create(_createProjectDto: CreateProjectDto) {
    return 'This action adds a new project'
  }

  findAll() {
    return 'This action returns all projects'
  }

  findOne(id: number) {
    return `This action returns a #${id} project`
  }

  update(id: number, _updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`
  }

  remove(id: number) {
    return `This action removes a #${id} project`
  }

  findByName(name: string) {
    return this.repo.findOne({
      where: {
        name,
      },
    })
  }
}
