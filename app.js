const avKey = 'JG5BTF4B8AXHCCKI';
const newsKey = "203a3bbc12ff4ff18ffdfce847b6f27a";
const ninjaApiKey = "D0oar+GVifLPv3Uso+w7bw==ZD2btbpinAr9WsCd";
const polygonApiKey = "3KtCYpgimlWriDKLJa11M2WaYljpqxkP";
function shortNum(n) {
	return n.toString()
        .replace(/(\d)(\d)\d{8}$/, "$1.$2B")
		.replace(/(\d)(\d)\d{5}$/, "$1.$2M")
		.replace(/(\d)(\d)\d{2}$/, "$1.$2K");
    }
var chartSymbol = ''
var tableContent = document.getElementById("mainTable")
async function getStockSymbols(){
    const options = {
        method: "GET",
        headers: {
            "X-Api-Key" : ninjaApiKey
        }
    }
    const apiSpUrl = "https://api.api-ninjas.com/v1/sp500";

        const response  = await fetch(apiSpUrl,options)
        const data = await response.json();
        data.length = 3

        for(let i = 0; i<data.length; i++){
            const apiPriceUrl = `https://api.polygon.io/v2/aggs/ticker/${data[i]["ticker"]}/prev?adjusted=true&apiKey=${polygonApiKey}`
            const priceResponse = await fetch(apiPriceUrl);
            const priceData = await priceResponse.json();
            const price = priceData["results"][0]
            const apiChangeUrl =  `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${data[i]["ticker"]}&apikey=${avKey}`;
            const changeResponse = await fetch(apiChangeUrl);
            const changeData = await changeResponse.json();
            const change = changeData["Global Quote"]
            tableContent.innerHTML += 
            `<div class="table__row" id="row" onclick="openDetails('${data[i]["ticker"]}')">
                    <div class="table__index" id="stockSymbol">
                        `+data[i]["ticker"]+`
                    </div>
                    <div class="table__name" >
                        `+data[i]["company_name"]+`
                    </div>
                    <div class="table__price">
                        `+price["c"]+ ` $
                    </div>
                    <div class="table__pricediff">
                        `+parseFloat(symbolData["09. change"]).toFixed(2)+` $`+` `+symbolData["10. change percent"]+`
                    </div>
                    <div class="table__volume">
                        `+shortNum(price["v"])+`
                    </div>
                </div>`
            var change = document.getElementsByClassName('table__pricediff')
            for(i = 0;i < change.length; i++)
            {
                if(symbolData["09. change"]>= 0)
                {
                    change[i].style.color = 'green'
                }
                else
                {
                    change[i].style.color = 'red'
                }
            }
        }
        
    }
