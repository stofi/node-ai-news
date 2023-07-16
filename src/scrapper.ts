/// <reference lib="dom" />
import puppeteer, { Browser, Page } from 'puppeteer'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import { log } from './log'

export async function getContent(url: string) {
  log(`Getting content from ${url}`)
  const browser = await puppeteer.launch({
    headless: 'new',
  })
  const page = await browser.newPage()
  log(`Page created`)
  await page.goto(url, { waitUntil: 'networkidle2' })
  log(`Page loaded`)

  const content = await page.evaluate(() => document.body.innerHTML)
  log(`Content loaded`)

  try {
    const dom = new JSDOM(content)
    const reader = new Readability(dom.window.document)
    const article = reader.parse()
    log(`Content parsed`)
    log(`Content title: ${article?.title ?? 'No title'}`)
    await browser.close()
    return article
  } catch (e) {
    console.error(e)
    log(`Error parsing content`)
  }

  await browser.close()
  log(`Browser closed`)
}
