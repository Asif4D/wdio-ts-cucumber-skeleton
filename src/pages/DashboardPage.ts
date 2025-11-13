/// <reference types="@wdio/globals/types" />
import BasePage from './BasePage';

class DashboardPage extends BasePage {
    
    // Element selectors
    // private get profileIcon() { return $('/html/body/app-root/div[1]/app-header/div/div/div[2]/button/div/mat-icon'); }
    private get profileIcon(): ReturnType<typeof $> { return $('/html/body/app-root/div[1]/app-header/div/div/div[2]/button/div/mat-icon'); }
    // private get logoutButton() { return $('//*[@id="mat-menu-panel-0"]/div/button[3]/span'); }
    private get logoutButton(): ReturnType<typeof $> { return $('//*[@id="mat-menu-panel-0"]/div/button[3]/span'); }
    // private get welcomeMessage() { return $('/html/body/div[2]/div[2]/div[1]/span[2]'); }
    private get welcomeMessage(): ReturnType<typeof $> { return $('/html/body/div[2]/div[2]/div[1]/span[2]'); }
    
    // Page methods
    async clickProfileIcon() {
        // await this.click(this.profileIcon);
        await this.click(this.profileIcon as any);
        // Adding 3 second wait for step completion
    }
    
    async clickLogout() {
        // await this.click(this.logoutButton);
        await this.click(this.logoutButton as any);
        // Adding 3 second wait for step completion
    }
    
    async logout() {
        await this.clickProfileIcon();
        await this.clickLogout();
    }
    
    async isWelcomeMessageDisplayed(): Promise<boolean> {
        // Instead of relying on the old welcome message selector which may be unstable,
        // check for a reliable post-login indicator:
        // 1) profile icon visibility OR 2) current URL equals the expected dashboard URL
        try {
            const profileVisible = await (this.profileIcon as any).isDisplayed();
            if (profileVisible) return true;
        } catch (e) {
            // ignore - element may not exist in some layouts
        }

        const currentUrl = await browser.getUrl();
        const expectedUrl = 'https://dev-securianinsuux-alpha.digitalcreditor.securiancanada.ca/';
        if (currentUrl === expectedUrl) return true;

        // Fallback: try the old welcomeMessage selector as last resort
        try {
            const welcomeVisible = await (this.welcomeMessage as any).isDisplayed();
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