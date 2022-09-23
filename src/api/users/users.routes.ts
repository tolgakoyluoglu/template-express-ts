import express, { Response, Request } from 'express'
import UsersController from './users.controller'
const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.json('Users')
})
router.post('/sign-up', UsersController.signUp)
router.post('/sign-in', UsersController.signIn)
router.post('/logout', UsersController.signOut)
router.post('/me', UsersController.authenticateRoute)

export default router
