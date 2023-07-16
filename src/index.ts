import dotenv from 'dotenv'
dotenv.config()
// An express server serves one endpoint
// GET /api/last-post
// Returns the most recent post published within the last hour
// If there is none it runs and gets the most recent post again
// If there is none it returns an string saying so
import bot from './bot'
import { getMostRecentPublishedPostFromWithinLastHour } from './database'
import express from 'express'

const app = express()
app.use(express.json())

app.get('/api/last-post', async (req, res) => {
  try {
    let mostRecentPost = await getMostRecentPublishedPostFromWithinLastHour()

    // If no post found, try once again
    if (!mostRecentPost) {
      await bot()
      mostRecentPost = await getMostRecentPublishedPostFromWithinLastHour()
    }

    // If still no post found, return a string message
    if (!mostRecentPost) {
      res.json({ message: 'No posts published within the last hour' })
    } else {
      res.json(mostRecentPost)
    }
  } catch (error) {
    console.error(`Error: ${error}`)
    res.status(500).json({ message: 'Server Error' })
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
