const API_KEYS = {
  avKey: "JG5BTF4B8AXHCCKI",
  finnhubKey: "d3iem19r01qn6oioapf0d3iem19r01qn6oioapfg",
  newsKey: "203a3bbc12ff4ff18ffdfce847b6f27a",
  ninjaKey: "D0oar+GVifLPv3Uso+w7bw==ZD2btbpinAr9WsCd",
  polygonKey: "3KtCYpgimlWriDKLJa11M2WaYljpqxkP",
};
function shortNum(n) {
  return n
    .toString()
    .replace(/(\d)(\d)\d{8}$/, "$1.$2B")
    .replace(/(\d)(\d)\d{5}$/, "$1.$2M")
    .replace(/(\d)(\d)\d{2}$/, "$1.$2K");
}
let chartSymbol = "";
let tableContent = document.getElementById("mainTable");
async function getStockSymbols() {
  const options = {
    method: "GET",
    headers: {
      "X-Api-Key": API_KEYS.ninjaKey,
    },
  };
  try{
    const data = await fetch(`https://api.api-ninjas.com/v1/sp500`, options).then(r => r.json());
    data.length = 4;
    for (let i = 0; i < data.length; i++) {
      const priceData = await fetch(`https://api.polygon.io/v2/aggs/ticker/${data[i]["ticker"]}/prev?adjusted=true&apiKey=${API_KEYS.polygonKey}`).then(r => r.json());
      const price = priceData["results"][0];
      const finhubData = await fetch(`https://finnhub.io/api/v1/quote?symbol=${data[i]["ticker"]}&token=${API_KEYS.finnhubKey}`).then(r => r.json());
      tableContent.innerHTML += 
          `<div class="table__row" id="row" onclick="openDetails('${data[i]["ticker"]}')">
              <div class="table__index" id="stockSymbol">
                  ${data[i]["ticker"]}
              </div>
              <div class="table__name" >
                  ${data[i]["company_name"]}
              </div>
              <div class="table__price">
                  ${price["c"]} $
              </div>
              <div class="table__pricediff" style="color:${finhubData["d"] >= 0 ? "green" : "red"}">
                  ${parseFloat(finhubData["d"]).toFixed(2)}$   ${parseFloat(finhubData["dp"]).toFixed(2)}%
              </div>
              <div class="table__volume">
                  ${shortNum(price["v"])}
              </div>
          </div>`;
      }
  }
  catch(error){
    console.error("Ошибка получения данных", error);
    alert("Данные об акциях пока не доступны, обновите страницу через минуту"); 
  }
}
getStockSymbols();

let searchInput = document.getElementById("search__symbol");
searchInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    searchSymbol();
  }
});
async function searchSymbol() {
  const symbol = document.getElementById("search__symbol").value;
  tableContent.innerHTML = "";
  const searchData = await fetch(`https://finnhub.io/api/v1/search?q=${symbol}&exchange=US&token=${API_KEYS.finnhubKey}`).then(r => r.json());
  const search = searchData["result"];
  search.length = 5;
  if (search == '') {
    alert(`По вашему запросу ничего не найдено.`);
  } 
  else {
    for (let i = 0; i < search.length; i++) {
      const searchSymbolData = await fetch(`https://finnhub.io/api/v1/quote?symbol=${search[i]["symbol"]}&token=${API_KEYS.finnhubKey}`).then(r => r.json());
        try {
          const volumeData = await fetch(`https://api.polygon.io/v2/aggs/ticker/${search[i]["symbol"]}/prev?adjusted=true&apiKey=${API_KEYS.polygonKey}`).then(r => r.json());
          const volume = volumeData["results"][0];
          tableContent.innerHTML += 
          `<div class="table__row" id="row" onclick="openDetails('${search[i]["symbol"]}')">
                <div class="table__index" id="stockSymbol">
                    ${search[i]["symbol"]}
                </div>
                <div class="table__name">
                    ${search[i]["description"]}
                </div>
                <div class="table__price">
                    ${searchSymbolData["c"] == '' ? '--' : parseFloat(searchSymbolData["c"]).toFixed(2)}$
                </div>
                <div class="table__pricediff" style="color:${searchSymbolData["d"] == null ? "black" : searchSymbolData["d"] >= 0 ? "green" : "red"}">
                    ${searchSymbolData["d"] == null ? '--' : parseFloat(searchSymbolData["d"]).toFixed(2)}$ ${searchSymbolData["dp"] == null ? '--' : parseFloat(searchSymbolData["dp"]).toFixed(2)}%
                </div>
                <div class="table__volume" id="stockVolume">
                    ${shortNum(volume["v"])}
                </div>
            </div>`;
          let change = document.getElementsByClassName("table__pricediff");
          for (let j = 0; j < change.length; j++) {
            if (searchSymbolData["d"] >= 0) {
              change[j].style.color = "green";
            } else {
              change[j].style.color = "red";
            }
          }
        } 
        catch (error) {
          console.error("Ошибка получения данных", error);
          alert("Данные для запроса пока недоуступны, попробуйте через 1 минуту"); 
          break;
        }
      }
    }
  }
