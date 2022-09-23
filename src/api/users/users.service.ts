import bcrypt from 'bcryptjs'
import { User } from '../../entities/user.entity'
import db from '../../config/typeorm'

const salt = bcrypt.genSaltSync(10)

const userRepository = db.getRepository(User)
class UserService {
  static async findOne(email: string) {
    return userRepository.findOne({ where: { email } })
  }

  static async findOneById(id: string) {
    return userRepository.findOne({ where: { id } })
  }

  static async create(data: { email: string; password: string; name: string }) {
    const { email, password, name } = data

    const hashedPassword = bcrypt.hashSync(password, salt)
    let user = userRepository.create({ email, password: hashedPassword, name })
    user = await userRepository.save(user)
    user.password = ''
    return user
  }

  static async update(data: { id: string; sessions: string[] }) {
    const { id, sessions } = data
    return userRepository.save({ id, sessions })
  }

  static async comparePassword(userPassword: string, password: string) {
    return bcrypt.compareSync(password, userPassword)
  }
}

export default UserService
