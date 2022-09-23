import { DataSource } from 'typeorm'

const db = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'boiler_ts',
  password: 'postgres',
  database: 'boiler_ts',
  entities: ['dist/entities/*.entity.js'],
  synchronize: true
})

db.initialize()
  .then(() => {
    console.log('Database has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })

export default db
