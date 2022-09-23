import { NextFunction, Request, Response } from 'express'
import session from './config/session'
import { internalServerError } from './helpers/responses'

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token } = req.cookies
    if (token) req.me = await session.get(token)

    next()
  } catch (error) {
    internalServerError(req, res, error)
  }
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404)
  const error = new Error(`Not Found - ${req.originalUrl}`)
  next(error)
}

export function errorHandler(err: Error, req: Request, res: Response) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  })
}
