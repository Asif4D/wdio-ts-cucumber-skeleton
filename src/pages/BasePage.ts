/// <reference types="@wdio/globals/types" />
import type { ChainablePromiseElement } from 'webdriverio';

export default class BasePage {
    
    // Common methods that can be used across all pages
    protected async open(path: string) {
        // return await browser.url(path);
        return await browser.url(path);
    }
    
    protected async click(element: ChainablePromiseElement) {
        // await element.waitForClickable();
        // await element.click();
        await element.waitForClickable();
        await element.click();
    }
    
    protected async setValue(element: ChainablePromiseElement, value: string) {
        // await element.waitForDisplayed();
        // await element.setValue(value);
        await element.waitForDisplayed({ timeout: 15000 });
        await element.setValue(value);
    }
    
    protected async getElement(selector: string) {
           // return await $(selector) as Promise<ChainablePromiseElement<WebdriverIO.Element>>;
           return await $(selector) as any as ChainablePromiseElement;
    }
    
    protected async waitForElement(selector: string, timeout: number = 5000) {
        // const element = await $(selector);
        // await element.waitForDisplayed({ timeout });
        // return element;
            const element = await $(selector) as any as ChainablePromiseElement;
        await element.waitForDisplayed({ timeout });
        return element;
    }
}