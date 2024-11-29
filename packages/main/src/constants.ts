export const REDIS_PREFIX = 'maple_admin'

export const jwtConstants = {
  secretKey: REDIS_PREFIX,
  accessTokenExpiresIn: process.env.NODE_ENV === 'development' ? '1m' : '1m',
  refreshTokenExpiresIn: process.env.NODE_ENV === 'development' ? '20m' : '30m',
}
