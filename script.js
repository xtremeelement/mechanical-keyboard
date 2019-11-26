let myChart = document.getElementById("myChart").getContext("2d");
let symbol = "amd";
let prices = [];
let date = [];

//draws chart when page loads
chartIt();

//the function that generates the chart
async function chartIt() {
  //draws chart after the data from the API is recieved
  symbol = document.querySelector("#stockSymbol").value;
  await getSymbol();

  //draws the chart with parameters
  let stockChart = new Chart(myChart, {
    type: "line", // bar, horizontalBar, pie, line, dougnut, radar, polarArea
    data: {
      labels: date,
      datasets: [
        {
          label: symbol,
          data: prices,
          borderColor: "green"
        }
      ]
    },
    options: {}
  });
}

//sandbox api = https://sandbox.iexapis.com/stable/stock/${symbol}/batch?types=quote,news,chart&range=1m&last=10&token=Tsk_fb6ca04b1b8e41b18beda113862b1eb3
//Gets the defined symbol
async function getSymbol() {
  prices = [];
  date = [];
  await fetch(
    `https://cloud.iexapis.com/v1/stock/${symbol}/batch?types=quote,news,chart&range=1m&last=10&token=pk_023ec8aa653d4ab2828418e4927b9adb`
  )
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      for (var i = 0; i < data.chart.length; i++) {
        prices.push(data.chart[i].open);
        date.push(data.chart[i].date);
        symbol = data.quote.symbol;
        let primaryExch = data.quote.primaryExchange;
        let markCap = data.quote.marketCap;
        let yearHigh = data.quote.week52High;
        let yearLow = data.quote.week52Low;
        let source = data.quote.latestSource;

        summary = `
        <ul>
          <li><strong>Primary Stock Exchange:</strong> ${primaryExch}</li>
          <li><strong>Stock Symbol:</strong> ${symbol}</li>
          <li><strong>Market Cap:</strong> ${markCap}</li>
          <li><strong>52 Week High:</strong> ${yearHigh}</li>
          <li><strong>52 Week Low:</strong> ${yearLow}</li>
          <li><strong>Latest Source:</strong> ${source}</li>
        </ul>`;
        document.querySelector(".headLine").innerHTML = data.quote.companyName;
        document.querySelector(".summary").innerHTML = summary;
      }
      let newsBox = "";
      for (var index = 0; index < 6; index++) {
        newsBox += `
        <div class="col-4 mt-5">
          <div class="card card-body dynamic">
            <h2>${data.news[index].headline}</h2>
            <p>${data.news[index].summary}</p>
            <a href="${data.news[index].url}" target="_blank">Read More...</a>
          </div>
        </div>
        `;
        document.querySelector(".newsBox").innerHTML = newsBox;
      }

      return prices;
      return date;
      return symbol;
    });
}
