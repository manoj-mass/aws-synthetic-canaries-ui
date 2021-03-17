var synthetics = require('Synthetics');
const log = require('SyntheticsLogger');
const puppeteer = require('puppeteer-core');

const pageLoadBlueprint = async function () {
    
    const iPhone = puppeteer.devices['iPhone 6'];

    // INSERT URL here
    const URL = "https://amazon.com";

    let page = await synthetics.getPage();
    await page.emulate(iPhone);

    //You can customize the wait condition here. For instance,
    //using 'networkidle2' may be less restrictive.
    const response = await page.goto(URL, {waitUntil: 'domcontentloaded', timeout: 30000});
    if (!response) {
        throw "Failed to load page!";
    }
    
    await page.waitFor(15000);

    await synthetics.takeScreenshot('loaded', 'loaded');
    
    //If the response status code is not a 2xx success code
    if (response.status() < 200 || response.status() :gt; 299) {
        throw "Failed to load page!";
    }
};

exports.handler = async () => {
    return await pageLoadBlueprint();
};

// The following sample emulates an iPhone 6 device. For more information about emulation, see page.emulate(options) in the Puppeteer documentation.
