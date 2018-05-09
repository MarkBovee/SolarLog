var charts = {};

// extracts the time part of the date string
function extractTime(date) {
  var parts = date.split(" ");

  if (parts.length > 1) {
    var date = parts[0];
    var time = parts[1];

    var today = moment(new Date()).format('YYYY-MM-DD')

    if (date == today) {
      return time;
    }
  }

  return null;
}

// extracts the formatted date part of the date string
function extractDate(date) {
  var parts = date.split("-");

  if (parts.length > 2) {
    var year = parts[0];
    var month = parts[1];
    var day = parts[2];

    return day + "-" + month
  }

  return null;
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

// renders a line chart
function renderLineChart(caption, element, chartdata, update, max) {
  if (update) {
    // update the chart data
    var chart = charts[caption];
    chart.config.options.animation.duration = 0;
    chart.config.data = chartdata;
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
                maxTicksLimit: 6,
                maxRotation: 0
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: true
              }
            }
          ]
        }
      }
    };

    if (max) {
      options.options.scales.yAxes[0].ticks = {
        max: max
      }
    }

    var ctx = document.getElementById(element).getContext("2d");
    charts[caption] = new Chart(ctx, options);
  }
}

// renders a bar chart
function renderBarChart(caption, element, chartdata, update) {
  if (update) {
    // update the chart data
    var chart = charts[caption];
    chart.config.options.animation.duration = 0;
    chart.config.data = chartdata;
    chart.update();
  } else {
    // draw new chart
    var options = {
      type: "bar",
      data: chartdata,
      options: {
        legend: {
          display: false
        },
        scales: {
            xAxes: [
              {
                stacked: false,
                gridLines: {
                  display: false
                }
            }],
            yAxes: [{
                stacked: false,
                ticks: {
                    beginAtZero: true
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
