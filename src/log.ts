import chalk from 'chalk'

export const log = (message: string) => {
  console.log(chalk.blue(`[${new Date().toISOString()}]`))
  console.log(chalk.green(message))
}
