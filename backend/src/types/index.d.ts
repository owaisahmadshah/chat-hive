export interface IRequestUser {
  _id: string
  email: string
  username: string
}

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser
    }
  }
}
