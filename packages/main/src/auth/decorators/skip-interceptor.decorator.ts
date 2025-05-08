import { NestInterceptor, SetMetadata } from '@nestjs/common'

export const SKIP_INTERCEPTOR_KEY = 'skipInterceptor'
export const SkipInterceptor = (...interceptors: NestInterceptor[]) => SetMetadata(SKIP_INTERCEPTOR_KEY, interceptors)
// TODO Interceptor注解
