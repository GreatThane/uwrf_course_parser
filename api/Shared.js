import puppeteer from 'puppeteer';
import * as util from "util";
import * as fs from "fs/promises";

Date.prototype.toJSON = function () {
    return this.toLocaleDateString();
}

const browser = await puppeteer.launch({ headless: "new" });
export const [page] = await browser.pages();

export async function terminate(code, message) {
    await browser.close();
    if (message) {
        if (code === 0) {
            // Swap these to make debugging the result object a lot easier
            console.log(JSON.stringify(message));
            // console.log(util.inspect(message, false, null, true));
        } else console.error(message);
    }
    process.exit(code);
}