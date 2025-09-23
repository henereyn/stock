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
    const newsUrl = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${newsKey}&language=ru&pageSize=1`;
    
    const newsResponse = await fetch(newsUrl);
    const news = await newsResponse.json();
    document.getElementById('newsTitle').innerText = news.articles['0'].title;
    document.getElementById('newsDesc').innerText = news.articles['0'].description;
    // console.log(news.articles['0'].title,news.articles['0'].description);
};

const detailsElem = document.querySelector('.details');
document.querySelector('.table__row').addEventListener('click',function()
    {
        this.classList.toggle('active');
        detailsElem.style.display = 'block';
        fetchNewsData();
    }
);
document.querySelector('.details__close').addEventListener('click',function()
    {
        detailsElem.style.display = 'none';
    }
);