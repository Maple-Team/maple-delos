import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BlogService } from './blog.service'
import { BlogController } from './blog.controller'
import { Blog, BlogSchema } from './schemas/blog.schema'

@Module({
  providers: [BlogService],
  controllers: [BlogController],
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
})
export class BlogModule {}
