```sh

ProtocolError: Network.enable timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.


at <instance_members_initializer> (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:101:14)


at new Callback (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:105:16)


at CallbackRegistry.create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:23:26)


at Connection._rawSend (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Connection.js:99:26)


at CdpCDPSession.send (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/CdpSession.js:73:33)


at NetworkManager.addClient (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/NetworkManager.js:62:20)


at FrameManager.initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/FrameManager.js:174:38)


at #initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Page.js:291:36)


at CdpPage._create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Page.js:103:31)


at /app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Target.js:205:42
```

```sh

ProtocolError: Network.enable timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.


at <instance_members_initializer> (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:101:14)


at new Callback (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:105:16)


at CallbackRegistry.create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:23:26)


at Connection._rawSend (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Connection.js:99:26)


at CdpCDPSession.send (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/CdpSession.js:73:33)


at NetworkManager.addClient (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/NetworkManager.js:62:20)


at FrameManager.initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/FrameManager.js:174:38)


at #initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Page.js:291:36)


at CdpPage._create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Page.js:103:31)


at /app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Target.js:205:42


ProtocolError: Network.enable timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.


at <instance_members_initializer> (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:101:14)


at new Callback (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:105:16)


at CallbackRegistry.create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:23:26)


at Connection._rawSend (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Connection.js:99:26)


at CdpCDPSession.send (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/CdpSession.js:73:33)
```

```sh
Error: CRAWL_FAILED: https://tieba.baidu.com/p/9230870326⁠ Navigation timeout of 60000 ms exceeded


at /app/dist/app.service.js:115:57


at Observable.init [as _subscribe] (/app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/observable/throwError.js:8:64)


at Observable._trySubscribe (/app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/Observable.js:41:25)


at /app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/Observable.js:35:31


at Object.errorContext (/app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/util/errorContext.js:22:9)


at Observable.subscribe (/app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/Observable.js:26:24)


at /app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/operators/catchError.js:17:31


at OperatorSubscriber._this._error (/app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/operators/OperatorSubscriber.js:43:21)


at Subscriber.error (/app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/Subscriber.js:60:18)


at /app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/operators/retry.js:60:36
```

```sh

请求失败: https://tieba.baidu.com/p/9230870326⁠ TimeoutError: Navigation timeout of 60000 ms exceeded


at new Deferred (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/util/Deferred.js:60:34)


at Deferred.create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/util/Deferred.js:21:16)


at new LifecycleWatcher (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/LifecycleWatcher.js:69:60)


at CdpFrame.goto (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Frame.js:148:29)


at CdpFrame.<anonymous> (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/util/decorators.js:109:27)


at CdpPage.goto (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/api/Page.js:574:43)


at AppService.crawlUrl (/app/dist/app.service.js:160:20)


at /app/dist/app.service.js:110:161


at doInnerSub (/app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/operators/mergeInternals.js:22:31)


at outerNext (/app/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/internal/operators/mergeInternals.js:17:70)
```

```sh
ProtocolError: Network.enable timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.

    at <instance_members_initializer> (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:101:14)

    at new Callback (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:105:16)

    at CallbackRegistry.create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:23:26)

    at Connection._rawSend (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Connection.js:99:26)

    at CdpCDPSession.send (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/CdpSession.js:73:33)

    at NetworkManager.addClient (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/NetworkManager.js:62:20)

    at FrameManager.initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/FrameManager.js:174:38)

    at #initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Page.js:291:36)
```

```
ProtocolError: Network.enable timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.

    at <instance_members_initializer> (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:101:14)

    at new Callback (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:105:16)

    at CallbackRegistry.create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:23:26)

    at Connection._rawSend (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Connection.js:99:26)

    at CdpCDPSession.send (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/CdpSession.js:73:33)

    at NetworkManager.addClient (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/NetworkManager.js:62:20)

    at FrameManager.initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/FrameManager.js:174:38)

    at #initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Page.js:291:36)

    at CdpPage._create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Page.js:103:31)

    at /app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Target.js:205:42

[2025-05-12 11:21:46 473] 页面创建失败: https://tieba.baidu.com/p/https://tieba.baidu.com/p/9077578463⁠ ProtocolError: Network.enable timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.

    at <instance_members_initializer> (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:101:14)

    at new Callback (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:105:16)

    at CallbackRegistry.create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/common/CallbackRegistry.js:23:26)

    at Connection._rawSend (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Connection.js:99:26)

    at CdpCDPSession.send (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/CdpSession.js:73:33)

    at NetworkManager.addClient (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/NetworkManager.js:62:20)

    at FrameManager.initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/FrameManager.js:174:38)

    at #initialize (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Page.js:291:36)

    at CdpPage._create (/app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Page.js:103:31)

    at /app/node_modules/.pnpm/puppeteer-core@24.8.2/node_modules/puppeteer-core/lib/cjs/puppeteer/cdp/Target.js:205:4
```
