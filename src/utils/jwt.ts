import jwt from 'jsonwebtoken';
import 'dotenv/config'


type JwtPayload ={
    id: number;
    email: string;
    role: string;
}

const generateAccessToken = (payload: JwtPayload): string=>{
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
    } as jwt.SignOptions)
}
const generateRefreshToken = (payload: JwtPayload): string=>{
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES,
    } as jwt.SignOptions)
}
const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
};

const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
};

export {generateAccessToken,generateRefreshToken,verifyAccessToken,verifyRefreshToken}