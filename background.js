let label = ["website", "thecorner", "macif", "igraal", "widilo", "poulpeo"];

async function fetchData() {
  try {
    const res = await fetch(chrome.runtime.getURL('database/data.json'));
    const localDB = await res.json();
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const urlObj = new URL(tab.url);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    const keyword = hostname.split('.')[0];

    const urlMacif = 'https://04598namy7-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1);%20Browser%20(lite);%20instantsearch.js%20(4.1.1);%20JS%20Helper%20(3.0.0)&x-algolia-application-id=04598NAMY7&x-algolia-api-key=177bd75e88473d01178ae570be03bf17';

    const [macif, igraal, widilo, poulpeo] = await Promise.all([
      fetch(urlMacif, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              indexName: "macif_avantages",
              params: `query=${keyword}&maxValuesPerFacet=10&facets=["tags"]&tagFilters=`
            },
            {
              indexName: "macif_flashsales",
              params: `query=${keyword}&maxValuesPerFacet=10&facets=["tags"]&tagFilters=`
            }
          ]
        })
      }).then(r => r.json()).then(res => res?.results?.[0]?.nbHits > 0 || false),

      fetch(`https://fr.igraal.com/ajax/search?limitMerchants=2&limitVouchers=0&limitCoupons=0&term=${keyword}`)
        .then(r => r.json()).then(res => res?.merchant?.length > 0 || false),

      fetch(`https://www.widilo.fr/api/search?searchtext=${keyword}`)
        .then(r => r.json()).then(res => res?.shops?.length > 0 || false),

      fetch(`https://www.poulpeo.com/async/search?q=${keyword}`)
        .then(r => r.json()).then(res => Array.isArray(res) && res.length > 0)
    ]);

    const thecorner = localDB.some(entry => keyword.includes(entry.url));

    return {
      keyword,
      platforms: { thecorner, macif, igraal, widilo, poulpeo }
    };
  } catch (err) {
    console.error("FetchData error:", err);
    return {
      keyword: "",
      platforms: {
        thecorner: false, macif: false, igraal: false, widilo: false, poulpeo: false
      }
    };
  }
}

// Communication avec popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getCashback") {
    fetchData().then(sendResponse);
    return true;
  }
});
