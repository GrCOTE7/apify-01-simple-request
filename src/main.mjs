import { RequestQueue, CheerioCrawler, log } from 'crawlee';

log.setLevel(log.LEVELS.WARNING); // Uncomment to see INFO logs
const tableResult = 1; // 0 for textual result


// Create queue and add our urls to it
const requestQueue = await RequestQueue.open();
const urls = ['https://crawlee.dev', 'https://google.com', 'https://c57.fr'];

for (const url of urls) {
    await requestQueue.addRequest({ url });
}

// Create the crawler and add the queue with our URL
// and a request handler to process the page.
let websites = [];
const crawler = new CheerioCrawler({
    requestQueue,
    // The `$` argument is the Cheerio object
    // which contains parsed HTML of the website.
    async requestHandler({ $, request }) {
        // Extract <title> text with Cheerio.
        // See Cheerio documentation for API docs.
        const title = $('title').text();
        if (!tableResult) {
            log.info('Result:');
            console.log(`The title of "${request.url}" is: ${title}.`);
        }
        websites.push({ url: request.url.slice(8), title });
    },
});
// Start the crawler and wait for it to finish
await crawler.run(['https://apify.com']);

websites.sort((a, b) => a.url.localeCompare(b.url));
if (tableResult) console.table(websites);
