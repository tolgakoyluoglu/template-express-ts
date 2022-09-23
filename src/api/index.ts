import express, { Response, Request } from 'express'
import Users from './users/users.routes'
const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.json('Healthcheck OK')
})
router.use('/users', Users)

export default router
