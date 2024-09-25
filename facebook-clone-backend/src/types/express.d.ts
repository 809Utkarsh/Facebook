import { IUser } from "../models/User"; // Adjust path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add the user property to the Request object
    }
  }
}
