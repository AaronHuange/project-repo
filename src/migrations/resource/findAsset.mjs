import { readFile, writeFile } from 'fs/promises';

const assetReg = /(https:\/\/cloud-service[-\\.\d\w\/]*)/g;

let text = await readFile('./components_2023_06_30.sql', { encoding: 'utf8' })
let text2 = await readFile('./form_templates_2023_06_30.sql', { encoding: 'utf8' })

const urlsSet = new Set();
const urlsSetAdd = (url) => {
  const i = url.indexOf('ts/');
  urlsSet.add(url.substring(0, i + 35));
}

if (text) {
  text.match(assetReg)
    ?.forEach(urlsSetAdd)
}
if (text2) {
  text2.match(assetReg)
    ?.forEach(urlsSetAdd)
}

console.info('Array.from(urlsSet.values())', Array.from(urlsSet.values()));

Array.from(urlsSet.values())
  .forEach((url) => {
    const key = url.substring(url.lastIndexOf("/") + 1);
    const newUrl = `https://lxcloud-static.oss-cn-shanghai.aliyuncs.com/img/paas/form-template/${key}.png`;

    console.info(url, newUrl);
    text = text.replace(url, newUrl)
    text2 = text2.replace(url, newUrl)
  })

await writeFile('./components_2023_06_30.sql', text);
await writeFile('./form_templates_2023_06_30.sql', text2);
