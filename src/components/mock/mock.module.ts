import { Module } from '@nestjs/common'
import { MockController } from './mock.controller'

@Module({
  imports: [],
  providers: [],
  controllers: [MockController],
})
export class MockModule {}
