// import { encode, decode } from 'gpt-token-utils'
import * as utils from 'gpt-tokenizer'
import { log } from './log'
export const countTokens = (text: string) => {
  const result = utils.encode(text)
  log(`Counted ${result.length} tokens`)
  return result.length
}

export const truncateText = (text: string, maxTokens: number) => {
  const result = utils.encode(text)
  const truncatedTokens = result.slice(0, maxTokens)
  const truncatedText = utils.decode(truncatedTokens)
  log(`Truncated text to ${truncatedText.length} tokens`)

  return truncatedText
}
