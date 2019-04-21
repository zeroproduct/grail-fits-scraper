const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  let [fromArticle, toArticle] = process.argv[2].match(/^\d+\-\d+$/g) ? process.argv[2].split('-') : ['130', '131'];
  let allFitsData = [];
  let fitsObject = { data: [], error: '' };

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    console.log(`[ Scraping Grail Fits Articles ${fromArticle} to ${toArticle} ]`);
    // Start from latest article and scrape backwards to get latest data first
    for (let i = parseInt(toArticle); i >= parseInt(fromArticle); i--) {
      console.log(`Scraping Grail Fits ${i}`);
      let fitsData = [];

      await page.goto(`https://www.grailed.com/drycleanonly/grail-fits-${i}`, {waitUntil: 'networkidle0'});
      await page.waitForSelector('.looks-wrapper');
    
      const fitsTitles = await page.evaluate(() => {
        const titles = Array.from(document.querySelectorAll('.look > .title'));
        return titles.map(title => title.innerHTML);
      });
    
      const fitsImgSrcs = await page.evaluate(() => {
        const imgSrcs = Array.from(document.querySelectorAll('.look > .looks-section-image > .hero'));
        return imgSrcs.map(img => img.src);
      });
    
      for (let i = 0; i < fitsTitles.length; i++) {
        if (fitsImgSrcs[i] !== '') {
          let title = fitsTitles[i].slice(1, -1); // Remove newlines from title
          let src = fitsImgSrcs[i].split('/compress/')[1]; // Clean up URL
          fitsData.push({ title, src });
        }
      }

      allFitsData = [...allFitsData, ...fitsData];
    }
    fitsObject.data = allFitsData;
  } catch (e) {
    fitsObject.error = 'Error scraping data!';
    throw(e);
  }
  fs.writeFile('src/fits.json', JSON.stringify(fitsObject), err => { err ? console.log(err) : console.log('Success') });
  
  await browser.close();
})();