const avKey = 'JG5BTF4B8AXHCCKI';
const finhubKey = 'd3iem19r01qn6oioapf0d3iem19r01qn6oioapfg'
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
        data.length = 5;

        for(let i = 0; i<data.length; i++){
            const apiPriceUrl = `https://api.polygon.io/v2/aggs/ticker/${data[i]["ticker"]}/prev?adjusted=true&apiKey=${polygonApiKey}`
            const priceResponse = await fetch(apiPriceUrl);
            const priceData = await priceResponse.json();
            const price = priceData["results"][0]
            const finhubUrl =  `https://finnhub.io/api/v1/quote?symbol=${data[i]["ticker"]}&token=${finhubKey}`;
            const finhubResponse = await fetch(finhubUrl);
            const finhubData = await finhubResponse.json();
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
                    <div class="table__pricediff" style="color:${finhubData["d"]>=0? 'green': 'red'}">
                        `+parseFloat(finhubData["d"]).toFixed(2)+`$` +parseFloat(finhubData["dp"]).toFixed(2)+`%
                    </div>
                    <div class="table__volume">
                        `+shortNum(price["v"])+`
                    </div>
                </div>`
        }
        
    }
getStockSymbols();
async function searchSymbol() {
    const symbol = document.getElementById('search__symbol').value;
    tableContent.innerHTML = ''
    const searchRequest = `https://finnhub.io/api/v1/search?q=${symbol}&exchange=US&token=${finhubKey}`
    const searhcResponse = await fetch(searchRequest);
    const searchData = await searhcResponse.json()
    const search = searchData["result"]
    if(search == ''){
        alert('По вашему запросу ничего не найдено')
    }
    for (let i = 0; i < search.length; i++) {
        const searchSymbol = `https://finnhub.io/api/v1/quote?symbol=${search[i]["symbol"]}&token=${finhubKey}`;
        const searchSymbolesponse = await fetch(searchSymbol);
        const searchSymbolData = await searchSymbolesponse.json();
        const volumeUrl = `https://api.polygon.io/v2/aggs/ticker/${search[i]["symbol"]}/prev?adjusted=true&apiKey=${polygonApiKey}`
        const volumeResponse = await fetch(volumeUrl);
        const volumeData = await volumeResponse.json();
        const volume = volumeData['results'][0]
        tableContent.innerHTML += 
        `<div class="table__row" id="row" onclick="openDetails('${search[i]["symbol"]}')">
            <div class="table__index" id="stockSymbol">
                `+search[i]["symbol"]+
            `</div>
            <div class="table__name">
                `+search[i]["description"]+`
            </div>
            <div class="table__price">
                `+parseFloat(searchSymbolData["c"]).toFixed(2)+` $
            </div>
            <div class="table__pricediff style="color:${finhubData["d"]>=0? 'green': 'red'}">
                `+parseFloat(searchSymbolData["d"]).toFixed(2)+` $`+` `+searchSymbolData["dp"]+
            `</div>
            <div class="table__volume" id="stockVolume">
                `+shortNum(volume["v"])+
            `</div>
        </div`
        var change = document.getElementsByClassName('table__pricediff')
        for(i = 0;i < change.length; i++)
        {
            if(searchSymbolData["d"]>= 0)
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
    var today = new Date();
    var toDd = String(today.getDate()-1).padStart(2, '0');
    var fromDd = String(today.getDate()-3).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var toDay = yyyy + '-' + mm + '-' + toDd;
    var fromDay =  yyyy + '-' + mm + '-' + fromDd;
    const chartUrl = `https://api.polygon.io/v2/aggs/ticker/${chartSymbol}/range/30/minute/${fromDay}/${toDay}?adjusted=true&sort=asc&limit=120&apiKey=${polygonApiKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerDay = chartData['results'];
    const chartDayLabels = []
    const chartDayPrices = []
    for(let i = 0;i<chartPerDay.length;i++){
        chartDayLabels.push(new Date(chartPerDay[i]['t']).toLocaleTimeString());
        chartDayPrices.push(chartPerDay[i]['c']);
    }

    // const chartPerDay = chartData["Time Series (15min)"];
    // const chartDayLabels = Object.keys(chartPerDay).toReversed();
    // const filterDay = chartDayLabels.filter(function(elem){
    //     if(elem.includes(today))
    //         return elem
    // });
    // var filteredDayLabels = []
    // for(i=0;i<filterDay.length;i++){
    //     filteredDayLabels.push(chartPerDay[filterDay[i]])
    // }
    // alert(chartDayLabels)
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение дня';
    symbolChart.data.labels = chartDayLabels;
    symbolChart.data.datasets[0].data = chartDayPrices;
    symbolChart.update();
    
}   

async function stockChartWeek() {
    var today = new Date();
    var toDd = String(today.getDate()-1).padStart(2, '0');
    var fromDd = String(today.getDate()-7).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var toDay = yyyy + '-' + mm + '-' + toDd;
    var fromDay =  yyyy + '-' + mm + '-' + fromDd;
    const chartUrl = `https://api.polygon.io/v2/aggs/ticker/${chartSymbol}/range/1/day/${fromDay}/${toDay}?adjusted=true&sort=asc&limit=120&apiKey=${polygonApiKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerWeek = chartData['results']
    const chartWeekLabels = []
    const chartWeekPrices = []
    for(let i = 0;i<chartPerWeek.length;i++){
        chartWeekLabels.push(new Date(chartPerWeek[i]['t']).toLocaleDateString());
        chartWeekPrices.push(chartPerWeek[i]['c']);
    }
    // var lastWeek = [];
    // for(i = 0;i < 5;i++){
    //     var weekDay = new Date()
    //     var weekDd = String(weekDay.getDate()-i-1).padStart(2, '0');
    //     var WeekMm = String(weekDay.getMonth() + 1).padStart(2, '0');
    //         if(weekDd<1)
    //         {
    //             weekDd = String(30 + weekDay.getDate()-i-1).padStart(2, '0');
    //             WeekMm = String(weekDay.getMonth()).padStart(2, '0');
    //         } 
    //     var weekYyyy = weekDay.getFullYear();
    //     dayDate = weekYyyy + '-' + WeekMm + '-' + weekDd;
    //     lastWeek[i] = dayDate;
    //     }
    //     //*даты последней недели

    //  const chartWeekLabels = Object.keys(chartPerWeek);
        
    //  let filteredWeek = [];
    // for(i = 0; i<lastWeek.length;i++){
    //     if(chartWeekLabels[i] = lastWeek[i]){
    //          filteredWeek.push(chartPerWeek[lastWeek[i]])
    //          if(filteredWeek[i] == undefined)
    //              filteredWeek[i] = filteredWeek[i-1]
    //     }
    // }

    // const chartDataWeekSet = Object.values(filteredWeek).map(c => JSON.parse(c["4. close"])).toReversed();
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение 5 дней';
    symbolChart.data.labels = chartWeekLabels;
    symbolChart.data.datasets[0].data = chartWeekPrices;
    symbolChart.update();
}

async function stockChartMonth() {
    var today = new Date();
    var dd = String(today.getDate()-1).padStart(2, '0');
    var fromMm = String(today.getMonth()).padStart(2, '0');
    var toMm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var toDay = yyyy + '-' + toMm + '-' + dd;
    var fromDay =  yyyy + '-' + fromMm + '-' + dd;
    const chartUrl = `https://api.polygon.io/v2/aggs/ticker/${chartSymbol}/range/1/day/${fromDay}/${toDay}?adjusted=true&sort=asc&limit=120&apiKey=${polygonApiKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerMonth = chartData['results']
    const chartMonthLabels = []
    const chartMonthPrices = []
    for(let i = 0;i<chartPerMonth.length;i++){
        chartMonthLabels.push(new Date(chartPerMonth[i]['t']).toLocaleDateString());
        chartMonthPrices.push(chartPerMonth[i]['c']);
    }
    // const chartMonthLabels = Object.keys(chartPerMonth)
    // chartMonthLabels.length = 22 
    // const chartDataMonth = Object.values(chartPerMonth)
    // chartDataMonth.length = 22 
    // const chartDataMonthSet = chartDataMonth.map(c => JSON.parse(c["4. close"])).toReversed();
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение 1 месяца';
    symbolChart.data.labels = chartMonthLabels;
    symbolChart.data.datasets[0].data = chartMonthPrices;
    symbolChart.update();
}

async function stockChart3Months() {
    var today = new Date();
    var dd = String(today.getDate()-1).padStart(2, '0');
    var fromMm = String(today.getMonth()-2).padStart(2, '0');
    var toMm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var toDay = yyyy + '-' + toMm + '-' + dd;
    var fromDay =  yyyy + '-' + fromMm + '-' + dd;
    const chartUrl =  `https://api.polygon.io/v2/aggs/ticker/${chartSymbol}/range/1/week/${fromDay}/${toDay}?adjusted=true&sort=asc&limit=120&apiKey=${polygonApiKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPer3Month = chartData['results']
    const chart3MonthLabels = []
    const chart3MonthPrices = []
    for(let i = 0;i<chartPer3Month.length;i++){
        chart3MonthLabels.push(new Date(chartPer3Month[i]['t']).toLocaleDateString());
        chart3MonthPrices.push(chartPer3Month[i]['c']);
    }
    // const chart3MonthLabels = Object.keys(chartPer3Month)
    // chart3MonthLabels.length = 14
    // const chartData3Month = Object.values(chartPer3Month)
    // chartData3Month.length = 14
    // const chartData3MonthSet = Object.values(chartData3Month).map(c => JSON.parse(c["4. close"])).toReversed();
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение 3 месяцев';
    symbolChart.data.labels = chart3MonthLabels
    symbolChart.data.datasets[0].data = chart3MonthPrices;
    symbolChart.update();
}

async function stockChartYear() {
    var today = new Date();
    var dd = String(today.getDate()-1).padStart(2, '0');
    var mm = String(today.getMonth()+1).padStart(2, '0');
    var fromYyyy = today.getFullYear()-1;
    var toYyyy = today.getFullYear();
    var toDay = toYyyy + '-' + mm + '-' + dd;
    var fromDay =  fromYyyy + '-' + mm + '-' + dd;
    const chartUrl = `https://api.polygon.io/v2/aggs/ticker/${chartSymbol}/range/1/month/${fromDay}/${toDay}?adjusted=true&sort=asc&limit=120&apiKey=${polygonApiKey}`;
    const chartResponse = await fetch(chartUrl);
    const chartData = await chartResponse.json();
    const chartPerYear = chartData['results']
    const chartYearLabels = []
    const chartYearPrices = []
    for(let i = 0;i<chartPerYear.length;i++){
        chartYearLabels.push(new Date(chartPerYear[i]['t']).toLocaleDateString());
        chartYearPrices.push(chartPerYear[i]['c']);
    }
    // const chartYearLabels = Object.keys(chartPerYear)
    // chartYearLabels.length = 13
    // const chartDataYear = Object.values(chartPerYear)
    // chartDataYear.length = 13
    // const chartDataYearSet = Object.values(chartDataYear).map(c => JSON.parse(c["4. close"])).toReversed();
    symbolChart.data.datasets[0].label = 'Стоимость акции в течение года';
    symbolChart.data.labels = chartYearLabels;
    symbolChart.data.datasets[0].data = chartYearPrices;
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