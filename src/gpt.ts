// import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi, ChatCompletionFunctions } from 'openai'
import { log } from './log'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export const bulletPointsToText = async (points: string[]): Promise<string> => {
  log('Transforming bullet points')
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a summarizer of news front pages.' },
      {
        role: 'user',
        content:
          'Please summarize the following bullet points into a short paragraph, keep the length under 300 characters. Remove references to authors, sources, etc. Ignore ads sponsored content, contact information, cookie notices, etc. Only reply with the summary. Keep the language in Czech.',
      },
      { role: 'user', content: points.map((p) => `* ${p}`).join('\n') },
    ],
    functions: [bulletPointsToSummary],
    temperature: 0.7,
  })

  log('Summarized bullet points')

  try {
    const responseArgs = JSON.parse(
      response.data.choices[0].message?.function_call?.arguments ?? '{}'
    )
    return responseArgs?.summary ?? ''
  } catch (e) {
    console.error(e)
    return ''
  }
}

export const summarizeToBulletPoints = async (
  text: string
): Promise<string[]> => {
  log('Summarizing to bullet points')
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a summarizer of news front pages.' },
      {
        role: 'user',
        content:
          'Please summarize the most important parts the following text into bullet points. Only reply with the bullet points. Ignore ads sponsored content, contact information, cookie notices, etc. Keep the language Czech or translate to czech if necessary.',
      },
      { role: 'user', content: text },
    ],
    temperature: 0.7,
    functions: [summarizeToBullets],
  })

  log('Summarized to bullet points')

  try {
    const responseArgs = JSON.parse(
      response.data.choices[0].message?.function_call?.arguments ?? '{}'
    )
    return responseArgs.bullet_points ?? []
  } catch (e) {
    console.error(e)
    return []
  }
}

export const writingStyleCasual = async (text: string): Promise<string> => {
  log('Transforming writing style')
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a writing style editor.' },
      {
        role: 'user',
        content:
          'Please edit the following text to be causal and approachable for wide audiences. Remove redundant information. Try not to increase the length of the text, if possible make it shorter. Only reply with the edited text. Keep the language Czech or translate to czech if necessary.',
      },
      { role: 'user', content: text },
    ],
    temperature: 0.8,
  })

  log('Transformed writing style')

  try {
    return response.data.choices[0].message?.content ?? ''
  } catch (e) {
    console.error(e)
    return ''
  }
}

export const writingStyleFormal = async (text: string): Promise<string> => {
  log('Transforming writing style')
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a writing style editor.' },
      {
        role: 'user',
        content:
          'Please edit the following text to be more formal and professional, remove redundant information. Try not to increase the length of the text, if possible make it shorter. Only reply with the edited text. Keep the language Czech or translate to czech if necessary.',
      },
      { role: 'user', content: text },
    ],
    temperature: 0.7,
  })

  log('Transformed writing style')

  try {
    return response.data.choices[0].message?.content ?? ''
  } catch (e) {
    console.error(e)
    return ''
  }
}

export const summarizeToBullets: ChatCompletionFunctions = {
  name: 'summary_to_bullet_points',
  description: 'Summarize a text into four short bullet points',
  parameters: {
    type: 'object',
    properties: {
      bullet_points: {
        type: 'array',
        items: {
          type: 'string',
          length: 80,
        },
        length: 4,
      },
    },
    required: ['bullet_points'],
  },
}

export const bulletPointsToSummary: ChatCompletionFunctions = {
  name: 'bullet_points_to_summary',
  description: 'Summarize bullet points into a short summary',
  parameters: {
    type: 'object',
    properties: {
      summary: {
        type: 'string',
        length: 280,
      },
    },
    required: ['summary'],
  },
}
