/// <reference lib="dom" />
import puppeteer, { Browser, Page } from 'puppeteer'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import { log } from './log'

export async function getContent(url: string, browser: Browser) {
  log(`Getting content from ${url}`)

  const page = await browser.newPage()
  log(`Page created`)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  log(`Page loaded`)

  const content = await page.evaluate(() => document.body.innerHTML)
  log(`Content loaded`)

  try {
    const dom = new JSDOM(content)
    const reader = new Readability(dom.window.document)
    const article = reader.parse()
    log(`Content parsed`)
    log(`Content title: ${article?.title ?? 'No title'}`)

    return article
  } catch (e) {
    console.error(e)
    log(`Error parsing content`)
  }
}
