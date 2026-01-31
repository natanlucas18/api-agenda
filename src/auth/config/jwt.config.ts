import { registerAs } from '@nestjs/config';
export default registerAs('jwt', () => {
  return {
    secret: String(process.env.JWT_SECRET),
    audience: String(process.env.JWT_TOKEN_AUDIENCE),
    issuer: String(process.env.JWT_TOKEN_ISSUER),
    expiresIn: Number(process.env.JWT_TOKEN_EXPIRES_IN ?? '3600'),
    jwtRefreshTtl: Number(process.env.JWT_REFRESH_TTL ?? '84600'),
  };
});
