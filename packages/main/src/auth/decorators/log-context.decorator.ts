// 修改为类装饰器
export const WithContext = (context: string) => {
  return function <T extends new (...args: AnyToFix[]) => AnyToFix>(target: T) {
    return class extends target {
      constructor(...args: AnyToFix[]) {
        super(...args)
        if (this.logger) this.logger.defaultMeta = { ...this.logger.defaultMeta, context }
      }
    }
  }
}
