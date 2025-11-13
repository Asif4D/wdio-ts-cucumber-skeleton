/// <reference types="@wdio/globals/types" />
import { Given, When, Then } from '@wdio/cucumber-framework';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import { expect } from 'chai';
import dotenv from 'dotenv';

dotenv.config();

Given(/^I am on the login page$/, async () => {
    await LoginPage.openLoginPage();
});

When(/^I enter email "([^"]*)" and password "([^"]*)"$/, async (email: string, password: string) => {
    await LoginPage.enterEmail(email);
    await LoginPage.enterPassword(password);
});

When(/^I click on the login button$/, async () => {
    await LoginPage.clickLogin();
});

Then(/^I should be redirected to the dashboard$/, async () => {
    const displayed = await DashboardPage.isWelcomeMessageDisplayed();
    expect(displayed).to.be.true;
});