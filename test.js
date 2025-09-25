async function stockChartDay() {
    // const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=60min&apikey=JG5BTF4B8AXHCCKI`;
    // const chartUrlResponse = await fetch(chartUrl);
    // const chartData = await chartUrlResponse.json();
    const chartData = {
    "Meta Data": {
        "1. Information": "Intraday (5min) open, high, low, close prices and volume",
        "2. Symbol": "IBM",
        "3. Last Refreshed": "2025-09-24 19:55:00",
        "4. Interval": "5min",
        "5. Output Size": "Compact",
        "6. Time Zone": "US/Eastern"
    },
    "Time Series (60min)": {
        "2025-09-24 19:00:00": {
            "1. open": "267.6000",
            "2. high": "267.8000",
            "3. low": "267.6000",
            "4. close": "267.8000",
            "5. volume": "92"
        },
        "2025-09-24 18:00:00": {
            "1. open": "267.3320",
            "2. high": "267.8000",
            "3. low": "267.3200",
            "4. close": "267.8000",
            "5. volume": "33"
        },
        "2025-09-24 17:00:00": {
            "1. open": "267.4500",
            "2. high": "267.8000",
            "3. low": "267.3212",
            "4. close": "267.8000",
            "5. volume": "36"
        },
        "2025-09-23 16:00:00": {
            "1. open": "267.6000",
            "2. high": "267.8000",
            "3. low": "267.3000",
            "4. close": "267.3100",
            "5. volume": "95"
        },
    }
}
    const chart = chartData["Time Series (60min)"];
    var today = new Date();
    var dd = String(today.getDate()-1).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    console.log(Object.keys(chart).filter(item => item.includes(today)))
    // if(Object.keys(chart).includes("2025-09-24")){
    //     chartDataset.push(Object.values(chart).map(c => c["4. close"]))
    // }
    const chartDataset = Object.values(chart).map(c => c["4. close"]).toReversed()
    // console.log(chartDataset)
    // for(i=0;i<Object.keys(chart).length;i++){
    //     // chartDataset.splice(i,0,chart["1. open"])
    //     chartDataset.push(chart[i])
        console.log(chartDataset)
    // }
}
stockChartDay();