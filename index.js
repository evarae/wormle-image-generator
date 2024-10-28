import puppeteer from 'puppeteer';

const GAME_GRID_CLASS = '.puppeteer-target';
// const URL = 'https://wormle.com';
const URL = 'http://localhost:3001';

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto(URL);

//hide demo modal
await page.locator('h1').click();

//Get height/width of the game
const { width, height } = await page.evaluate((selector) => {
  const element = document.querySelector(selector);
  if (!element) return { width: null, height: null };
  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}, GAME_GRID_CLASS);

const max = height > width? height : width;

await page.addStyleTag({content: `${GAME_GRID_CLASS}{height: ${max}px; width: ${max}px; justify-content: center; padding: 20px}`})

const unsolvedGameContainer = await page.waitForSelector(GAME_GRID_CLASS);
await unsolvedGameContainer.screenshot({path:"output/imageUnsolved.jpg"});

await page.evaluate(`window.Wormle.solvePuzzle()`);

//hide win modal
await page.locator('h1').click();

const solvedGameContainer = await page.waitForSelector(GAME_GRID_CLASS);
await solvedGameContainer.screenshot({path:"output/imageSolved.jpg"});

await browser.close();
