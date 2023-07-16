import { PrismaClient } from '@prisma/client'
import { log } from './log'
const prisma = new PrismaClient()

export const getSources = async () => {
  const sources = await prisma.source.findMany()
  return sources
}

export const getMostRecentPublishedPost = async () => {
  log('Getting most recent published post')
  const post = await prisma.post.findFirst({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return post
}
export const getMostRecentPublishedPostFromWithinLastHour = async () => {
  log('Getting most recent published post from within last hour')
  const post = await prisma.post.findFirst({
    where: {
      published: true,
      createdAt: {
        gt: new Date(Date.now() - 1000 * 60 * 60),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return post
}

export const createSource = async (data: { name: string; url: string }) => {
  log(`Creating source ${data.name}`)
  const source = await prisma.source.create({
    data,
  })
  return source
}

export const createPost = async (data: {
  content: string
  casual: string
  formal: string
}) => {
  log(`Creating post`)
  const post = await prisma.post.create({
    data: {
      ...data,
      published: true,
    },
  })
  return post
}
