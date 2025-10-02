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
const ctx = document.getElementById('myChart');
const symbolChart = new Chart(ctx, {
        type: 'line',
        data: {
        labels: [],
        datasets: [{
            data: [],
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
async function stockChartDay() {
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=15min&apikey=${avKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerDay = chartData["Time Series (15min)"];
    var today = new Date();
    var dd = String(today.getDate()-1).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    const chartDayLabels = Object.keys(chartPerDay).toReversed();
    
    const filterDay = chartDayLabels.filter(function(elem){
        if(elem.includes(today))
            return elem
    });
    var filteredDayLabels = []
    for(i=0;i<filterDay.length;i++){
        filteredDayLabels.push(chartPerDay[filterDay[i]])
    }
    const chartDataDaySet = Object.values(filteredDayLabels).map(c => JSON.parse(c["4. close"]));
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение дня';
    symbolChart.data.labels = filterDay;
    symbolChart.data.datasets[0].data = chartDataDaySet;
    symbolChart.update();
    
}   

async function stockChartWeek() {
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${avKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerWeek = chartData["Time Series (Daily)"]

    var lastWeek = [];
    for(i = 0;i < 5;i++){
        var weekDay = new Date()
        var weekDd = String(weekDay.getDate()-i-1).padStart(2, '0');
        var WeekMm = String(weekDay.getMonth() + 1).padStart(2, '0');
            if(weekDd<1)
            {
                weekDd = String(30 + weekDay.getDate()-i-1).padStart(2, '0');
                WeekMm = String(weekDay.getMonth()).padStart(2, '0');
            } 
        var weekYyyy = weekDay.getFullYear();
        dayDate = weekYyyy + '-' + WeekMm + '-' + weekDd;
        lastWeek[i] = dayDate;
        }
        //*даты последней недели

     const chartWeekLabels = Object.keys(chartPerWeek);
        
     let filteredWeek = [];
    for(i = 0; i<lastWeek.length;i++){
        if(chartWeekLabels[i] = lastWeek[i]){
             filteredWeek.push(chartPerWeek[lastWeek[i]])
             if(filteredWeek[i] == undefined)
                 filteredWeek[i] = filteredWeek[i-1]
        }
    }

    const chartDataWeekSet = Object.values(filteredWeek).map(c => JSON.parse(c["4. close"])).toReversed();
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение 5 дней';
    symbolChart.data.labels = lastWeek.toReversed();
    symbolChart.data.datasets[0].data = chartDataWeekSet;
    symbolChart.update();
}

async function stockChartMonth() {
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${avKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerMonth = chartData["Time Series (Daily)"]
    const chartMonthLabels = Object.keys(chartPerMonth)
    chartMonthLabels.length = 30 
    const chartDataMonth = Object.values(chartPerMonth)
    chartDataMonth.length = 30 
    const chartDataMonthSet = Object.values(chartDataMonth).map(c => JSON.parse(c["4. close"])).toReversed();
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение 1 месяца';
    symbolChart.data.labels = chartMonthLabels.toReversed(); //пофиксить значения в labels и dataset для всех последующих функций
    symbolChart.data.datasets[0].data = chartDataMonthSet;
    symbolChart.update();
}

async function stockChart3Months() {
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=IBM&apikey=${avKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPer3Month = chartData["Weekly Time Series"]
    const chart3MonthLabels = Object.keys(chartPer3Month).toReversed()
    chart3MonthLabels.length = 12
    const chartData3Month = Object.values(chartPer3Month).toReversed()
    chartData3Month.length = 12
    const chartData3MonthSet = Object.values(chartData3Month).map(c => JSON.parse(c["4. close"]));
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение 3 месяцев';
    symbolChart.data.labels = chart3MonthLabels;
    symbolChart.data.datasets[0].data = chartData3MonthSet;
    symbolChart.update();
}

async function stockChartYear() {
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=${avKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerYear = chartData["Monthly Time Series"]
    const chartYearLabels = Object.keys(chartPerYear).toReversed()
    chartYearLabels.length = 13
    const chartDataYear = Object.values(chartPerYear).toReversed()
    chartDataYear.length = 13
    const chartDataYearSet = Object.values(chartDataYear).map(c => JSON.parse(c["4. close"]));
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение года';
    symbolChart.data.labels = chartYearLabels;
    symbolChart.data.datasets[0].data = chartDataYearSet;
    symbolChart.update();
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