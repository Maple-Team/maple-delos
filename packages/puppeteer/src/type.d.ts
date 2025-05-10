interface ScreenshotTask {
  id: string
  url: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: string // Base64 图片数据
  error?: string
}
interface Task {
  url: string
  objectName: string
  galleryName: string
  personName: string
}
