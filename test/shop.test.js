"use strict";

require ('chromedriver');
const webdriver = require('selenium-webdriver');
const { By, Key, until } = require('selenium-webdriver');
const { assert, expect } = require('chai');
const HomePage = require('../pages/home.page');
const RegisterPage = require('../pages/register.page');
const LoginPage = require('../pages/login.page');
const CartPage = require('../pages/cart.page');

describe('shop.qa.rs tests', function () {
    let driver;
    let pageHomePage;
    let pageRegister;
    let pageLogin;
    let pageCart;

    const packageToAdd = 'starter';
    const packageQuantity = '2';

    before(function () {
        driver = new webdriver.Builder().forBrowser('chrome').build();
        pageHomePage = new HomePage(driver);
        pageRegister = new RegisterPage(driver);
        pageLogin = new LoginPage(driver);
        pageCart = new CartPage(driver);
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
        await pageRegister.getInputLastName().sendKeys('Bunons');
        await pageRegister.getInputEmail().sendKeys('bob.bunons@example.local');

        await pageRegister.fillInputUsername('bob.bunons');
        await pageRegister.fillInputPassword('nekaLozinka123');
        await pageRegister.fillInputPasswordConfirm('nekaLozinka123');

        await pageRegister.getRegisterButton().click();

        //expect(await pageHomePage.getSuccessAlertText()).to.contain('Uspeh!');
    });

    it('Goes to login page and performs login', async function() {
        await pageLogin.goToPage();

        await pageLogin.fillInputUsername('bob.bunons');
        await pageLogin.fillInputPassword('nekaLozinka123');

        await pageLogin.clickLoginButton();

        expect(await pageHomePage.getWelcomeBackTittle()).to.contain('Welcome back');
        expect(await pageHomePage.isLogoutLinkDisplayed()).to.be.true;
    });

    it('Adds item(s) to cart', async function() {
       const packageDiv = await pageHomePage.getPackageDiv(packageToAdd);
       const quantity = await pageHomePage.getQuantityDropdown(packageDiv);
       const options = await pageHomePage.getQuantityOptions(quantity);

       await Promise.all(options.map(async function(option) {
           const text = await option.getText();

           if (text === packageQuantity) {
               await option.click();

               const selectedValue = await quantity.getAttribute('value');
               expect(selectedValue).to.contain(packageQuantity);

               await pageHomePage.getOrderButton(packageDiv).click();
               expect(await driver.getCurrentUrl()).to.contain('http://shop.qa.rs/order');
           }
       }))
    });

    it('Opens shopping cart', async function() {
        await pageHomePage.clickOnViewShoppingCartLink();

        expect(await pageCart.getCurrentUrl()).to.be.eq('http://shop.qa.rs/cart');
        expect(await pageCart.getPageHeaderTitle()).to.contain('Order');
    });

    it('Verifies item(s) in cart', async function() {
        const orderRow = await pageCart.getOrderRow(packageToAdd.toUpperCase());
        const orderQuantity = await pageCart.getOrderQuantity(orderRow);

        expect(await orderQuantity.getText()).to.eq(packageQuantity);
    });

    it('Performs logout', async function() {
        await pageHomePage.clickOnLogoutLink();
        expect(await pageHomePage.isLoginLinkDisplayed()).to.be.true;
    });
});