async function fetchSymbolData(symbolId) {
  chartSymbol = symbolId;
  try {
    const globalQuoteData = (await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${chartSymbol}&apikey=${API_KEYS.avKey}`)).then(r => r.json());
    const globalQuote = globalQuoteData["Global Quote"];
    document.getElementById("symbol").innerText = globalQuote["01. symbol"];
    document.getElementById("price").innerText =
        parseFloat(globalQuote["05. price"]).toFixed(2) + " $";
    document.getElementById("change").innerText =
        parseFloat(globalQuote["09. change"]).toFixed(2) + " %";
    document.getElementById("open").innerText =
        parseFloat(globalQuote["02. open"]).toFixed(2) + " $";
    document.getElementById("high").innerText =
        parseFloat(globalQuote["03. high"]).toFixed(2) + " $";
    document.getElementById("low").innerText =
        parseFloat(globalQuote["04. low"]).toFixed(2) + " $";
    document.getElementById("volume").innerText = shortNum(globalQuote["06. volume"]);
  }
  catch(error) {
    console.error("Ошибка получения данных", error);
    document.getElementById("detailsError").innerHTML = 
     `Подробные данные об акции пока не доступны 
     <br> 
     (истекло максимальное количество запросов)`
  }
}

const ctx = document.getElementById("myChart");
const symbolChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  },
});
const chartDates = {
  day() {
    let today = new Date();
    let toDd = String(today.getDate()-1).padStart(2, "0");
    let fromDd = String(today.getDate() - 2).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    let toDay = yyyy + "-" + mm + "-" + toDd;
    let fromDay = yyyy + "-" + mm + "-" + fromDd;
    return fromDay + "/" + toDay;
  },
  week() {
    let today = new Date();
    let toDd = String(today.getDate() - 1).padStart(2, "0");
    let fromDd = String(today.getDate() - 7).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    let toDay = yyyy + "-" + mm + "-" + toDd;
    let fromDay = yyyy + "-" + mm + "-" + fromDd;
    return fromDay + "/" + toDay;
  },
  month() {
    let today = new Date();
    let dd = String(today.getDate() - 1).padStart(2, "0");
    let fromMm = String(today.getMonth()).padStart(2, "0");
    let toMm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    let toDay = yyyy + "-" + toMm + "-" + dd;
    let fromDay = yyyy + "-" + fromMm + "-" + dd;
    return fromDay + "/" + toDay;
  },
  threeMonth() {
    let today = new Date();
    let dd = String(today.getDate() - 1).padStart(2, "0");
    let fromMm = String(today.getMonth() - 2).padStart(2, "0");
    let toMm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    let toDay = yyyy + "-" + toMm + "-" + dd;
    let fromDay = yyyy + "-" + fromMm + "-" + dd;
    return fromDay + "/" + toDay;
  },
  year() {
    let today = new Date();
    let dd = String(today.getDate() - 1).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let fromYyyy = today.getFullYear() - 1;
    let toYyyy = today.getFullYear();
    let toDay = toYyyy + "-" + mm + "-" + dd;
    let fromDay = fromYyyy + "-" + mm + "-" + dd;
    return fromDay + "/" + toDay;
  },
};
async function stockChart(id) {
  let chartError = document.getElementById("chartError");
  let symbolChartLabel = "";
  let chartDate = "";
  switch (id) {
    case "chartDay":
      symbolChartLabel = "Стоимость акции в течение дня";
      chartDate = "30/minute/" + chartDates.day();
      //за день график может отображаться с ошибкой, если не было торгов за предыдущий день(выходные и т.д.)
      break;
    case "chartWeek":
      symbolChartLabel = "Стоимость акции в течение недели";
      chartDate = "1/day/" + chartDates.week();
      break;
    case "chartMonth":
      symbolChartLabel = "Стоимость акции в течение месяца";
      chartDate = "1/day/" + chartDates.month();
      break;
    case "chart3Month":
      symbolChartLabel = "Стоимость акции в течение месяца";
      chartDate = "1/week/" + chartDates.threeMonth();
      break;
    case "chartYear":
      symbolChartLabel = "Стоимость акции в течение года";
      chartDate = "1/month/" + chartDates.year();
      break;
    default:
      symbolChartLabel = "Стоимость акции в течение дня";
      chartDate = "30/minute/" + chartDates.day();
      break;
  }
  try {
    const chartData = await fetch(`https://api.polygon.io/v2/aggs/ticker/${chartSymbol}/range/${chartDate}?adjusted=true&sort=asc&limit=500&apiKey=${API_KEYS.polygonKey}`).then(r => r.json());
    if(chartData["queryCount"] == 0 ){
      chartError.innerText = "За этот день не было совершено торгов";
    }
    else{
      const chart = chartData["results"];
      const chartLabels = [];
      const chartPrices = [];
      chartError.innerText = "";
      for (let i = 0; i < chart.length; i++) {
        chartLabels.push(new Date(chart[i]["t"]).toLocaleDateString());
        chartPrices.push(chart[i]["c"]);
      }
      symbolChart.data.datasets[0].label = symbolChartLabel;
      symbolChart.data.labels = chartLabels;
      symbolChart.data.datasets[0].data = chartPrices;
      symbolChart.update();
    }
  }
  catch (error) {
    console.error("Ошибка получения данных", error);
    chartError.innerText = "Данные графика пока недоступны, попробуйте через 1 минуту";
  }
}
async function fetchNewsData(symbolId) {
  let today = new Date();
  let toDd = String(today.getDate() - 1).padStart(2, "0");
  let fromDd = String(today.getDate() - 8).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let toDay = yyyy + "-" + mm + "-" + toDd;
  let fromDay = yyyy + "-" + mm + "-" + fromDd;
  const keyword = symbolId;
  document.getElementById("newsError").innerText = '';
  try{
    const news = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${keyword}&from=${fromDay}&to=${toDay}&token=${API_KEYS.finnhubKey}`).then(r => r.json());
    const newsWrapper = document.getElementById("newsWrapper");
    let newsToWrap = "";
    for (let i = 0; i < news.length; i++) {
      newsToWrap += 
          `<div class="news__card">
              <a href="${news[i]["url"]}">
                  <div class="news__card-title">
                      ${news[i]["headline"]}
                  </div>
              </a>
              <div class="news__card-desc">
                  ${news[i]["summary"] == null? "Описание отсутствует": news[i]["summary"]}
              </div>
              <div class="news__card-date">
                  ${new Date(news[i]["datetime"]).toLocaleTimeString()}
              </div>
          </div>`;
    }
    newsWrapper.innerHTML = newsToWrap;
  }
  catch(error){
    console.error("Ошибка получения данных", error);
    document.getElementById("newsError").innerText = "Новости о компании пока недоступны.";
  }
}
let overlay = document.getElementById("overlay");
let detailsElem = document.getElementById("details"); //modal
let detailsInner = document.getElementById("detailsInner");
detailsInner.style.height = document.documentElement.clientHeight
function openDetails(symbolId) {
  detailsElem.style.animation = "slideIn 0.5s forwards";
  detailsElem.style.display = "block";
  overlay.style.display = "block"
  fetchSymbolData(symbolId);
  fetchNewsData(symbolId);
  stockChart(symbolId);
}
document.querySelector(".details__close").addEventListener("click", function () {
    detailsElem.style.animation = "slideOut 0.7s forwards";
    overlay.style.display = "none"
    setTimeout(function () {
      detailsElem.style.animation = "";
      detailsElem.style.display = "none";
    }, 500);
  });
