// XF0O2FERESOVR20S
const avKey = 'JG5BTF4B8AXHCCKI';
const newsKey = "203a3bbc12ff4ff18ffdfce847b6f27a";
// const avUrl = "//www.alphavantage.co/query?function=GLOBAL_QUOTE&amp;symbol=";
// const newsUrl = "https://newsapi.org/v2/everything?q="

async function fetchSymbolkData() {
    // const symbol =  "Apple";
    const symbol = document.getElementById("stockSymbol").innerText;
    // const symbol =  document.getElementById("stockSymbol");
    // document.getElementById("symbolShow").innerText = symbol.value;
    // const globalQuotekUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${avKey}`;
    // const globalQuoteResponse = await fetch(globalQuotekUrl);
    // const globalQuoteData = await globalQuoteResponse.json();
    // const globalQuote = globalQuoteData["Global Quote"];
    // document.getElementById("price").innerText = globalQuote["05. price"]
    // document.getElementById("change").innerText = globalQuote["09. change"]
    // document.getElementById("open").innerText = globalQuote["02. open"]
    // document.getElementById("high").innerText = globalQuote["03. high"]
    // document.getElementById("low").innerText = globalQuote[ "04. low"]
    // document.getElementById("volume").innerText = globalQuote["06. volume"]
    // document.getElementById('stockData').innerHTML = stock;
    // const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${avKey}`;
    // const stockResponse = await fetch(stockUrl);
    // const stockData = await stockResponse.json();
    // console.log(stockData)
}
async function fetchNewsData(){
    // const keyword = "Apple";
    const keyword = document.getElementById("stockName").innerText;
    const newsUrl = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${newsKey}&language=en&pageSize=10`;
    
    const newsResponse = await fetch(newsUrl);
    const news = await newsResponse.json();
    const newsWrapper = document.getElementById("newsWrapper");
    let newsToWrap = '';
    for(let i = 0; i<10;i++)
    {
        newsToWrap += `<div class="news__card">
            <a href="`+ news.articles[i].url +`"><div class="news__card-title">` + news.articles[i].title + `</div></a>
            <div class="news__card-desc">`+ news.articles[i].description +`</div>
            <div class="news__card-date"><small>`+ news.articles[i].publishedAt.slice(0,10) +`</small></div>
        </div>`
    }
    newsWrapper.innerHTML = newsToWrap;
    // console.log(news.articles[0].title,news.articles[0].description);
};
var detailsElem = document.getElementById('details');
var detailsOpen = document.getElementsByClassName('table__row');
var overlay = document.getElementById('overlay')

for(let i = 0;i<detailsOpen.length;i++)
    {
        detailsOpen[i].addEventListener('click',function()
        {
            openDetails();
        }
    )};

function openDetails(){
    detailsElem.style.display = 'block';
    overlay.style.display = 'block';
    fetchSymbolkData()
    fetchNewsData();
}
// document.querySelector('.table__row').addEventListener('click',function()
//     {
//         this.classList.toggle('active');
//         detailsElem.style.display = 'block';
//         fetchNewsData();
//     }
// );
document.querySelector('.details__close').addEventListener('click',function()
    {
        detailsElem.style.display = 'none';
        overlay.style.display = 'none';
    }
);