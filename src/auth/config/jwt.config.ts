import { registerAs } from '@nestjs/config';
export default registerAs('jwt', () => {
  return {
    secret: String(process.env.JWT_SECRET),
    audience: String(process.env.JWT_SECRET),
    issuer: String(process.env.JWT_SECRET),
    expiresIn: Number(process.env.JWT_SECRET ?? '3600'),
    jwtRefreshTtl: Number(process.env.JWT_SECRET ?? '84600'),
  };
});