getStockSymbols();
async function searchSymbol() {
    const symbol = document.getElementById('search__symbol').value;
    tableContent.innerHTML = ''
    const searchRequest = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${avKey}`
    const searhcResponse = await fetch(searchRequest);
    const searchData = await searhcResponse.json()
    const search = searchData["bestMatches"]
    if(search == ''){
        alert('По вашему запросу ничего не найдено')
    }
    for (let i = 0; i < search.length; i++) {
        const searchSymbol = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search[i]["1. symbol"]}&apikey=${avKey}`;
        const searchSymbolesponse = await fetch(searchSymbol);
        const searchSymbolData = await searchSymbolesponse.json();
        const symbolData = searchSymbolData["Global Quote"];
      
        tableContent.innerHTML += 
        `<div class="table__row" id="row" onclick="openDetails('${search[i]["1. symbol"]}')">
            <div class="table__index" id="stockSymbol">
                `+search[i]["1. symbol"]+
            `</div>
            <div class="table__name">
                `+search[i]["2. name"]+`
            </div>
            <div class="table__price">
                `+parseFloat(symbolData["05. price"]).toFixed(2)+` $
            </div>
            <div class="table__pricediff">
                `+parseFloat(symbolData["09. change"]).toFixed(2)+` $`+` `+symbolData["10. change percent"]+
            `</div>
            <div class="table__volume" id="stockVolume">
                `+shortNum(symbolData["06. volume"])+
            `</div>
        </div`
        var change = document.getElementsByClassName('table__pricediff')
        for(i = 0;i < change.length; i++)
        {
            if(symbolData["09. change"]>= 0)
            {
                change[i].style.color = 'green'
            }
            else
            {
                change[i].style.color = 'red'
            }
        }
        
    }
    
}
async function fetchSymbolkData(symbolId) {
    chartSymbol = symbolId;
    const globalQuotekUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${chartSymbol}&apikey=${avKey}`;
    const globalQuoteResponse = await fetch(globalQuotekUrl);
    const globalQuoteData = await globalQuoteResponse.json();
    const globalQuote = globalQuoteData["Global Quote"];
    document.getElementById("symbol").innerText = globalQuote["01. symbol"]
    document.getElementById("price").innerText = parseFloat(globalQuote["05. price"]).toFixed(2) + ' $'
    document.getElementById("change").innerText = parseFloat(globalQuote["09. change"]).toFixed(2) + ' %'
    document.getElementById("open").innerText = parseFloat(globalQuote["02. open"]).toFixed(2) + ' $'
    document.getElementById("high").innerText = parseFloat(globalQuote["03. high"]).toFixed(2) + ' $'
    document.getElementById("low").innerText = parseFloat(globalQuote[ "04. low"]).toFixed(2) + ' $'
    document.getElementById("volume").innerText = shortNum(globalQuote["06. volume"])
};

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
    

    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${chartSymbol}&interval=15min&apikey=${avKey}`;
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
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${chartSymbol}&apikey=${avKey}`;
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
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${chartSymbol}&apikey=${avKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerMonth = chartData["Time Series (Daily)"]
    const chartMonthLabels = Object.keys(chartPerMonth)
    chartMonthLabels.length = 22 
    const chartDataMonth = Object.values(chartPerMonth)
    chartDataMonth.length = 22 
    const chartDataMonthSet = chartDataMonth.map(c => JSON.parse(c["4. close"])).toReversed();
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение 1 месяца';
    symbolChart.data.labels = chartMonthLabels.toReversed();
    symbolChart.data.datasets[0].data = chartDataMonthSet;
    symbolChart.update();
}

async function stockChart3Months() {
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${chartSymbol}&apikey=${avKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPer3Month = chartData["Weekly Time Series"]
    const chart3MonthLabels = Object.keys(chartPer3Month)
    chart3MonthLabels.length = 14
    const chartData3Month = Object.values(chartPer3Month)
    chartData3Month.length = 14
    const chartData3MonthSet = Object.values(chartData3Month).map(c => JSON.parse(c["4. close"])).toReversed();
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение 3 месяцев';
    symbolChart.data.labels = chart3MonthLabels.toReversed();
    symbolChart.data.datasets[0].data = chartData3MonthSet;
    symbolChart.update();
}

async function stockChartYear() {
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${chartSymbol}&apikey=${avKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerYear = chartData["Monthly Time Series"]
    const chartYearLabels = Object.keys(chartPerYear)
    chartYearLabels.length = 13
    const chartDataYear = Object.values(chartPerYear)
    chartDataYear.length = 13
    const chartDataYearSet = Object.values(chartDataYear).map(c => JSON.parse(c["4. close"])).toReversed();
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение года';
    symbolChart.data.labels = chartYearLabels.toReversed();
    symbolChart.data.datasets[0].data = chartDataYearSet;
    symbolChart.update();
}
async function fetchNewsData(symbolId){
    const keyword = symbolId;
    const newsUrl = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${newsKey}&language=en&pageSize=10`;
    
    const newsResponse = await fetch(newsUrl);
    const news = await newsResponse.json();
    const newsWrapper = document.getElementById("newsWrapper");
    let newsToWrap = '';
    for(let i = 0; i<10;i++)
    {
        newsToWrap += `<div class="news__card">
            <a href="`+ news.articles[i].url +`"><div class="news__card-title">` + news.articles[i].title + `</div></a>
            <div class="news__card-desc">${news.articles[i].description == null? 'Описание отсутствует' : news.articles[i].description}</div>
            <div class="news__card-date">`+ news.articles[i].publishedAt.slice(0,10) +`</div>
        </div>`
    }
    newsWrapper.innerHTML = newsToWrap;
}
var detailsElem = document.getElementById('details');//modal


function openDetails(symbolId){
    detailsElem.style.animation = "slideIn 0.5s forwards";
    detailsElem.style.display = 'block';
    fetchSymbolkData(symbolId)
    fetchNewsData(symbolId);
    stockChartDay(symbolId);
}
document.querySelector('.details__close').addEventListener('click',function()
    {
        detailsElem.style.animation = "slideOut 0.5s forwards";

        setTimeout(function(){
            detailsElem.style.animation = ""
            detailsElem.style.display = 'none';
        },500);
        
    }
);