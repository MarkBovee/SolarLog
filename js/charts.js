// gets the power data from domoticz
function getPowerDataCurrent(update) {
  jQuery.ajax({
    headers: {
      "Authorization": "Basic " + domoticz.auth
    },
    url: "https://" + domoticz.server + ":" + domoticz.port + "/json.htm?type=graph&sensor=counter&idx=" + domoticz.devices.solar + "&range=day",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function(json) {
      solardata = extractPowerChartData(json);
      renderPowerChart(solardata, update);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  });
}

// gets the gas data from domoticz
function getGasDataLastWeek(update) {
  renderGasLastWeek([], update)
}

// gets the power data of last week from domoticz
function getPowerDataLastWeek(update) {
  renderPowerLastWeek([], update);
}

// draw a chart for the power values
function renderPowerChart(data, update) {

  var chartdata = {
    labels: data.time,
    datasets: [
      {
        label: "Usage",
        data: data.usage,
        pointRadius: 0,
        borderColor: colors.usage.primary,
        borderWidth: 2,
        backgroundColor: colors.usage.secondary 
      },
      {
        label: "Return",
        data: data.return,
        pointRadius: 0,
        borderColor: colors.return.primary,
        borderWidth: 2,
        backgroundColor: colors.return.secondary 
      }
    ]
  };

  renderLineChart("Power", "powerchart", chartdata, update);
}

// draws the gas values of last week
function renderGasLastWeek(data, update) {

  var chartdata = {
    labels: ["Ma", "Di"],
    datasets: [
      {
        label: "Gas",
        data: [50 , 30 ],
        borderColor: colors.gas.primary,
        borderWidth: 2,
        backgroundColor: colors.gas.secondary, 
      }
    ]
  };

  renderBarChart("Gas", "gas_lastweek", chartdata, update);
}

// draws the values of last week
function renderPowerLastWeek(data, update) {

  var chartdata = {
    labels: ["Ma", "Di"],
    datasets: [
      {
        label: "Usage",
        data: [50 , 30 ],
        borderColor: colors.usage.primary,
        borderWidth: 2,
        backgroundColor: colors.usage.secondary, 
      },
      {
        label: "Return",
        data: [150 , 130 ],
        borderColor: colors.return.primary,
        borderWidth: 2,
        backgroundColor: colors.return.secondary, 
      }
    ]
  };

  renderBarChart("Power (last week)", "power_lastweek", chartdata, update);
}

// Extracts the power data from the json 
function extractPowerChartData(json) {

  // Create the power data object
  var data = {
    time: [],
    usage: [],
    return: [],
    current_return: 0,
    current_usage: 0,
    total_return: 0,
    total_usage: 0,
  }

  for (var i = 125; i < json.result.length; i++) {

    var datapart = json.result[i];
    var time = extractTime(datapart.d);
    var current = 0;
    
    data.time.push(time);

    // Usage
    var usagevalue = 0;
    if ((datapart.v && datapart.v > 0) || (datapart.v2 && datapart.v2 > 0)) {
      usagevalue = parseInt(datapart.v) + parseInt(datapart.v2);
      data.total_usage = (parseInt(datapart.eu) / 1000);
    }
    data.usage.push(usagevalue);
    data.current_usage = usagevalue;

    // Return 
    var returnvalue = 0;
    if ((datapart.r1 && datapart.r1 > 0) || (datapart.r2 && datapart.r2 > 0)) {
      returnvalue = parseInt(datapart.r1) + parseInt(datapart.r2)
      data.total_return = (parseInt(datapart.eg) / 1000);
    }
    data.return.push(returnvalue);
    data.current_return = returnvalue;
  }

  return data;
}
