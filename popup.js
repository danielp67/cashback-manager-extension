let label = ["website", "thecorner", "macif", "igraal", "widilo", "poulpeo"]
let count = 0

// fetch data from api cashback
async function fetchData() {

    const res = await fetch('./database/data.json');
    const json = await res.json();
    const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const url = await tabs[0].url;
    let jsonMacif = false
    let jsonIgraal = false
    let jsonWidilo = false
    let jsonPoulpeo = false
    let keyword = url.replace(/.+\/\/|www.|\..+/g, '')
    const urlMacif = 'https://04598namy7-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia for JavaScript (3.35.1); Browser (lite); instantsearch.js (4.1.1); JS Helper (3.0.0) &x-algolia-application-id=04598NAMY7&x-algolia-api-key=177bd75e88473d01178ae570be03bf17'
    const urlIgraal = 'https://fr.igraal.com/ajax/search?limitMerchants=2&limitVouchers=0&limitCoupons=0&term='
    const urlWidilo = 'https://www.widilo.fr/api/search?searchtext='
    const urlPoulpeo = 'https://www.poulpeo.com/async/search?q='

    jsonMacif = await fetch(urlMacif, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },

        body: JSON.stringify(
            {"requests":[{"indexName":"macif_avantages","params":"query=" +
                       keyword + "&maxValuesPerFacet=10&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&facets=%5B%22tags%22%5D&tagFilters="},{"indexName":"macif_flashsales","params":"query= " + keyword + "&maxValuesPerFacet=10&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&facets=%5B%22tags%22%5D&tagFilters="}]}
        )

    })
        .then(response => response.json())
        .then(response => {
            return response["results"] != null ? response["results"][0]["nbHits"] > 0 : false;
        })

    jsonIgraal = await fetch(urlIgraal + keyword, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },

    })
        .then(response => response.json())
        .then(response => {
            return response["merchant"] != null ? response["merchant"].length > 0 : false;

        })

    jsonWidilo = await fetch(urlWidilo + keyword, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },

    })
        .then(response => response.json())
        .then(response => {
            return response["shops"] != null ? response["shops"].length > 0 : false;
        })


    jsonPoulpeo = await fetch(urlPoulpeo + keyword, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },

    })
        .then(response => response.json())
        .then(response => {
            return response != null ? response.length > 0 : false;
        })

    return [keyword, json, jsonMacif, jsonIgraal, jsonWidilo, jsonPoulpeo]
}


fetchData()
    // log response or catch error of fetch promise
    .then((data) => {
        const keyword = data[0]
        const title = data[0].charAt(0).toUpperCase() + data[0].slice(1)
        const json = data[1]
        let shops = [keyword, false, data[2], data[3], data[4], data[5]]

        document.getElementById(label[0]).innerHTML = title

        for (let i = 0; i < json.length; i++) {
            if (keyword.includes(json[i].url)) {
                shops[1] = true
            }
        }
        return shops

    }).then(shops => {

    for (let j = 1; j < label.length; j++) {
        document.getElementById(label[j]).innerHTML = "<img src='./images/remove.png' width=\'30px\' height=\'30px\'>";
        if (shops[j] === true) {
            count++
            document.getElementById(label[j]).innerHTML = "<img src='./images/yes.png' width=\'30px\' height=\'30px\'>";
        }
    }

    return count
})
    .catch((reason) => console.log("Message:" + reason.message));



/*
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'hello!') {
            console.log(request.url) // new url is now in content scripts!
        }
    });
*/


