/// <reference types="@wdio/globals/types" />
// Keep the config untyped to avoid strict mismatch with the runner type
export const config = {
    runner: 'local',
    path: '/',
    
    // Framework configuration
    framework: 'cucumber',
    cucumberOpts: {
        require: ['./src/step-definitions/*.ts'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        format: ['pretty'],
        snippets: true,
        source: true,
        profile: [],
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },
    
    // Spec files
    specs: [
        './features/*.feature'
    ],
    
    // Capabilities
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--disable-gpu', '--window-size=1280,800']
        }
    }],
    
    // Test configuration
    maxInstances: 1,
    logLevel: 'info',
    bail: 0,
    baseUrl: 'https://dev-securianinsuux-alpha.digitalcreditor.securiancanada.ca/',
    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // Test runner services
    // services: ['chromedriver'],
    services: [],
    
    // Reporters
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],
    
    // Hooks
    before: async () => {
        await browser.setTimeout({ 'implicit': 5000 });
    },
    
    afterStep: async function (_step: any, _scenario: any, result: any) {
        // On failure attach a screenshot and the page HTML to Allure results for easier debugging.
        if (!result?.error) return;

        // Try to use the Allure reporter API directly (preferred). If it's not available, fall back to
        // the previous global.allure approach. We keep the old attempt as comments for traceability.
        let allureReporter: any | undefined;
        try {
            // require at runtime to avoid static import/typing issues in the WDIO config
            // this maps to the installed @wdio/allure-reporter package configured in reporters
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require('@wdio/allure-reporter');
            // v6+/v7+ expose default, older versions may export the function directly
            allureReporter = mod?.default || mod;
        } catch (e) {
            // reporter package not available via require here — we'll try the global object below
            // eslint-disable-next-line no-console
            console.warn('[afterStep] @wdio/allure-reporter require failed, will try global.allure fallback');
        }

        try {
            const screenshotBase64 = await browser.takeScreenshot();
            const screenshotBuffer = Buffer.from(screenshotBase64, 'base64');

            const pageHtml = await browser.getPageSource();

            if (allureReporter && typeof allureReporter.addAttachment === 'function') {
                // reporter API signature: addAttachment(name, content, type)
                try {
                    allureReporter.addAttachment('Screenshot', screenshotBuffer, 'image/png');
                } catch (err) {
                    // some versions expect (name, content) or (name, content, type)
                    try {
                        allureReporter.addAttachment('Screenshot', screenshotBuffer);
                    } catch (err2) {
                        // eslint-disable-next-line no-console
                        console.warn('[afterStep] allureReporter.addAttachment(screenshot) failed:', err2);
                    }
                }

                try {
                    // attach page source as text/html
                    allureReporter.addAttachment('Page source', pageHtml, 'text/html');
                } catch (err) {
                    // fallback to buffer
                    try {
                        const htmlBuffer = Buffer.from(pageHtml, 'utf8');
                        allureReporter.addAttachment('page-source.html', htmlBuffer, 'text/html');
                    } catch (err2) {
                        // eslint-disable-next-line no-console
                        console.warn('[afterStep] allureReporter.addAttachment(page-source) failed:', err2);
                    }
                }

                return;
            }

            // FALLBACK: try the global.allure object (kept for backwards compatibility)
            // (previous implementation preserved below as comments)
            // @ts-ignore
            const ga = (global as any).allure;
            if (ga && typeof ga.addAttachment === 'function') {
                try {
                    ga.addAttachment('screenshot', screenshotBuffer, 'image/png');
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.warn('[afterStep] global.allure.addAttachment(screenshot) failed:', err);
                }

                try {
                    ga.addAttachment('page-source', pageHtml, 'text/html');
                } catch (e) {
                    try {
                        const htmlBuffer = Buffer.from(pageHtml, 'utf8');
                        ga.addAttachment('page-source.html', htmlBuffer, 'text/html');
                    } catch (err2) {
                        // eslint-disable-next-line no-console
                        console.warn('[afterStep] global.allure.addAttachment(page-source) failed:', err2);
                    }
                }
                return;
            }

            // If we reach here no known Allure attachment API was available — log and continue
            // eslint-disable-next-line no-console
            console.warn('[afterStep] No Allure reporter API available; skipping attachments');
        } catch (err) {
            // don't let attachment errors break the test run
            // eslint-disable-next-line no-console
            console.warn('[afterStep] Failed to collect/attach artifacts:', err);
        }
    }
};