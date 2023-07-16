import dotenv from 'dotenv'
dotenv.config()
import bot from './bot'
import {
  getMostRecentPublishedPostFromWithinLastHour,
  getMostRecentPublishedPost,
} from './database'
import express from 'express'
import puppeteer, { Browser } from 'puppeteer'
import { log } from './log'

const app = express()
app.use(express.json())

const MY_SECRET = process.env.MY_SECRET

if (!MY_SECRET) throw new Error('Missing MY_SECRET env var')

app.get('/api/last-post', async (req, res) => {
  const mostRecentPost = await getMostRecentPublishedPostFromWithinLastHour()

  if (mostRecentPost) {
    res.json(mostRecentPost)
    return
  }

  const mostRecentPostFromDatabase = await getMostRecentPublishedPost()
  if (mostRecentPostFromDatabase) {
    res.json(mostRecentPostFromDatabase)
    return
  }

  res.json(null)
})

app.post('/api/update', async (req, res) => {
  // check authorization header
  const secret = req.headers.authorization?.split(' ')[1]
  console.log(secret)
  if (secret !== MY_SECRET) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const browser = await puppeteer.launch({
    headless: 'new',
  })

  try {
    await bot(browser)
  } catch (e) {
    console.error(e)
  }

  await browser.close()

  res.json({ success: true })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
