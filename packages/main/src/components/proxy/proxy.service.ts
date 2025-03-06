import { Buffer } from 'buffer'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import axios, { AxiosError, AxiosInstance, ResponseType } from 'axios'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { MinioService } from '../minio/minio.service'

@Injectable()
export class ProxyService {
  private axiosInstance: AxiosInstance
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly minioService: MinioService
  ) {
    this.axiosInstance = axios.create({
      timeout: 1000 * 60,
      validateStatus(status) {
        return status < 400
      },
      proxy: {
        protocol: 'http',
        host: process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'host.docker.internal',
        port: 7890,
      },
    })
  }

  async fetchFileByMinioFilePath(filePath: string) {
    return this.minioService.fetchFileByMinioFilePath(filePath)
  }

  async getFetch(req: ExpressRequest, res: ExpressResponse) {
    const { url, method, headers, body, responseType } = await this.preFetch(req)

    const cacheKey = `proxy:${JSON.stringify(req.query)}`
    const cachedFilePath: { filePath: string; contentType: string } | undefined = await this.cacheService.get(cacheKey)
    if (cachedFilePath) {
      // url被缓存，使用缓存数据去oss中获取数据
      const { data, type } = (await this.fetchFileByMinioFilePath(cachedFilePath.filePath)) as {
        data: number[]
        type: string
      }
      if (type === 'Buffer') {
        res.setHeader('Content-Type', cachedFilePath.contentType)
        res.setHeader('Content-Length', data.length.toString())
        // 发送 Buffer 作为响应
        res.status(HttpStatus.OK).send(Buffer.from(data))
      }
      return
    }

    // 调用axios去代理请求数据
    const response = await this.fetch(method, url, {
      data: body,
      headers,
      responseType: responseType.toLowerCase() as ResponseType,
      query: req.query,
    })
    if (response instanceof HttpException) {
      // 错误处理: 分开处理?
      throw response
    }
    const { data, contentType } = response
    res.set('Content-Type', contentType)
    res.send(data)
  }

  async preFetch(req: ExpressRequest) {
    const { query, body, method, headers } = req
    const { responseType = 'json', url } = query as {
      url: string
      responseType?: ResponseType
    }
    if (!url) throw new BadRequestException('url is required')

    return {
      url,
      method,
      headers,
      body,
      responseType,
    }
  }

  postFetch(req: ExpressRequest) {
    // TODO
    console.log(req.body)
    return 'This action returns all proxy'
  }

  async fetch(
    method: string,
    url: string,
    {
      responseType,
      query,
    }: {
      data?: AnyToFix
      headers?: AnyToFix
      responseType?: ResponseType
      query: AnyToFix
    }
  ) {
    return this.axiosInstance
      .request({
        method,
        url,
        // data,
        responseType,
        // headers,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      })
      .then(async (response) => {
        const contentType = response.headers['content-type']

        // this.logger.debug('content-type: %s, responseType: %s', contentType, responseType)
        const responseData = response.data
        let buffer: Buffer | string
        // console.log(
        //   responseData,
        //   responseData instanceof ArrayBuffer, // arraybuffer/false
        //   responseData instanceof Blob, // arraybuffer/false
        //   responseData instanceof Buffer // arraybuffer/true
        // )
        if (responseData instanceof Blob) buffer = Buffer.from(await responseData.arrayBuffer())
        else if (responseData instanceof ArrayBuffer) buffer = Buffer.from(responseData)
        else buffer = responseData

        this.minioService
          .uploadProxy(buffer, contentType)
          .then((filePath) => {
            const cacheKey = `proxy:${JSON.stringify(query)}`
            this.cacheService.set(cacheKey, { filePath, contentType }).catch((e) => this.logger.error(e))
          })
          .catch((e) => this.logger.error(e))

        return { data: responseData, contentType }
      })
      .catch((error: AxiosError) => {
        error.status === 502 && console.error('502可能是代理服务器的问题')
        this.logger.error(error)
        console.error(error.config.url)
        return new HttpException(error.message, error.response.status)
      })
  }
}
