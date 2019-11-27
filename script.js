let myChart = document.getElementById("myChart").getContext("2d");
let symbol = "";
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
          borderColor: "red",
          borderWidth: 1
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

    //gets data from json file
    .then(function(data) {
      for (var i = 0; i < data.chart.length; i++) {
        prices.push(data.chart[i].open);
        date.push(data.chart[i].date);
        symbol = data.quote.symbol;

        //builds items with json data
        summary = `
        <ul>
          <li><strong>Primary Stock Exchange:</strong> ${data.quote.primaryExchange}</li>
          <li><strong>Stock Symbol:</strong> ${data.quote.symbol}</li>
          <li><strong>Market Cap:</strong> ${data.quote.marketCap}</li>
          <li><strong>52 Week High:</strong> ${data.quote.week52High}</li>
          <li><strong>52 Week Low:</strong> ${data.quote.week52Low}</li>
          <li><strong>Latest Source:</strong> ${data.quote.latestSource}</li>
        </ul>`;
        document.querySelector(".headLine").innerHTML = data.quote.companyName;
        document.querySelector(".summary").innerHTML = summary;
        document.querySelector(".topSymbol").innerHTML = data.quote.symbol;
        document.querySelector(".currentPrice").innerHTML = data.quote.close;
        document.querySelector(".changePrice").innerHTML = data.quote.change;
      }

      //Adds the news boxes below the graph
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
    });
}