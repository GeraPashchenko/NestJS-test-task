import { registerAs } from '@nestjs/config';

export default registerAs('app-env', () => ({
  jwt_secret: process.env.JWT_SECRET || 'super-secret',
}));
