import { RequestQueue, CheerioCrawler, log } from 'crawlee';

const requestQueue = await RequestQueue.open();
await requestQueue.addRequest({ url: 'https://google.com' });
await requestQueue.addRequest({ url: 'https://c57.fr' });

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
        log.warning('Result:');
        console.log(`The title of "${request.url}" is: ${title}.`);
        websites.push({ url: request.url, title });
    },
});
// Start the crawler and wait for it to finish
await crawler.run(['https://crawlee.dev']);
console.table(websites);
