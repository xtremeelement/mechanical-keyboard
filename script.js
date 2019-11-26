let myChart = document.getElementById("myChart").getContext("2d");
let symbol = "amd";
let prices = [];
let date = [];

//draws chart when page loads
chartIt();

//the function that generates the chart
async function chartIt() {
  //draws chart after the data from the API is recieved
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
          backgroundColor: "black"
        }
      ]
    },
    options: {}
  });
}

//Gets the defined symbol
async function getSymbol() {
  prices = [];
  date = [];
  await fetch(
    `https://sandbox.iexapis.com/stable/stock/${symbol}/batch?types=quote,news,chart&range=1m&last=10&token=Tsk_fb6ca04b1b8e41b18beda113862b1eb3`
  )
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      for (var i = 0; i < data.chart.length; i++) {
        // console.log(data.chart[i].open);
        prices.push(data.chart[i].open);
        date.push(data.chart[i].date);
        symbol = data.quote.symbol;
        // symbol = data.chart[i].symbol;
      }
      return prices;
      return date;
      return symbol;
    });
}

//Updates chart when search function is used
async function updateChart() {
  symbol = document.querySelector("#stockSymbol").value;
  await getSymbol();
  let stockChart = new Chart(myChart, {
    type: "line", // bar, horizontalBar, pie, line, dougnut, radar, polarArea
    data: {
      labels: date,
      datasets: [
        {
          label: symbol,
          data: prices,
          backgroundColor: "black"
        }
      ]
    },
    options: {}
  });
}
