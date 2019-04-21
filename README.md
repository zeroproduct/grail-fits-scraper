# grail-fits-scraper
Needed a bunch of outfit images as seed data for a separate project. Uses [puppeteer](https://github.com/GoogleChrome/puppeteer) to crawl and fetch images from Grail Fits articles (ex: https://www.grailed.com/drycleanonly/grail-fits-131). Exports a `fits.json` file with structure described below.

### How to run
```sh
$ cd grails-fit-scraper
$ npm install
$ npm run scrape -- <range> 
# ex: 100-120, defaults to 130-131
```

### Generates `fits.json` in src/
```json
{
  "data": [
    { 
      "title": "user1", 
      "src": "srcToImg1"
    },
    { 
      "title": "user2", 
      "src": "srcToImg2"
    }
  ],
  "error": ""
}
```