import type { CreateDeviceDto } from './dto/create-device.dto'
import type { DeviceOS, DeviceType } from './types/device'

// Array.from(document.querySelectorAll('tbody tr')).map(tr=>Array.from(tr.children).map(td=>td.innerText))
export const phones = [
  ['iPhone X', 'iOS', '5.8', '458', '19 : 9', '375 x 812', '1125 x 2436', '3.0 xxhdpi'],
  ['iPhone 8+ (8+, 7+, 6S+, 6+)', 'iOS', '5.5', '401', '16 : 9', '414 x 736', '1242 x 2208', '3.0 xxhdpi'],
  ['iPhone 8 (8, 7, 6S, 6)', 'iOS', '4.7', '326', '16 : 9', '375 x 667', '750 x 1334', '2.0 xhdpi'],
  ['iPhone SE（SE, 5S, 5C）', 'iOS', '4.0', '326', '16 : 9', '320 x 568', '640 x 1136', '2.0 xhdpi'],
  ['Android One', 'Android', '4.5', '218', '16 : 9', '320 x 569', '480 x 854', '1.5 hdpi'],
  ['Google Pixel', 'Android', '5.0', '441', '16 : 9', '411 x 731', '1080 x 1920', '2.6 xxhdpi'],
  ['Google Pixel XL', 'Android', '5.5', '534', '16 : 9', '411 x 731', '1440 x 2560', '3.5 xxxhdpi'],
  ['Moto X', 'Android', '4.7', '312', '16 : 9', '360 x 640', '720 x 1280', '2.0 xhdpi'],
  ['Moto X 二代', 'Android', '5.2', '424', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['Nexus 5', 'Android', '5.0', '445', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['Nexus 5X', 'Android', '5.2', '565', '16 : 9', '411 x 731', '1080 x 1920', '2.6 xxhdpi'],
  ['Nexus 6', 'Android', '6.0', '493', '16 : 9', '411 x 731', '1440 x 2560', '3.5 xxxhdpi'],
  ['Nexus 6P', 'Android', '5.7', '518', '16 : 9', '411 x 731', '1440 x 2560', '3.5 xxxhdpi'],
  ['Samsung Galaxy S8', 'Android', '5.8', '570', '18.5 : 9', '360 x 740', '1440 x 2960', '4.0 xxxhdpi'],
  ['Samsung Galaxy S8+', 'Android', '6.2', '529', '18.5 : 9', '360 x 740', '1440 x 2960', '4.0 xxxhdpi'],
  ['Samsung Galaxy Note 4', 'Android', '5.7', '515', '16 : 9', '480 x 853', '1440 x 2560', '3.0 xxhdpi'],
  ['Samsung Galaxy Note 5', 'Android', '5.7', '518', '16 : 9', '480 x 853', '1440 x 2560', '3.0 xxhdpi'],
  ['Samsung Galaxy S5', 'Android', '5.1', '432', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['Samsung Galaxy S7 (S7, S6, S6 Edge)', 'Android', '5.1', '576', '16 : 9', '360 x 640', '1440 x 2560', '4.0 xxxhdpi'],
  ['Samsung Galaxy S7 Edge', 'Android', '5.5', '534', '16 : 9', '360 x 640', '1440 x 2560', '4.0 xxxhdpi'],
  ['Smartisan T2', 'Android', '4.95', '445', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['Smartisan M1', 'Android', '5.15', '428', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['Smartisan M1L', 'Android', '5.7', '515', '16 : 9', '480 x 853', '1440 x 2560', '3.0 xxhdpi'],
  ['坚果 Pro', 'Android', '5.5', '403', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['OnePlus 5', 'Android', '5.5', '401', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['OnePlus 3T', 'Android', '5.5', '401', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['Oppo R9s (R9s, R11)', 'Android', '5.5', '401', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['Oppo R9s Plus (R9s Plus, R11 Plus)', 'Android', '6.0', '368', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['Oppo A57', 'Android', '5.2', '282', '16 : 9', '360 x 640', '720 x 1280', '2.0 xhdpi'],
  ['Oppo A59s', 'Android', '5.5', '267', '16 : 9', '360 x 640', '720 x 1280', '2.0 xhdpi'],
  ['Oppo A37', 'Android', '5.0', '293', '16 : 9', '360 x 640', '720 x 1280', '2.0 xhdpi'],
  ['小米MIX2', 'Android', '5.99', '403', '18 : 9', '360 x 720', '1080 x 2160', '3.0 xxhdpi'],
  ['小米MIX', 'Android', '6.4', '362', '17 : 9', '360 x 680', '1080 x 2040', '3.0 xxhdpi'],
  ['小米Note 3', 'Android', '5.5', '403', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['小米Note 2', 'Android', '5.7', '386', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['小米6', 'Android', '5.15', '428', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['小米5s', 'Android', '5.15', '428', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['小米5s Plus', 'Android', '5.7', '386', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['小米Max', 'Android', '6.44', '342', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['红米Note 4 (4, Note 4X)', 'Android', '5.5', '403', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['红米 4 (4, 4X)', 'Android', '5.0', '296', '16 : 9', '360 x 640', '720 x 1280', '2.0 xhdpi'],
  ['Vivo X9 (X9, X9s)', 'Android', '5.5', '401', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['Vivo X9 Plus (X9 Plus, X9s Plus)', 'Android', '5.88', '375', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['HUAWEI P10', 'Android', '5.1', '432', '16 : 9', '360 x 640', '1080 x 1920', '3.0 xxhdpi'],
  ['HUAWEI P10 Plus', 'Android', '5.5', '540', '16 : 9', '360 x 640', '1440 x 2560', '4.0 xxxhdpi'],
]

export const tablets = [
  ['iPad mini 4 (mini 4, mini 2)', 'iOS', '7.9', '326', '4 : 3', '768 x 1024', '1536 x 2048', '2.0 xhdpi'],
  ['iPad Air 2 (Air 2, Air)', 'iOS', '9.7', '264', '4 : 3', '768 x 1024', '1536 x 2048', '2.0 xhdpi'],
  ['iPad Pro 9.7', 'iOS', '9.7', '264', '4 : 3', '768 x 1024', '1536 x 2048', '2.0 xhdpi'],
  ['iPad Pro 10.5', 'iOS', '10.5', '264', '4 : 3', '834 x 1112', '1668 x 2224', '2.0 xhdpi'],
  ['iPad Pro 12.9', 'iOS', '12.9', '264', '4 : 3', '1024 x 1336', '2048 x 2732', '2.0 xhdpi'],
  ['Google Pixel C', 'Android', '10.2', '308', '4 : 3', '900 x 1280', '1800 x 2560', '2.0 xhdpi'],
  ['Nexus 9', 'Android', '8.9', '288', '4 : 3', '768 x 1024', '1536 x 2048', '2.0 xhdpi'],
  ['Surface 3', 'Windows', '10.8', '214', '16 : 9', '720 x 1080', '1080 x 1920', '1.5 hdpi'],
  ['小米平板 2', 'Android', '7.9', '326', '16 : 9', '768 x 1024', '1536 x 2048', '2.0 xhdpi'],
]
export const watches = [
  ['Apple Watch 38mm', 'watch OS', '1.5', '326', '5 : 4', '136 x 170', '272 x 340', '2.0 xhdpi'],
  ['Apple Watch 42mm', 'watch OS', '1.7', '326', '5 : 4', '156 x 195', '312 x 390', '2.0 xhdpi'],
  ['Moto 360', 'Android', '1.6', '205', '32 : 29', '241 x 218', '320 x 290', '1.3 tvdpi'],
  ['Moto 360 v2 42mm', 'Android', '1.4', '263', '65 : 64', '241 x 244', '320 x 325', '1.3 tvdpi'],
  ['Moto 360 v2 46mm', 'Android', '1.6', '263', '33 : 32', '241 x 248', '320 x 330', '1.3 tvdpi'],
]
export const computers = [
  ['MacBook', 'OS X', '12.0', '226', '16 : 10', '1280 x 800', '2304 x 1440', '2.0 xhdpi'],
  ['MacBook Air 11', 'OS X', '11.6', '135', '16 : 9', '1366 x 768', '1366 x 768', '1.0 mdpi'],
  ['MacBook Air 13', 'OS X', '13.3', '128', '16 : 10', '1440 x 900', '1440 x 900', '1.0 mdpi'],
  ['MacBook Pro 13', 'OS X', '13.3', '227', '16 : 10', '1280 x 800', '2560 x 1600', '2.0 xhdpi'],
  ['MacBook Pro 15', 'OS X', '15.4', '220', '16 : 10', '1440 x 900', '2880 x 1800', '2.0 xhdpi'],
  ['iMac 21.5', 'OS X', '21.5', '102', '16 : 9', '1920 x 1080', '1920 x 1080', '1.0 mdpi'],
  ['iMac 21.5 4K', 'OS X', '21.5', '218', '16 : 9', '1920 x 1080', '4096 x 2304', '2.0 xhdpi'],
  ['iMac 27', 'OS X', '27', '109', '16 : 9', '2560 x 1440', '2560 x 1440', '1.0 mdpi'],
  ['iMac 27 5K', 'OS X', '27', '218', '16 : 9', '2560 x 1440', '5120 x 2880', '2.0 xhdpi'],
  ['Surface Book', 'Windows', '13.5', '267', '3 : 2', '1500 x 1000', '3000 x 2000', '2.0 xhdpi'],
  ['Surface Pro', 'Windows', '12.3', '267', '3 : 2', '1368 x 912', '2736 x 1824', '2.0 xhdpi'],
  ['Surface Laptop', 'Windows', '13.5', '201', '3 : 2', '1128 x 752', '2256 x 1504', '2.0 xhdpi'],
  ['Surface Studio', 'Windows', '28', '192', '3 : 2', '2250 x 1500', '4500 x 3000', '2.0 xhdpi'],
  ['Dell XPS 13', 'Windows', '13.3', '276', '16 : 9', '1920 x 1080', '3200 x 1800', '1.5 hdpi'],
  ['Dell XPS 15', 'Windows', '15.6', '280', '16 : 9', '1920 x 1080', '3840 x 2160', '2.0 xhdpi'],
  ['小米笔记本Air 12.5', 'Windows', '12.5', '176', '16 : 9', '1920 x 1080', '1920 x 1080', '1.0 mdpi'],
  ['小米笔记本Air 13.3', 'Windows', '13.3', '166', '16 : 9', '1920 x 1080', '1920 x 1080', '1.0 mdpi'],
  ['小米笔记本Pro 15.6', 'Windows', '15.6', '166', '16 : 9', '1920 x 1080', '1920 x 1080', '1.0 mdpi'],
]

export const monitors = [
  ['Apple Thunderbolt Display', '-', '27', '109', '16 : 9', '2560 x 1440', '2560 x 1440', '1.0 mdpi'],
  ['Dell UltraSharp HD 5K', '-', '27', '218', '16 : 9', '2560 x 1440', '5120 x 2880', '2.0 xhdpi'],
  ['Dell UltraSharp U2515H', '-', '25', '123', '16 : 9', '1280 x 720', '2560 x 1440', '2.0 xhdpi'],
  ['Dell UltraSharp U2417H', '-', '23.8', '92', '16 : 9', '1920 x 1080', '1920 x 1080', '1.0 mdpi'],
  ['Dell UltraSharp U2717D', '-', '27', '114', '16 : 9', '2560 x 1440', '2560 x 1440', '1.0 mdpi'],
  ['Dell UltraSharp U3415W', '-', '34', '110', '21 : 9', '3440 x 1440', '3440 x 1440', '1.0 mdpi'],
  ['LG 34UC98-W', '-', '34', '110', '21 : 9', '3440 x 1440', '3440 x 1440', '1.0 mdpi'],
  ['LG UltraFine 4K', '-', '21.5', '218', '16 : 9', '1920 x 1080', '4096 x 2304', '2.0 xhdpi'],
  ['LG UltraFine 5K', '-', '27', '218', '16 : 9', '2560 x 1440', '5120 x 2880', '2.0 xhdpi'],
]

export const transform = (data: string[][], type: DeviceType): CreateDeviceDto[] => {
  const results: CreateDeviceDto[] = data.map(([name, os, size, ppi, ratio, dp, px, dpi]) => {
    const [wdp, _, hdp] = dp.split(' ')
    const [wpx, __, hpx] = px.split(' ')
    return {
      name,
      os: os as DeviceOS,
      size: +size,
      PPI: +ppi,
      dpi: +dpi.split(' ')[0],
      ratio: ratio.replace(/\s/g, ''),
      type,
      wdp: +wdp,
      hdp: +hdp,
      wpx: +wpx,
      hpx: +hpx,
    }
  })
  return results
}
