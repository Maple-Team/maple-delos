export const REDIS_PREFIX = 'maple_admin'

export const jwtConstants = {
  secretKey: REDIS_PREFIX,
  accessTokenExpiresIn: process.env.NODE_ENV === 'development' ? '1m' : '30m',
  refreshTokenExpiresIn: process.env.NODE_ENV === 'development' ? '5m' : '7d',
}
