import { z } from 'zod'
import { createRouter } from '../createRouter'
import chrome from 'chrome-aws-lambda'
import Puppeteer from 'puppeteer-core';

export const terabyteRouter = createRouter()
    .query('getAnuncios', {
        input: z.object({
            search: z.string(),
        }),
        async resolve({input}){
            const options = process.env.AWS_REGION ? {
                args: chrome.args,
                executablePath: await chrome.executablePath,
                headless: chrome.headless
            } : {
                args: [],
                executablePath:
                    process.platform === 'win32' ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : 
                    process.platform === 'linux' ? '/usr/bin/google-chrome' : 
                    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            };
            const browser = await Puppeteer.launch(options);
            const terabyteAnuncios = await getTerabyteAnuncios(browser, input);
            return terabyteAnuncios
        }
    })

const getTerabyteAnuncios = async (browser:Puppeteer.Browser, input:{search:string}) => {
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto(`https://www.terabyteshop.com.br/busca?str=${input.search}`,{
        waitUntil:'networkidle2'
    });
    const terabyteAnuncios = await page.evaluate(() => {
        const titleArray = []
        const precoArray = []
        const hrefArray = []
        const imgSrcArray = []
        let a: HTMLAnchorElement | null
        let b: HTMLImageElement | null
        let c: HTMLDivElement | null
        for(let i=1; i<=10; i++){
            a = document.querySelector(`#prodarea > div:nth-child(${i*2}) > div > a`);
            b = document.querySelector(`#prodarea > div:nth-child(${i*2}) > div > a > div.commerce_columns_item_image.text-center > img`);
            c = document.querySelector(`#prodarea > div:nth-child(${i*2}) > div > div.commerce_columns_item_info > div:nth-child(1) > div.prod-new-price > span`)
            titleArray.push(a?.getAttribute('title'));
            hrefArray.push(a?.getAttribute('href'));
            imgSrcArray.push(b?.getAttribute('src'));
            precoArray.push(c?.innerText);
        }
        return {titleArray, precoArray, hrefArray, imgSrcArray};
    })
    await page.close();
    await browser.close();
    return terabyteAnuncios;
}