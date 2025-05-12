## 总结下 puppeteer 启动时的所有 args 参数

以下是 Puppeteer 启动 Chromium 时常用 `args` 参数的全面总结，按功能分类整理：

---

**核心性能优化**
| 参数 | 作用 | 适用场景 |
|------------------------------|----------------------------------------------------------------------|-------------------------|
| `--disable-dev-shm-usage` | 禁止使用 `/dev/shm`，改用内存存储临时数据（避免 Docker 内存溢出） | 容器环境必加 |
| `--single-process` | 单进程模式（降低内存但牺牲稳定性） | 内存敏感场景（⚠️ 慎用） |
| `--no-zygote` | 禁止派生进程（减少进程数） | 配合 `--single-process` |
| `--disable-gpu` | 禁用 GPU 硬件加速 | 无 GPU 环境（服务器/容器） |
| `--disable-software-rasterizer` | 禁用软件渲染后端（节省 CPU 和内存） | 无复杂渲染需求的场景 |
| `--memory-pressure-off` | 禁用内存压力处理机制（可能提升性能但增加 OOM 风险） | 短期任务 |

---

**安全与沙箱**
| 参数 | 作用 | 注意事项 |
|------------------------------|----------------------------------------------------------------------|-------------------------|
| `--no-sandbox` | 禁用沙箱（解决容器权限问题） | 仅限可信环境（⚠️ 安全风险） |
| `--disable-setuid-sandbox` | 禁用 SetUID 沙箱（旧版系统兼容） | 配合 `--no-sandbox` |
| `--disable-web-security` | 关闭同源策略（允许跨域请求） | 测试环境专用（⚠️ 高危） |
| `--allow-running-insecure-content` | 允许加载混合 HTTP/HTTPS 内容 | 测试环境专用 |

---

**资源限制**
| 参数 | 作用 | 示例值 |
|------------------------------|----------------------------------------------------------------------|-------------------------|
| `--js-flags="--max-old-space-size=512"` | 限制 V8 引擎内存（单位 MB） | `--max-old-space-size=512` |
| `--disk-cache-size=52428800` | 限制磁盘缓存大小（单位字节） | `52428800`（50MB） |
| `--disable-background-timer-throttling` | 禁止后台标签页节流（提升后台任务性能） | 定时任务场景 |

---

**渲染与网络**
| 参数 | 作用 | 场景 |
|------------------------------|----------------------------------------------------------------------|-------------------------|
| `--headless=new` | 使用新版 Headless 模式（更高效） | Puppeteer 19+ 版本 |
| `--proxy-server=http://host:port` | 设置代理服务器 | 需要代理访问的场景 |
| `--ignore-certificate-errors` | 忽略 HTTPS 证书错误 | 测试自签名证书站点 |
| `--disable-images` | 禁止加载图片 | 爬虫/性能敏感场景 |
| `--blink-settings=imagesEnabled=false` | 禁用图片渲染（更彻底） | 同上 |

---

**调试与日志**
| 参数 | 作用 | 使用场景 |
|------------------------------|----------------------------------------------------------------------|-------------------------|
| `--remote-debugging-port=9222` | 开启远程调试端口（通过 `http://localhost:9222` 访问） | 调试浏览器行为 |
| `--enable-logging` | 输出 Chromium 日志到控制台 | 排查启动问题 |
| `--v=1` | 设置日志详细级别（范围 `0`-`3`） | 详细日志调试 |
| `--user-data-dir=/path` | 指定用户数据目录（保留 Cookies、缓存等） | 需要持久化会话的场景 |

---

**窗口与显示**
| 参数 | 作用 | 场景 |
|------------------------------|----------------------------------------------------------------------|-------------------------|
| `--window-size=1920,1080` | 设置浏览器窗口大小 | 截图需要固定尺寸时 |
| `--start-maximized` | 启动时最大化窗口 | 需要全屏渲染时 |
| `--kiosk` | 启用信息亭模式（全屏且无法退出） | 演示环境 |
| `--disable-infobars` | 隐藏 "Chrome 正在受自动化软件控制" 提示栏 | 提升截图美观度 |

---

**功能开关**
| 参数 | 作用 | 场景 |
|------------------------------|----------------------------------------------------------------------|-------------------------|
| `--disable-extensions` | 禁用所有扩展 | 避免插件干扰 |
| `--disable-popup-blocking` | 允许弹出窗口 | 需要测试弹窗的场景 |
| `--disable-notifications` | 禁用通知权限 | 避免弹窗干扰 |
| `--autoplay-policy=no-user-gesture-required` | 允许自动播放媒体（无需用户手势） | 视频/音频自动化测试 |

---

**完整示例配置**

```javascript
const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    // 基础安全
    '--no-sandbox',
    '--disable-setuid-sandbox',

    // 容器优化
    '--disable-dev-shm-usage',
    '--disable-gpu',

    // 性能调优
    '--no-zygote',
    '--disable-software-rasterizer',
    '--js-flags="--max-old-space-size=512"',

    // 网络控制
    '--disable-images',
    '--blink-settings=imagesEnabled=false',

    // 窗口设置
    '--window-size=1920,1080',
    '--disable-infobars',
  ],
})
```

---

**参数选择建议**

1. 容器环境必加：
   ```bash
   --no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage
   ```
2. 低内存场景：
   ```bash
   --single-process --no-zygote --js-flags="--max-old-space-size=256"
   ```
3. 爬虫/无头模式：
   ```bash
   --disable-images --blink-settings=imagesEnabled=false --disable-notifications
   ```
4. 调试模式：
   ```bash
   --remote-debugging-port=9222 --enable-logging --v=1
   ```

通过合理组合这些参数，可在性能、稳定性、功能之间取得最佳平衡。建议优先使用官方镜像（如 `ghcr.io/puppeteer/puppeteer`），其默认参数已针对容器优化。

### Reading List

- [List of Chromium Command Line Switches](https://peter.sh/experiments/chromium-command-line-switches/)
- [devtools-protocol](https://chromedevtools.github.io/devtools-protocol/)
