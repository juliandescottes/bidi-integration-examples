/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path');
const url = require('url')

const { BrowsingContext, Builder, By, Key, logging, LogInspector, until }  = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const { wait, waitUntil } = require('../utils')
const { adapters } = require('bidi-har-export')

logging.installConsoleHandler()
logging.getLogger(logging.Type.BROWSER).setLevel(logging.Level.ALL)
;(async function () {
  console.log("[selenium] o Test starting")
  console.log("[selenium]")

  let driver
  let options = new firefox.Options()
    .setBinary(firefox.Channel.NIGHTLY)
    .enableBidi()
  try {
    console.log(`[selenium] o SETUP`);
    console.log("[selenium]   o Start Firefox with BiDi enabled")
    driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build()

    await wait(1000)

    const id = await driver.getWindowHandle()
    const browsingContext = await BrowsingContext(driver, {
      browsingContextId: id,
    })
    console.log("[selenium]   o Firefox started")
    await wait(1000)

    console.log("[selenium]")
    console.log(`[selenium] o SETUP HAR RECORDING`);
    await wait(500)
    console.log("[selenium]   o Start recording network events using BiDi")
    await wait(500)
    const harRecorder = new adapters.SeleniumBiDiHarRecorder({
      browsingContextIds: [id],
      driver,
    })
    await harRecorder.startRecording()
    console.log("[selenium]   o Now recording network events")
    await wait(1000)

    console.log("[selenium]")
    console.log(`[selenium] o SETUP LOG INSPECTOR`);
    await wait(500)
    console.log("[selenium]   o Start recording log events using BiDi")
    await wait(500)
    const logInspector = await LogInspector(driver)
    let logEntry;
    await logInspector.onConsoleEntry(function (log) {
      logEntry = log
    })
    console.log("[selenium]   o Now recording log events")
    await wait(1000)

    console.log("[selenium]")
    console.log(`[selenium] o SEARCH ENGINE TEST`);
    console.log("[selenium]   o Navigate to DuckDuckGo using BiDi")
    await browsingContext.navigate('https://duckduckgo.com/', 'complete')
    await wait(2000)
    console.log("[selenium]   o Navigation completed")
    await wait(1000)

    console.log("[selenium]   o Fill the search input using WebDriver Classic")
    driver.findElement(By.name('q')).sendKeys('webdriver bidi w3c')
    await wait(2000)

    console.log("[selenium]   o Submit the query using WebDriver Classic")
    driver.findElement(By.name('q')).sendKeys(Key.RETURN)
    await wait(2000)

    await driver.wait(until.titleIs('webdriver bidi w3c at DuckDuckGo'), 1000)
    await wait(2000)
    console.log("[selenium]   o Results page displayed")

    console.log("[selenium]")
    console.log("[selenium] o LOG EVENTS TEST")
    console.log("[selenium]   o Navigate to a console test page using BiDi")
    await browsingContext.navigate('https://bidi-demo-console-logs.glitch.me', 'complete')
    await driver.wait(until.titleIs('Simple console test'), 1000)
    await wait(1000)
    console.log("[selenium]   o Navigation completed")

    console.log("[selenium]   o Fill the message input and click the log button")
    driver.findElement(By.id('create-log-input')).sendKeys('Test message', Key.RETURN)
    await driver.findElement({ id: 'create-log-button' }).click()
    await wait(1000)

    console.log("[selenium]   o Wait for the log event with BiDi")
    await waitUntil(() => logEntry);
    assert.equal(logEntry.text, 'Test message')
    await wait(1000)
    console.log("[selenium]   o Log event received by WebDriver BiDi")
    await wait(1000)

    console.log("[selenium]")
    console.log(`[selenium] o SAVE HAR RECORDING`);
    await wait(1000)
    console.log("[selenium]   o Stop recording network events using BiDi")
    await wait(1000)
    console.log("[selenium]   o Create a HAR file using BiDi")
    const harExport = await harRecorder.stopRecording()
    const harData = JSON.stringify(harExport, null, "  ");
    const filename = `http_archive_${new Date().toISOString()}`;
    const filePath = path.join(__dirname, `/har/${filename}.har`);
    fs.writeFileSync(filePath, harData);

    console.log("[selenium]")
    console.log("[selenium] o Test completed")
  } finally {
    if (driver) {
      await driver.quit()
    }
  }
})()
