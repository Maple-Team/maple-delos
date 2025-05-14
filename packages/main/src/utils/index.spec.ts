import { normalizeName } from './index'

describe('formatName', () => {
  it('处理空字符串', () => {
    expect(normalizeName('')).toBe('')
  })

  it('替换中文括号和空格', () => {
    expect(normalizeName('测试（案例）')).toBe('测试_案例')
  })

  it('移除双引号和&符号', () => {
    expect(normalizeName('"hello&world"')).toBe('helloworld')
  })

  it('删除特定标记字符串', () => {
    expect(normalizeName('▼SonYoonJoo▲content')).toBe('content')
  })

  it.concurrent.each([
    [
      '4341316050 filename ▼SonYounJu▲160206图片_SC更新_米白色摩卡情调紧身居家胸衣',
      '4341316050 filename 160206图片_SC更新_米白色摩卡情调紧身居家胸衣',
    ],
    [
      '9705261802 filename 250511_TN更新_(柠檬萃彩鹅黄俏皮娇美夏季裙)',
      '9705261802 filename 250511_TN更新_柠檬萃彩鹅黄俏皮娇美夏季裙',
    ],
  ])('处理复杂字符串', (input, expected) => {
    expect(normalizeName(input)).toBe(expected)
  })
})
