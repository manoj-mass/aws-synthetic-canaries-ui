// ----------------------------------------------------------------- sydni version

var synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

    const getCheckOut = (gap) => {
        const checkoutDate = new Date();
        return checkoutDate.setDate(checkoutDate.getDate() + gap + 1); 
    }
    const getCheckIn = (gap) => {
        const checkInDate = new Date();
        return checkInDate.setDate(checkInDate.getDate() + gap);
    }
    

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    
const flowBuilderBlueprint = async function () {
    
    let url = `https://hoteldomain.com.au/#/arise/accm/f922?c_in=${formatDate(getCheckIn(60))}&c_out=${formatDate(getCheckOut(60))}&currency=USD&adult=2&child=0`;
    
    log.info("Initial URL: " + url)
    
    // Get synthetics configuration
    let syntheticsConfig = synthetics.getConfiguration();

    // Set configuration values
    syntheticsConfig.setConfig({
       screenshotOnStepStart : true,
       screenshotOnStepSuccess: true,
       screenshotOnStepFailure: true
    });

    let page = await synthetics.getPage();

    // Navigate to the initial url
    await synthetics.executeStep('navigateToUrl', async function (timeoutInMillis = 30000) {
        await page.goto(url, {waitUntil: ['load', 'networkidle0'], timeout: timeoutInMillis});
    });

    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"main-logo\"]", { timeout: 30000 });
    });
    
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"btn btn-primary float-right-custom\"]", { timeout: 30000 });
    });
    
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"footer\"]", { timeout: 30000 });
    });
    
    await synthetics.executeStep('redirection', async function () {
        await Promise.all([
          page.waitForNavigation({ timeout: 30000 }),
          await page.click("[class=\"btn btn-primary float-right-custom\"]")
        ]);
    });
    
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"main-logo\"]", { timeout: 30000 });
    });
    
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"start-rate\"]", { timeout: 30000 });
    });
    
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"footer\"]", { timeout: 30000 });
    });
    
    await synthetics.executeStep('input', async function () {
        await page.type("#name", "First Name");
        await page.type("#name2", "Last Name");
        await page.type("#name3", "synthatictest@mail.com");
        await page.type("#name4", "0123456789");
        await page.type("#name5", "Test note");
    });

    await synthetics.executeStep('redirection', async function () {
        await Promise.all([
          page.waitForNavigation({ timeout: 30000 }),
          await page.click("[class=\"btn btn-primary\"]")
        ]);
    });
    
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("iframe");
        const elementHandle = await page.$('div.creditcard-wrapper iframe');
        const frame = await elementHandle.contentFrame();
        await frame.waitForSelector("[id=\"cardholderName\"]", { timeout: 30000 });
        await frame.waitForSelector("[id=\"cardNumber\"]", { timeout: 30000 });
        await frame.waitForSelector("[id=\"expiryDateMonth\"]", { timeout: 30000 });
        await frame.waitForSelector("[id=\"expiryDateYear\"]", { timeout: 30000 });
        await frame.waitForSelector("[id=\"cvn\"]", { timeout: 30000 });
    });
    
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"main-logo\"]", { timeout: 30000 });
        await page.waitForSelector("[class=\"start-rate\"]", { timeout: 30000 });
    });
    
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"footer\"]", { timeout: 30000 });
    });
    
};

exports.handler = async () => {
    return await flowBuilderBlueprint();
};
