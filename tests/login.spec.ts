import { expect, test } from "@playwright/test";

test('the user types wrong password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/v1/');
    await expect(await page.title()).toBe('Swag Labs');

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('wrong)password');
    await page.locator('[class="btn_action"]').click();

    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
});

test('the user logs in with success', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/v1/');
    await expect(await page.title()).toBe('Swag Labs');

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[class="btn_action"]').click();

    const productTitle = await page.locator('[class="product_label"]');
    await expect(productTitle).toHaveText('Products');
});

test('the user adds an item to the cart from the main page', async ({ page }) => {
    await login({ page });

    const addCart = page.locator('//div[@id="inventory_container"]/div/div[1]/div[contains(@class, "pricebar")]/button');

    await addCart.click();
    await page.locator('[data-icon="shopping-cart"]').click();

    expect(page.url()).toBe('https://www.saucedemo.com/v1/cart.html');
    
    const cartLabel = await page.locator(('//*[@id="contents_wrapper"]/div[2]'));
    await expect(cartLabel).toHaveText('Your Cart');
});

test('the user adds an item to the cart from the item detail page', async ({ page }) => {
    await login({ page });
    await itemDetail ({ page });
    
    const addItemButton = page.locator('[class="btn_primary btn_inventory"]');
    await addItemButton.click();

    await page.locator('[data-icon="shopping-cart"]').click();

    expect(page.url()).toBe('https://www.saucedemo.com/v1/cart.html');
    
    const cartLabel = await page.locator(('//*[@id="contents_wrapper"]/div[2]'));
    await expect(cartLabel).toHaveText('Your Cart');

});

test('the user sees the detail of an item', async ({ page }) => {
    await login({ page });

    const item = page.locator('//*[@id="item_4_title_link"]/div');
    await item.click();

    await expect(page.locator('[class="inventory_details_name"]')).toBeVisible();
    await expect(page.locator('[class="inventory_details_price"]')).toBeVisible();
    await expect(page.locator('[class="inventory_details_desc"]')).toBeVisible();
});



async function login({ page }) {
    await page.goto('https://www.saucedemo.com/v1/');
    await expect(await page.title()).toBe('Swag Labs');

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[class="btn_action"]').click();
}

async function itemDetail({ page }) {
    await login({ page });

    const item = page.locator('//*[@id="item_4_title_link"]/div');
    await item.click();
}