import { RequestQueue, CheerioCrawler, log } from 'crawlee';

// Uncomment the line above to see INFO logs
// Décommentez la ligne ci-dessous pour voir les journaux INFO
log.setLevel(log.LEVELS.WARNING);

// 0 for textual result
// 0 pour un résultat textuel
const tableResult = 1;


// Create queue and add your URLs to it
// Créez une file d'attente et ajoutez vos URLs à celle-ci
const requestQueue = await RequestQueue.open();
const urls = ['https://crawlee.dev', 'https://google.com', 'https://c57.fr'];

for (const url of urls) {
    await requestQueue.addRequest({ url });
}

// Create the crawler and add the queue with our URL and a request handler to process the page.
// Créez le crawler et ajoutez la file d'attente avec notre URL et un gestionnaire de requêtes pour traiter la page.
let websites = [];
const crawler = new CheerioCrawler({
    requestQueue,
    // The `$` argument is the Cheerio object which contains parsed HTML of the website.
    // L'argument `$` est l'objet Cheerio qui contient le HTML analysé du site Web.
    async requestHandler({ $, request }) {
        // Extract <title> text with Cheerio. See Cheerio documentation for API docs.
        // Extrait le texte <title> avec Cheerio. Voir la documentation de Cheerio pour les docs de l'API.
        const title = $('title').text();
        if (!tableResult) {
            log.info('Result:');
            console.log(`The title of "${request.url}" is: ${title}.`);
        }
        websites.push({ url: request.url.slice(8), title });
    },
});
// Start the crawler and wait for it to finish
// Démarre le crawler et attendez qu'il termine
await crawler.run(['https://apify.com']);

// Show result as table, sorting by URL, without 'https://'
// Affiche le résultat sous forme de tableau, trié par URL, sans le 'https://'
websites.sort((a, b) => a.url.localeCompare(b.url));
if (tableResult) console.table(websites);
