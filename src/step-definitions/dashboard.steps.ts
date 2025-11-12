/// <reference types="@wdio/globals/types" />
import { Given, When, Then } from '@wdio/cucumber-framework';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import { expect } from 'chai';
import dotenv from 'dotenv';

dotenv.config();

Given(/^I am logged in to the application$/, async () => {
    const email = process.env.TEST_USER_EMAIL || 'testadmin@coastcapitalsavings.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test12345!';
    await LoginPage.openLoginPage();
    await LoginPage.login(email, password);
});
When(/^I click on the profile icon$/, async () => {
    await DashboardPage.clickProfileIcon();
});

When(/^I click on the logout button$/, async () => {
    await DashboardPage.clickLogout();
});

Then(/^I should be redirected to the login page$/, async () => {
    // Verify we're back on login page by checking the email input is visible
    const displayed = await browser.$('//input[@id="email"]').isDisplayed();
    expect(displayed).to.be.true;
});