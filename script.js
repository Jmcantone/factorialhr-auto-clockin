const puppeteer = require('puppeteer');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) =>
    readline.question(query, (ans) => {
      readline.pause();
      resolve(ans);
    })
  );
};

(async () => {
  const monthsAgo = parseInt(await askQuestion('¿A partir de cuántos meses en el pasado empezar? '));
  const COOKIE = await askQuestion('Introduce la COOKIE de _factorial_session_v2: ');
  const START_TIME = await askQuestion('Introduce el horario de inicio (HHmm): ');
  const END_TIME = await askQuestion('Introduce el horario de fin (HHmm): ');

  readline.close();

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - monthsAgo);
  const START_YEAR = currentDate.getFullYear();
  const START_MONTH = currentDate.getMonth() + 1;

  console.log(START_YEAR, START_MONTH, COOKIE);

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  page.setViewport({ width: 800, height: 600 });
  page.setCookie({
    value: COOKIE,
    name: "_factorial_session_v2",
    domain: ".api.factorialhr.com",
  });

  for (let i = START_MONTH; i < 13; i++) {
    await page.goto(`https://app.factorialhr.com/attendance/clock-in/${START_YEAR}/${i}`, {
      waitUntil: 'networkidle2',
    });
    console.log("loaded");
    await fillMonth(page);
  }

  async function fillMonth(page) {
    await page.waitForSelector("td>div>div>div>div>div>div:first-child>label>div>div>input");
    const starts = await page.$$("td>div>div>div>div>div>div:first-child>label>div>div>input");
    for (const input of starts) {
      const tr = (await input.evaluateHandle(node => {
        for (let i = 0; i < 11; i++) {
          node = node.parentNode;
        }
        return node;
      })).asElement();
      const className = await (await tr.getProperty("className")).jsonValue();
      if (className.includes("disabled_") || !!input.value) {
        console.log("skip disabled/filled", input.value);
        continue;
      }
      console.log("fill");
      await input.evaluate((element) => { element.click(); });

      await input.type(START_TIME);
      const input2 = await tr.$("td>div>div>div>div>div>div:last-child>label>div>div>input");
      await input2.evaluate((element) => { element.click(); });

      await input2.type(END_TIME);

      await page.waitForTimeout(100);

      const button = await tr.$("button[type=button]");
      await button.evaluate((element) => { element.click(); });
      await page.waitForTimeout(500);
    }
    console.log("all filled");
  }

})();
