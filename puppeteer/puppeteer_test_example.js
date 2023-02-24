/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const puppeteer = require("puppeteer");
const { assertOk, assertEqual, wait } = require('../utils');

(async () => {
  console.log(`[puppeteer] o Test starting`);
  console.log(`[puppeteer]`);

  const browserOptions = {
    product: "firefox",
    protocol: "webDriverBiDi",
    headless: false,
  };

  /**
   * To switch to Chrome, set product: "chrome".
   * To switch to CDP, remove protocol (or set any other value...)
   * Note that at the moment there is bug related to navigation when running
   * this test with Chrome + webDriverBiDi.
   */

  console.log(`[puppeteer] o SETUP`);
  console.log(`[puppeteer]   o Starting browser`);
  const browser = await puppeteer.launch(browserOptions);

  console.log(`[puppeteer]   o Browser started`);
  const content = await browser.createIncognitoBrowserContext();

  console.log(`[puppeteer]   o Opening a new tab`);
  const page = await content.newPage();

  await page.evaluate(() => window.alert("Test starting"));
  console.log(`[puppeteer]`);
  console.log(`[puppeteer] o TEST FIREFOX HOME`);

  console.log(`[puppeteer]   o Navigate to the Firefox homepage on mozilla.org`);
  await page.evaluate(() => window.location.href = "https://www.mozilla.org/en-US/firefox/browsers/");
  // We don't have APIs to wait for navigation exposed by puppeteer when using BiDi yet
  await wait(2000)

  console.log(`[puppeteer]   o Count occurrences of "firefox" on the Firefox home`);
  const firefoxInFirefox = await countOccurrences(page, "firefox");
  assertOk(firefoxInFirefox > 0, `[puppeteer]     o Firefox is mentioned ${firefoxInFirefox} times on the Firefox home`);
  await wait(500)

  console.log(`[puppeteer]   o Count occurrences of "chrome" on the Firefox home`);
  const chromeInFirefox = await countOccurrences(page, "chrome");
  assertEqual(chromeInFirefox , 0, "[puppeteer]     o Chrome is not mentioned on the Firefox home");
  await wait(500)

  console.log(`[puppeteer]`);
  console.log(`[puppeteer] o TEST CHROME HOME`);
  console.log(`[puppeteer]   o Navigate to the Chrome homepage on google.com`);
  await page.evaluate(() => window.location.href = "https://www.google.com/chrome/");
  await wait(2000)

  console.log(`[puppeteer]   o Count occurrences of "firefox" on the Chrome home`);
  const firefoxInChrome = await countOccurrences(page, "firefox");
  assertEqual(firefoxInChrome , 0, "[puppeteer]     o Firefox is not mentioned on the Chrome home");
  await wait(500)

  console.log(`[puppeteer]   o Count occurrences of "chrome" on the Chrome home`);
  const chromeInChrome = await countOccurrences(page, "chrome");
  assertOk(chromeInChrome > 0, `[puppeteer]     o Chrome is mentioned ${chromeInChrome} times on the Chrome home`);
  await wait(500)

  await browser.close();
  console.log(`[puppeteer]`);
  console.log(`[puppeteer] o TEARDOWN`);
  console.log(`[puppeteer]   o Closing browser`);
  console.log(`[puppeteer]`);
  console.log(`[puppeteer] o Test completed`);
})();

const countOccurrences = async (page, word) => {
  // There is no way to really parametrize this
  // Firefox + CDP does not support strings for page.evaluate
  // Firefox + BiDi does not support arguments for functions passed to page.evaluate
  // Chrome + CDP does not support returning values when using strings for page.evaluate
  if (word === "firefox") {
    return page.evaluate(() => (document.body.textContent.match(new RegExp("firefox", "ig")) || []).length);
  }
  return page.evaluate(() => (document.body.textContent.match(new RegExp("chrome", "ig")) || []).length);
}
