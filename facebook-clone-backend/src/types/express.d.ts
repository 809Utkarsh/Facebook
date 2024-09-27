import { IUser } from "../models/User"; 
import { Request } from 'express';// Adjust path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: IUser; 
      newAccessToken?: string;// Add the user property to the Request object
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    newAccessToken?: string;
  }
}
