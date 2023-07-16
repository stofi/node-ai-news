import { getContent } from './scrapper'
import { getSources, createPost } from './database'
import { truncateText } from './tokens'
import {
  bulletPointsToText,
  summarizeToBulletPoints,
  writingStyleCasual,
  writingStyleFormal,
} from './gpt'
import { log } from './log'

const bot = async () => {
  log('Bot started')
  const sources = await getSources()

  log(`Got ${sources.length} sources`)

  const contentRequests = sources.map((source) => {
    return getContent(source.url)
  })

  const contents = await Promise.all(contentRequests)

  log(`Got ${contents.length} contents`)

  const trimmedContents = contents.filter(Boolean).map((content) => {
    return truncateText(content!.textContent, 1024)
  })

  const bulletPointCompletions = trimmedContents
    .filter((s) => s.length)
    .map((content) => {
      return summarizeToBulletPoints(content)
    })

  const bulletPoints = await Promise.all(bulletPointCompletions)

  log(`Got ${bulletPoints.length} bullet points`)

  log(
    bulletPoints
      .flat()
      .map((b) => ` * ${b}`)
      .join('\n')
  )
  const response = await bulletPointsToText(bulletPoints.flat())
  log(response)

  const casual = await writingStyleCasual(response)
  log(casual)

  const formal = await writingStyleFormal(response)

  log('Writing style transformed')

  const post = await createPost({
    content: response,
    casual,
    formal,
  })

  log('Bot finished')
}

export default bot
