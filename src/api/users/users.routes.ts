import express, { Response, Request } from 'express'
import { authenticate } from '../../middlewares'
import UsersController from './users.controller'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.json('Users')
})
router.post('/sign-up', UsersController.signUp)
router.post('/sign-in', UsersController.signIn)
router.post('/logout', authenticate, UsersController.signOut)
router.get('/me', authenticate, UsersController.authenticateRoute)

export default router
