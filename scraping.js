// Imports
const fs = require('fs');
const client = require('https');
const createBrowserless = require('browserless');
const getHTML = require('html-get');
const { JSDOM } = require('jsdom');

// Functions
function getImage (url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}

async function getContent (url) {
    const browserContext = browserlessFactory.createContext();
    const getBrowserless = () => browserContext;
    const result = await getHTML(url, { getBrowserless });
    await getBrowserless((browser) => browser.destroyContext());
    return result;
}

function parse (htmlString) {
    const dom = new JSDOM(htmlString);
    let images = [];
    dom.window.document.querySelector("#mixmoji-content").querySelectorAll("img").forEach((elem) => {
        images.push(elem.src)
    });
    return images
}

async function download (config) {
    let folder_path = `./static/${config.folder_name}`
    if (!fs.existsSync(folder_path)){
        fs.mkdirSync(folder_path);
    }
    getContent(`https://emoji.supply/kitchen/?${config.emoji}`)
    .then(async content => {
        const images = parse(content.html);
        for (let i = 0; i < images.length; i++) {
            await getImage(images[i], `${folder_path}/${i}.png`)
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// Program
const browserlessFactory = createBrowserless();

function run (config) {
    process.on('exit', () => {
        console.log('closing resources!');
        browserlessFactory.close();
    });

    download(config);
}

module.exports = { run }