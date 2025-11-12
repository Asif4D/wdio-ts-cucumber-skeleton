/// <reference types="@wdio/globals/types" />
import BasePage from './BasePage';

class LoginPage extends BasePage {
    
    // Element selectors
    // private get emailInput() { return $('//input[@id="email"]'); }
    private get emailInput(): ReturnType<typeof $> { return $('input[type="email"]') || $('input[name*="email"]') || $('//input[@id="email"]'); }
    // private get passwordInput() { return $('//*[@id="password"]'); }
    private get passwordInput(): ReturnType<typeof $> { return $('input[type="password"]') || $('input[name*="password"]') || $('//*[@id="password"]'); }
    // private get loginButton() { return $('//*[@id="next"]'); }
    private get loginButton(): ReturnType<typeof $> { return $('button[type="submit"]') || $('//button[contains(text(), "Login")]') || $('//*[@id="next"]'); }
    // error selectors (try multiple fallbacks instead of using || which picks the first element handle)
    private errorSelectors = [
        '.error-message',
        '[role="alert"]',
        '.error',
        '.error-text',
        '//p[contains(., "Invalid")]',
        '//*[@id="localAccountForm"]/div[2]/p'
    ];

    private async findErrorElement(): Promise<ReturnType<typeof $> | null> {
        for (const sel of this.errorSelectors) {
            try {
                const el = await browser.$(sel);
                if (await el.isExisting()) return el;
            } catch (e) {
                // ignore and try next selector
            }
        }
        return null;
    }
    
    // Page methods
    async openLoginPage() {
        await this.open('/');
        // Wait for page to load and log available elements
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Adding 3 second wait for step completion
    }
    
    async enterEmail(email: string) {
        // await this.setValue(this.emailInput, email);
        await this.setValue(this.emailInput as any, email);
        // Adding 3 second wait for step completion
    }
    
    async enterPassword(password: string) {
        // await this.setValue(this.passwordInput, password);
        await this.setValue(this.passwordInput as any, password);
        // Adding 3 second wait for step completion
    }
    
    async clickLogin() {
        // await this.click(this.loginButton);
        await this.click(this.loginButton as any);
        // Adding 3 second wait for step completion
    }
    
    async login(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLogin();
    }
    
    async isErrorMessageDisplayed(): Promise<boolean> {
        const el = await this.findErrorElement();
        if (!el) return false;
        try {
            return await (el as any).isDisplayed();
        } catch (e) {
            return false;
        }
    }
    
    async getErrorMessage(): Promise<string> {
        const el = await this.findErrorElement();
        if (!el) return '';
        try {
            return await (el as any).getText();
        } catch (e) {
            return '';
        }
    }
}

export default new LoginPage();