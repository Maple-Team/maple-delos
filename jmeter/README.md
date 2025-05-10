# jmeter

## 压测 http

```bash
# 启动压测（组合现有docker网络）
docker-compose -f docker-compose.yml -f jmeter/docker-compose.jmeter.yml up -d jmeter

# 执行测试计划（进入容器执行）
docker exec jmeter-master jmeter -n -t /test/delos-test.jmx -l /results/results.jtl -e -o /results/report
```

## 压测 websocket

```bash
# 安装插件
docker exec jmeter-master sh -c "wget https://repo1.maven.org/maven2/net/lyucee/jmeter-websocket/1.8.0/jmeter-websocket-1.8.0.jar -P /opt/apache-jmeter/lib/ext/"
```
