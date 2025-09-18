// const detailsElem = document.querySelector('.details');
// document.querySelector('.table__row').addEventListener('click',function()
//     {
//         this.classList.toggle('active');
//         detailsElem.style.display = 'flex';
//     }
// );
// document.querySelector('.details__close').addEventListener('click',function()
//     {
//         detailsElem.style.display = 'none';
//     }
// );
// XF0O2FERESOVR20S
const avKey = 'JG5BTF4B8AXHCCKI';
const newsKey = "203a3bbc12ff4ff18ffdfce847b6f27a";
const avUrl = "//www.alphavantage.co/query?function=GLOBAL_QUOTE&amp;symbol=";
const newsUrl = "https://newsapi.org/v2/everything?q="

async function fetchStockData() {
    // const symbol =  document.getElementById("stockSymbol");
    // document.getElementById("symbolShow").innerText = symbol.value;
    // const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${avKey}`;
    // const stockResponse = await fetch(stockUrl);
    // const stockData = await stockResponse.json();
    // const stock = stockData["Global Quote"]
    // document.getElementById('stockData').innerHTML = stock;
    const symbol =  "IBM";
    const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${avKey}`;
    const stockResponse = await fetch(stockUrl);
    const stockData = await stockResponse.json();
    console.log(stockData)
}
fetchStockData();
