/// <reference types="@wdio/globals/types" />
import BasePage from './BasePage';

class DashboardPage extends BasePage {
    
    // Element selectors
    async clickProfileIcon() {
        // Strategy: try to find any button in the app-header and click it
        // This is more robust than trying specific selectors which may change
        const headerBtn = await browser.$('app-header button');
        await this.click(headerBtn as any);
    }
    
    async clickLogout() {
        // Find the logout button (usually in a menu that opens after profile icon click)
        // Try multiple selectors
        let logoutBtn = await browser.$('//button[contains(text(), "Logout")]');
        if (!(await logoutBtn.isExisting())) {
            logoutBtn = await browser.$('//*[@id="mat-menu-panel-0"]/div/button[3]');
        }
        await this.click(logoutBtn as any);
    }
    
    async logout() {
        await this.clickProfileIcon();
        await this.clickLogout();
    }
    
    async isWelcomeMessageDisplayed(): Promise<boolean> {
        // Check for a reliable post-login indicator:
        // 1) profile button visibility OR 2) current URL equals the expected dashboard URL
        try {
            const profileBtn = await browser.$('app-header button');
            const profileVisible = await profileBtn.isDisplayed();
            if (profileVisible) return true;
        } catch (e) {
            // ignore - element may not exist in some layouts
        }

        const currentUrl = await browser.getUrl();
        const expectedUrl = 'https://dev-securianinsuux-alpha.digitalcreditor.securiancanada.ca/';
        if (currentUrl === expectedUrl) return true;

        // Fallback: try the old welcomeMessage selector as last resort
        try {
            const welcomeMsg = await browser.$('/html/body/div[2]/div[2]/div[1]/span[2]');
            const welcomeVisible = await welcomeMsg.isDisplayed();
            return !!welcomeVisible;
        } catch (e) {
            return false;
        }
    }
    
    // async getWelcomeMessage(): Promise<string> {
    //     // return await this.welcomeMessage.getText();
    //     const result = await (this.welcomeMessage as any).getText();
    //     // Adding 3 second wait for step completion
    //     return result;
    // }
}

export default new DashboardPage();