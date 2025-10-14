import { User } from "../entity/User";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>; // or a custom `JwtPayload` type
    }
  }
}
