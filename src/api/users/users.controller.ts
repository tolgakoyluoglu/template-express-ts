import { Request, Response } from 'express'
import {
  EMAIL_EXISTS,
  EMAIL_PASSWORD_NOMATCH,
  internalServerError,
  missingRequired,
  UNAUTHORIZED,
} from '../../helpers/responses'
import UsersService from './users.service'
import session from '../../config/session'
import { uuidv4 } from '../../helpers/uuidv4'

const { NODE_ENV } = process.env
const cookieConfig = {
  httpOnly: true,
  secure: NODE_ENV !== 'development',
}

class UsersController {
  static async signUp(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body
      const ERROR = missingRequired({ email, password, name })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      const emailExist = await UsersService.findOne(email)
      if (emailExist) return res.status(EMAIL_EXISTS.code).json(EMAIL_EXISTS)

      const user = await UsersService.create({ email, password, name })

      return res.json(user)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  static async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const ERROR = missingRequired({ email, password })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      const user = await UsersService.findOne(email)
      if (!user) return res.status(UNAUTHORIZED.code).json(UNAUTHORIZED)

      const match = await UsersService.comparePassword(user.password, password)
      if (!match)
        return res
          .status(EMAIL_PASSWORD_NOMATCH.code)
          .json(EMAIL_PASSWORD_NOMATCH)

      const sessionData = { id: user.id }
      const token = uuidv4()

      await session.set(token, sessionData)
      res.cookie('token', token, cookieConfig)
      const sessionTokens = [token].concat(user.sessions)
      await UsersService.update({ id: user.id, sessions: sessionTokens })

      user.password = ''
      user.sessions = []

      return res.json(user)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  static async signOut(req: Request, res: Response) {
    try {
      if (!req.me) return res.json(null)
      const { token } = req.cookies
      const { id } = req.me

      const user = await UsersService.findOneById(id)
      if (user) {
        let sessionTokens = user.sessions
        sessionTokens = sessionTokens.filter((t: string) => t !== token)
        user.sessions = sessionTokens
        await UsersService.update({ id: user.id, sessions: sessionTokens })
      }
      await session.del(token)
      res.clearCookie('token')

      return res.status(204).end()
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  static async authenticateRoute(req: Request, res: Response) {
    try {
      if (!req.me) return res.json(null)
      const { id } = req.me

      const user = await UsersService.findOneById(id)
      if (!user) return res.status(UNAUTHORIZED.code).json(UNAUTHORIZED)

      // Don't leak sensitive data
      user.sessions = []
      user.password = ''

      return res.json(user)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }
}

export default UsersController
