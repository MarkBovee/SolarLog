var charts = {};

// extracts the time part of the date string
function extractTime(date) {
  var parts = date.split(" ");

  if (parts.length > 1) {
    var time = parts[1];

    return time;
  }

  return "";
}

// creates the hex code from rgba
function rgb (r, g, b) {

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  var value = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

  return value;
}

// renders a chart
function renderChart(data, labels, caption, primary, secondary, element, update) {

  var chartdata = {
    labels: labels,
    datasets: [
      {
        label: caption,
        data: data,
        pointRadius: 0,
        borderColor: primary,
        borderWidth: 2,
        backgroundColor: secondary 
      }
    ]
  };

  if (update) {
    // update the chart data
    var chart = charts[caption];
    chart.data = chartdata;
    chart.update();
  } else {
    // draw new chart
    var options = {
      type: "line",
      data: chartdata,
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 5,
                maxRotation: 0
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    };

    var ctx = document.getElementById(element).getContext("2d");
    charts[caption] = new Chart(ctx, options);
  }
}
