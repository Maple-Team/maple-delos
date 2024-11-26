export const REDIS_PREFIX = 'maple_admin'

export const jwtConstants = {
  secretKey: REDIS_PREFIX,
  accessTokenExpiresIn: process.env.NODE_ENV === 'development' ? '15m' : '30m',
  refreshTokenExpiresIn: process.env.NODE_ENV === 'development' ? '25m' : '7d',
}
