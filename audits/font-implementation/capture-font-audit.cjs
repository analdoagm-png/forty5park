const fs = require('fs/promises')
const path = require('path')
const { chromium } = require('/Users/analdogomez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')

const outDir = path.resolve(__dirname)
const baseUrl = process.argv[2] || 'http://127.0.0.1:5174/'

const steps = [
  {
    name: '01-markets-default-desktop',
    viewport: { width: 1440, height: 900 },
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
    },
  },
  {
    name: '02-market-detail-desktop',
    viewport: { width: 1440, height: 900 },
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: /Show Michigan vector on map/ }).click()
      await page.waitForTimeout(900)
    },
  },
  {
    name: '03-library-desktop',
    viewport: { width: 1440, height: 900 },
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.getByRole('tab', { name: 'Library' }).click()
      await page.waitForTimeout(250)
    },
  },
  {
    name: '04-analysis-desktop',
    viewport: { width: 1440, height: 900 },
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.getByRole('tab', { name: 'Analysis' }).click()
      await page.waitForTimeout(250)
    },
  },
  {
    name: '05-market-search-desktop',
    viewport: { width: 1440, height: 900 },
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Search list' }).click()
      await page.waitForTimeout(250)
    },
  },
  {
    name: '06-markets-mobile',
    viewport: { width: 390, height: 844 },
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.waitForTimeout(500)
    },
  },
]

async function collectTypography(page) {
  return page.evaluate(() => {
    function parseRgb(value) {
      const match = value.match(/rgba?\(([^)]+)\)/)
      if (!match) return null
      return match[1].split(',').slice(0, 3).map((part) => Number.parseFloat(part))
    }

    function relLuminance([r, g, b]) {
      const linear = [r, g, b].map((channel) => {
        const value = channel / 255
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
      })

      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
    }

    function contrastRatio(foreground, background) {
      const fg = parseRgb(foreground)
      const bg = parseRgb(background)
      if (!fg || !bg) return null

      const lighter = Math.max(relLuminance(fg), relLuminance(bg))
      const darker = Math.min(relLuminance(fg), relLuminance(bg))
      return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2))
    }

    const elements = Array.from(
      document.querySelectorAll(
        'h1,h2,h3,p,button,input,.tab-button,.library-tab,.detail-tab,.avatar,.portfolio-info strong,.portfolio-info span',
      ),
    )

    const visible = elements.filter((element) => {
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
    })

    return visible.map((element) => {
      const style = window.getComputedStyle(element)
      let background = style.backgroundColor
      let parent = element.parentElement

      while ((background === 'rgba(0, 0, 0, 0)' || background === 'transparent') && parent) {
        background = window.getComputedStyle(parent).backgroundColor
        parent = parent.parentElement
      }

      return {
        selector:
          element.className && typeof element.className === 'string'
            ? `${element.tagName.toLowerCase()}.${element.className.split(' ').join('.')}`
            : element.tagName.toLowerCase(),
        text: (element.innerText || element.value || element.getAttribute('aria-label') || '').trim().slice(0, 80),
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        color: style.color,
        background,
        contrast: contrastRatio(style.color, background),
      }
    })
  })
}

async function main() {
  await fs.mkdir(outDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const results = []

  for (const step of steps) {
    const page = await browser.newPage({ viewport: step.viewport, deviceScaleFactor: 1 })
    await step.run(page)
    await page.screenshot({ path: path.join(outDir, `${step.name}.png`), fullPage: true })
    results.push({
      step: step.name,
      viewport: step.viewport,
      typography: await collectTypography(page),
    })
    await page.close()
  }

  await browser.close()
  await fs.writeFile(path.join(outDir, 'typography-measurements.json'), JSON.stringify(results, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
