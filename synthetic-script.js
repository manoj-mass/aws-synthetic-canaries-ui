// --------------------------------------- ohio


var synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const getYYYYMMDD = (d0) => {
    const d = new Date(d0)
    return new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
}

const flowBuilderBlueprint = async function () {
    // INSERT URL here
    
    const checkin = new Date().setMonth(new Date().getMonth() + 3);

    let url = `https://hoteldomain.com.au/#/arise/accm/f922?c_in=${getYYYYMMDD(checkin)}&c_out=${getYYYYMMDD(new Date(checkin).setDate(new Date().getDate() + 1) )}&currency=LKR&adult=2&child=0`;

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

    // Execute customer steps
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"main-logo\"]", { timeout: 30000 });
    });
    
    // Execute customer steps
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"btn btn-primary canary-selector\"]", { timeout: 30000 });
    });
    
    await synthetics.executeStep('redirection', async function () {
        await Promise.all([
           page.waitForNavigation({ timeout: 30000 }),
           await page.click("[class=\"btn btn-primary canary-selector\"]")
        ]);
    });
    
    await synthetics.executeStep('input', async function () {
        await page.type("[id=\"fname\"]", "first name");
    });
    await synthetics.executeStep('input', async function () {
        await page.type("[id=\"lname\"]", "last name");
    });
    await synthetics.executeStep('input', async function () {
        await page.type("[id=\"email\"]", "test@email.com");
    });
    await synthetics.executeStep('input', async function () {
        await page.type("[id=\"phone\"]", "0777777777");
    });

    await synthetics.executeStep('redirection', async function () {
        await Promise.all([
           page.waitForNavigation({ timeout: 30000 }),
           await page.click("[id=\"confirmGuestInfo\"]")
        ]);
    });
    
    await synthetics.executeStep('verifySelector', async function () {
        await page.waitForSelector("[class=\"btn btn-primary\"]", { timeout: 30000 });
    });

};

exports.handler = async () => {
    return await flowBuilderBlueprint();
};
