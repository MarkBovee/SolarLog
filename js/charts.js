// Gets the data from domoticz
function getDomoticzData(idx, range, callback) {
  jQuery.ajax({
    headers: {
      "Authorization": "Basic " + domoticz.auth
    },
    url: "http://" + domoticz.server + ":" + domoticz.port + "/json.htm?type=graph&sensor=counter&idx=" + idx + "&range=" + range,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function(json) {
      callback(json);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  });
}

// Gets the power data for today
function getPowerDataDay(update) {
  getDomoticzData(domoticz.devices.solar, "day", function(json) {
    var powerdata = extractPowerData(json);
    renderPowerDay(powerdata, update);
  });
}

// Gets the gas data for today
function getGasDataDay(update) {
  getDomoticzData(domoticz.devices.gas, "day", function(json) {
    var gasdata = extractGasData(json);
    renderGasDay(gasdata, update);
  });
}

// gets the power data of last week from domoticz
function getPowerDataWeek(update) {
  getDomoticzData(domoticz.devices.solar, "week", function(json) {
    var powerdata = extractPowerWeekData(json);
    renderPowerWeek(powerdata, update);
  });
  
}

// gets the gas data from domoticz
function getGasDataWeek(update) {
  getDomoticzData(domoticz.devices.gas, "week", function(json) {
    var gasdata = extractGasWeekData(json);
    renderGasWeek(gasdata, update)
  });
}

// Draw a chart for the power values of today
function renderPowerDay(data, update) {

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

// Draw a chart for the gas values of today
function renderGasDay(data, update) {

  var chartdata = {
    labels: data.time,
    datasets: [
      {
        label: "Usage",
        data: data.usage,
        pointRadius: 0,
        borderColor: colors.gas.primary,
        borderWidth: 2,
        backgroundColor: colors.gas.secondary 
      }
    ]
  };

  renderLineChart("Gas", "gaschart", chartdata, update, 0.5);
}

// draws the gas values of last week
function renderGasWeek(data, update) {

  var chartdata = {
    labels: data.dates,
    datasets: [
      {
        label: "Gas",
        data: data.usage,
        borderColor: colors.gas.primary,
        borderWidth: 2,
        backgroundColor: colors.gas.secondary, 
      }
    ]
  };

  renderBarChart("Gas", "gas_lastweek", chartdata, update);
}

// draws the values of last week
function renderPowerWeek(data, update) {

  var chartdata = {
    labels: data.dates,
    datasets: [
      {
        label: "Usage",
        data: data.usage,
        borderColor: colors.usage.primary,
        borderWidth: 2,
        backgroundColor: colors.usage.secondary, 
      },
      {
        label: "Return",
        data: data.return,
        borderColor: colors.return.primary,
        borderWidth: 2,
        backgroundColor: colors.return.secondary, 
      }
    ]
  };

  renderBarChart("Power (last week)", "power_lastweek", chartdata, update);
}

// Extracts the power data from the json 
function extractPowerData(json) {
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

  for (var i = 0; i < json.result.length; i++) {

    var datapart = json.result[i];
    var time = extractTime(datapart.d);
    var current = 0;
    
    if (time) {
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
  }

  return data;
}

// Extracts the power week data from the json 
function extractPowerWeekData(json) {
  // Create the gas data object
  var data = {
    dates: [],
    usage: [],
    return: []
  }

  for (var i = 0; i < json.result.length; i++) {
    var datapart = json.result[i];

    data.dates.push(extractDate(datapart.d));
    data.usage.push(parseFloat(datapart.v) + parseFloat(datapart.v2));
    data.return.push(parseFloat(datapart.r1) + parseFloat(datapart.r2));
  }

  return data;
}

// Extracts the gas data from the json 
function extractGasData(json) {
  // Create the gas data object
  var data = {
    time: [],
    usage: [],
  }

  for (var i = 0; i < json.result.length; i++) {
    var datapart = json.result[i];
    var time = extractTime(datapart.d);
    
    if (time) {
      data.time.push(time);
      data.usage.push(parseFloat(datapart.v));
    }
  }

  return data;
}

// Extracts the power week data from the json 
function extractGasWeekData(json) {
  // Create the gas data object
  var data = {
    dates: [],
    usage: []
  }

  for (var i = 0; i < json.result.length; i++) {
    var datapart = json.result[i];

    data.dates.push(extractDate(datapart.d));
    data.usage.push(parseFloat(datapart.v));
  }

  return data;
}

