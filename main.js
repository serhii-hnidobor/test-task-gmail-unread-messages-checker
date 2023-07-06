const { chromium } = require('playwright-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const cliProgress = require('cli-progress');

const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic,
);

chromium.use(StealthPlugin());

const args = require('args');

args
  .option(
    'email',
    'your gmail address (account must be without two factor auth)',
  )
  .option('password', 'your gmail password')
  .option('chromeExecutablePath', 'custom chrome executable path');

const flags = args.parse(process.argv);

const checkFlags = () => flags.email && flags.password;

async function main() {
  const isAllRequiredFlagsSpecify = checkFlags();

  if (!isAllRequiredFlagsSpecify) {
    throw new Error('not all required flag specify');
  }

  progressBar.start(100, 0);

  const browser = await chromium.launch({
    executablePath: flags.chromeExecutablePath || undefined,
    headless: false,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--start-maximized',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
  });

  progressBar.update(25);

  const page = await browser.newPage();

  await page.goto('https://gmail.com');

  await page.type('#identifierId', flags.email);

  await page.click(
    'button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.qIypjc.TrZEUc.lw1w4b[jscontroller="soHxf"]',
  );

  await page.waitForSelector('input[type="password"]');

  progressBar.update(45);

  await page.type('input[type="password"]', String(flags.password));

  await page.click(
    'button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.qIypjc.TrZEUc.lw1w4b[jscontroller="soHxf"][jsname="LgbsSe"]',
  );

  await page.waitForLoadState('domcontentloaded');

  try {
    await page.waitForSelector('div[role="main"]');
  } catch (e) {
    console.error('\n auth credential incorrect');
    process.exit(1);
    return;
  }

  progressBar.update(50);

  const allUnreadGmailLink =
    'https://mail.google.com/mail/u/0/#advanced-search/is_unread=true&isrefinement=true';

  await page.goto(allUnreadGmailLink);

  await page.waitForSelector('body');

  let pageNum = 1;
  let result = 0;

  progressBar.update(75);

  do {
    const unreadMessageElements = await page.locator(
      'div[role="main"] table[role="grid"] tbody tr',
    );

    const unreadMessageNum = await unreadMessageElements.count();

    if (!unreadMessageNum) {
      break;
    }

    result += unreadMessageNum;

    pageNum++;

    await page.goto(
      `https://mail.google.com/mail/u/0/#advanced-search/is_unread=true&isrefinement=true/p${pageNum}`,
    );

    await page.reload();

    await page.waitForSelector('div[role="main"]');
  } while (true);
  progressBar.update(100);

  console.log(`\n you have - ${result} unread messages`);

  await browser.close();
  process.exit(0);
}

main();
