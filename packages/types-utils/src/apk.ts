/**
 *
 * apk文件解析出的结果
 *
 */
export interface ApkParserResult {
  /**
   * 应用版本号
   */
  versionCode: number
  /**
   * 应用版本名
   */
  versionName: string
  compileSdkVersion: number
  compileSdkVersionCodename: string
  /**
   * 应用包名
   */
  package: string
  platformBuildVersionCode: number
  platformBuildVersionName: number
  usesPermissions: UsesPermission[]
  usesPermissionsSDK23: AnyToFix[]
  permissions: AnyToFix[]
  permissionTrees: AnyToFix[]
  permissionGroups: AnyToFix[]
  instrumentation: AnyToFix
  /**
   * sdk版本
   */
  usesSdk: UsesSdk
  usesConfiguration: AnyToFix
  usesFeatures: AnyToFix[]
  supportsScreens: AnyToFix
  compatibleScreens: AnyToFix[]
  supportsGlTextures: AnyToFix[]
  application: Application
  /**
   * 应用图标
   * base64编码
   */
  icon: string
}

export interface UsesPermission {
  name: string
}
/**
 * sdk版本
 */
export interface UsesSdk {
  /**
   * 最小sdk版本
   */
  minSdkVersion: number
  /**
   * 目标sdk版本
   */
  targetSdkVersion: number
}
/**
 * 应用信息
 */
export interface Application {
  /**
   * 应用名称
   */
  label: string
  icon: string[]
  /**
   * 应用图标
   */
  name: string
  appComponentFactory: string
  activities: Activity[]
  activityAliases: AnyToFix[]
  launcherActivities: LauncherActivity[]
  services: AnyToFix[]
  receivers: AnyToFix[]
  providers: AnyToFix[]
  usesLibraries: UsesLibrary[]
  metaData: MetaDatam[]
}

export interface Activity {
  name: string
  exported: boolean
  taskAffinity: string
  launchMode: number
  configChanges: number
  windowSoftInputMode: number
  hardwareAccelerated: boolean
  resizeableActivity: boolean
  intentFilters: IntentFilter[]
  metaData: MetaDatam[]
}

export interface IntentFilter {
  actions: Action[]
  categories: Category[]
  data: AnyToFix[]
}

export interface Action {
  name: string
}

export interface Category {
  name: string
}

export interface LauncherActivity {
  name: string
  exported: boolean
  taskAffinity: string
  launchMode: number
  configChanges: number
  windowSoftInputMode: number
  hardwareAccelerated: boolean
  resizeableActivity: boolean
  intentFilters: IntentFilter[]
  metaData: MetaDatam[]
}

export interface UsesLibrary {
  name: string
  required: boolean
}

export interface MetaDatam {
  name: string
  value?: number
  resource?: string[]
}
