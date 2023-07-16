import dotenv from 'dotenv'
dotenv.config()
import bot from './bot'

const main = async () => {
  await bot()
}

main()
