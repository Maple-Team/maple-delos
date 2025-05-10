puppeteer-core 和 puppeteer 的主要区别在于浏览器管理和包大小：

1. 浏览器包含：

- puppeteer：自动下载 Chromium（约 180MB）
- puppeteer-core：不包含 Chromium，需手动指定浏览器路径

2. 依赖项：

- puppeteer：包含所有依赖（包括浏览器）
- puppeteer-core：仅核心功能，体积更小（约 1MB）

3. 适用场景：

- 使用 `puppeteer-core` 的场景：

```bash
# puppeteer.service.ts
# 如您已指定本地 Chrome 路径
executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
```

建议在您的场景中使用 `puppeteer-core`，因为：

1. 已配置了明确的 `executablePath`
2. 使用了 `puppeteer-extra` 插件系统
3. 需要更小的依赖体积

安装命令：

```bash
npm uninstall puppeteer
npm install puppeteer-core puppeteer-extra
```

代码无需修改，因为 `puppeteer-extra` 本身支持与 `puppeteer-core` 配合使用。但要注意确保：

1. 目标机器已安装 Chrome
2. Chrome 版本与 `puppeteer-core` 版本兼容


ghcr.io/puppeteer/puppeteer:24.8.2 镜像主要包含以下核心组件：

1. 预装环境：
- Chromium 浏览器（与 puppeteer 24.8.2 匹配的版本）
- Node.js 运行环境
- 中文语言包和字体（如 Noto Sans CJK）
- 必要的系统依赖库（如 libx11-xcb1, libnss3 等）

2. 容器优化配置：
```ts
// 在 Docker 中建议使用的启动参数
args: [
  '--no-sandbox',          // 容器中必须禁用沙盒
  '--disable-gpu',         // Docker 中通常不需要 GPU 加速
  '--single-process',      // 优化容器资源使用
  '--no-zygote'           // 减少内存占用
]
```