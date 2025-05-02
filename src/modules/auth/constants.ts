import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenSecret: process.env.JWT_ACCESS_SECRET
};
