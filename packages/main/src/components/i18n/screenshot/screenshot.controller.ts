import { Public } from '@/auth/decorators';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';
import { MinioService } from '@/components/minio/minio.service';
import { Observable, switchMap } from 'rxjs';

@Controller('screenshot')
export class ScreenshotController {
    constructor(private readonly service: ScreenshotService,
        private readonly minioService: MinioService
    ) { }

    @Public()
    @Post('/upload-locale-image')
    uploadLocaleImage(@Body() body: { data: string }) {
        if (!body.data) throw new BadRequestException('data is null')
        const observableSrc: Observable<string> = this.minioService.uploadLocaleImage(body.data)
        return observableSrc.pipe(switchMap(s => {
            return this.service.create(s)
        }))
    }
}
