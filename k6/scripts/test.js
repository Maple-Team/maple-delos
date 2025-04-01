import http from 'k6/http'
import { check, sleep } from 'k6'
// import { Rate } from 'k6/metrics'

// 定义自定义 QPS 指标
// const qpsMetric = new Rate('qps')

/**
 * @type {import('k6/options').Options}
 */
export const options = {
  vus: 100, // 并发用户数
  duration: '2m', // 测试持续时间
}

export default function () {
  const res = http.get('http://maple-gateway:3000/api/sonyoonjoo')
  check(res, { 'status was 200': (r) => r.status === 200 })
  //   qpsMetric.add(1) // 每次请求计数 +1

  sleep(0.1)
}
/**
 * 1. 这个压测qps应该需要限制容器的cpu和内存的吧，比如我需要达到500qps，在什么样的cpu/内存的容器下
 * 2. 压测接入普罗米修斯，然后grafana可视化
 */
