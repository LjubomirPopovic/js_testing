"use strict";

require ('chromedriver');
const webdriver = require('selenium-webdriver');
const { By, Key, until } = require('selenium-webdriver');
const { assert, expect } = require('chai');
const HomePage = require('../pages/home.page');
const RegisterPage = require('../pages/register.page');

describe('shop.qa.rs tests', function () {
    let driver;
    let pageHomePage;
    let pageRegister;

    before(function () {
        driver = new webdriver.Builder().forBrowser('chrome').build();
        pageHomePage = new HomePage(driver);
        pageRegister = new RegisterPage(driver);
    });

    after(async function() {
        await driver.quit();
    });

    it('Verifies homepage is open', async function() {
        await pageHomePage.goToPage();
        const pageTitle = await pageHomePage.getPageHeaderTitle();
        expect(pageTitle).to.contain('(QA) Shop');
        expect(await pageHomePage.isBugListDivDisplayed()).to.be.true;
    });

    it('Goes to registration page', async function() {
        await pageHomePage.clickOnRegisterLink();
        expect(await pageRegister.getRegisterButtonValue()).to.contain('Register');
        expect(await pageRegister.getCurrentUrl()).to.be.eq('http://shop.qa.rs/register');
    });

    it('Successfully performs registration', async function() {
        await pageRegister.getInputFirstName().sendKeys('Bob');
        await pageRegister.getInputLastName().sendKeys('Bubons');
        await pageRegister.getInputEmail().sendKeys('bob.bubons@example.local');

        await pageRegister.fillInputUsername('bob.bubons');
        await pageRegister.fillInputPassword('nekaLozinka123');
        await pageRegister.fillInputPasswordConfirm('nekaLozinka123');

        await pageRegister.getRegisterButton().click();

        expect(await pageHomePage.getSuccessAlertText()).to.contain('Uspeh!');
    });
});