// XF0O2FERESOVR20S
const avKey = 'JG5BTF4B8AXHCCKI';
const newsKey = "203a3bbc12ff4ff18ffdfce847b6f27a";
const avUrl = "//www.alphavantage.co/query?function=GLOBAL_QUOTE&amp;symbol=";
// const newsUrl = "https://newsapi.org/v2/everything?q="

// async function fetchStockData() {
//     // const symbol =  document.getElementById("stockSymbol");
//     // document.getElementById("symbolShow").innerText = symbol.value;
//     // const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${avKey}`;
//     // const stockResponse = await fetch(stockUrl);
//     // const stockData = await stockResponse.json();
//     // const stock = stockData["Global Quote"]
//     // document.getElementById('stockData').innerHTML = stock;
//     const symbol =  "IBM";
//     const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${avKey}`;
//     const stockResponse = await fetch(stockUrl);
//     const stockData = await stockResponse.json();
//     console.log(stockData)
// }
// fetchStockData();
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
        newsToWrap += `<div class="details__news-title"><h3>` + news.articles[i].title + `</h3></div>
        <div class="details__news-desc">`+ news.articles[i].description +`</div>
        <div class="details__news-date"><small>`+ news.articles[i].publishedAt +`</small></div><hr>`
    }
    newsWrapper.innerHTML = newsToWrap;
    // console.log(news.articles[0].title,news.articles[0].description);
};
var detailsElem = document.getElementById('details');
var detailsOpen = document.getElementsByClassName('table__row');

for(let i = 0;i<detailsOpen.length;i++)
    {
        detailsOpen[i].addEventListener('click',function()
        {
            openDetails();
        }
    )};

function openDetails(){
    detailsElem.style.display = 'block';
    fetchNewsData();
}
function closeDetails(){
    detailsElem.style.display = 'none';
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
    }
);