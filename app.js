// XF0O2FERESOVR20S
const avKey = 'JG5BTF4B8AXHCCKI';
const newsKey = "203a3bbc12ff4ff18ffdfce847b6f27a";
// const avUrl = "//www.alphavantage.co/query?function=GLOBAL_QUOTE&amp;symbol=";
// const newsUrl = "https://newsapi.org/v2/everything?q="
async function getStockSymbols(){
    const ibmSymbol = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=${avKey}`;
    const ibmResponse = await fetch(ibmSymbol);
    const ibmData = await ibmResponse.json();
    const ibm = ibmData["Global Quote"];
    document.getElementById("stockSymbol").innerText = ibm["01. symbol"];
    document.getElementById("stockPrice").innerText = ibm["05. price"]
    document.getElementById("stockChange").innerText = ibm["09. change"]+' '+ibm["10. change percent"];
    document.getElementById("stockVolume").innerText = ibm["06. volume"];
}
getStockSymbols();
async function fetchSymbolkData() {
    // const symbol =  "Apple";
    const symbol = document.getElementById("stockSymbol").innerText;
    const globalQuotekUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${avKey}`;
    const globalQuoteResponse = await fetch(globalQuotekUrl);
    const globalQuoteData = await globalQuoteResponse.json();
    const globalQuote = globalQuoteData["Global Quote"];
    document.getElementById("symbol").innerText = globalQuote["01. symbol"]
    document.getElementById("price").innerText = globalQuote["05. price"]
    document.getElementById("change").innerText = globalQuote["09. change"]
    document.getElementById("open").innerText = globalQuote["02. open"]
    document.getElementById("high").innerText = globalQuote["03. high"]
    document.getElementById("low").innerText = globalQuote[ "04. low"]
    document.getElementById("volume").innerText = globalQuote["06. volume"]

    // console.log(news.articles[0].title,news.articles[0].description);
};
    // document.getElementById('stockData').innerHTML = stock;
    // const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${avKey}`;
    // const stockResponse = await fetch(stockUrl);
    // const stockData = await stockResponse.json();
    // console.log(stockData)
// }
async function stockChartDay() {
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=15min&apikey=${avKey}`;
    const chartUrlResponse = await fetch(chartUrl);
    const chartData = await chartUrlResponse.json();
    const chart = chartData["Time Series (15min)"];
    var today = new Date();
    var dd = String(today.getDate()-1).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    const chartDataLabels = Object.keys(chart).toReversed();
    
    const dateFilter = chartDataLabels.filter(function(elem){
        if(elem.includes(today))
            return elem
    });
    const chartDataFiltered = []
    for(i=0;i<dateFilter.length;i++){
        chartDataDots.push(chart[dateFilter[i]])
    }
    aler
    const chartDataDots = Object.values(chartDataFiltered).map(c => JSON.parse(c["4. close"])).toReversed()
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'line',
        data: {
        labels: chartDataLabels,
        datasets: [{
            data: chartDataDots,
            borderWidth: 1
        }]
        },
        options: {
        scales: {
            y: {
            beginAtZero: false
            }
        }
        }
    });
}   
async function stockChartWeek() {
    
}
async function stockChartMonth() {
    
}
async function stockChartYear() {
    
}
async function fetchNewsData(){
    // const keyword = "Apple";
    const keyword = document.getElementById("stockSymbol").innerText;
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
}  
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
    stockChartDay();
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