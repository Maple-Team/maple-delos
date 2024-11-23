export const REDIS_PREFIX = 'maple_admin'
export const jwtConstants = {
  secretKey: REDIS_PREFIX,
  accessTokenExpiresIn: process.env.NODE_ENV === 'development' ? '60s' : '30m',
  refreshTokenExpiresIn: process.env.NODE_ENV === 'development' ? '1d' : '7d',
}
