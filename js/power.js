// gets the chart data from domoticz
function getPowerChartData(update) {
  jQuery.ajax({
    headers: {
      "Authorization": "Basic " + domoticz.auth
    },
    url: "http://" + domoticz.server + ":" + domoticz.port + "/json.htm?type=graph&sensor=counter&idx=" + domoticz.devices.solar + "&range=day",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function(json) {
      solardata = extractPowerChartData(json);
      renderPowerCharts(solardata, update);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  });
}

// gets the power stats
function getPowerStatsData() {
  jQuery.ajax({
    headers: {
      "Authorization": "Basic " + domoticz.auth
    },
    url: "http://" + domoticz.server + ":" + domoticz.port + "/json.htm?type=devices&filter=all&favorite=1&used=true&order=[Order]&plan=0",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function(json) {
      var stats = extractPowerStatsData(json)
      renderPowerStats(stats);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  });
}

// draw the most current solar value from the data
function renderPowerStats(data) {
  if (data) {
    if (data.current_usage) { $('#currentUsage').text(data.current_usage) };
    if (data.total_usage) { $('#totalUsage').text(data.total_usage) };
    if (data.current_return) { $('#currentReturn').text(data.current_return) };
    if (data.total_return) { $('#totalReturn').text(data.total_return) };
    if (data.total_gas) { $('#totalGas').text(data.total_gas) };
    if (data.sunrise && data.sunset) { $('#sunrise').html("&uarr;" + data.sunrise + " &darr;" + data.sunset) };
    if (data.forecast && data.temp) { $('#weather').html(data.forecast + " " + data.temp + " &#8451;") };
  }
}

// draw a chart for the power values
function renderPowerCharts(data, update) {
  renderChart(data.usage.map(i => i.v), data.usage.map(i => i.d), "Usage", colors.usage.primary, colors.usage.secondary, "powerchart_usage", update);
  renderChart(data.return.map(i => i.v), data.return.map(i => i.d), "Return", colors.return.primary, colors.return.secondary, "powerchart_return", update);
}

// Extracts the stats data from the json 
function extractPowerStatsData(json) {

  function checkSolarDevice(result) {
      return parseInt(result.idx) == domoticz.devices.solar;
  }

  function checkGasDevice(result) {
    return parseInt(result.idx) == domoticz.devices.gas;
  }

  function checkWeatherDevice(result) {
    return parseInt(result.idx) == domoticz.devices.weather;
  }

  var stats = {
    time: json.ServerTime,
    sunrise: json.Sunrise,
    sunset: json.Sunset
  }

  var solardevice = json.result.find(checkSolarDevice);
  if (solardevice) {
    stats.current_return = solardevice.UsageDeliv;
    stats.current_usage = solardevice.Usage;
    stats.total_return = solardevice.CounterDelivToday;
    stats.total_usage =  solardevice.CounterToday;
  }

  var gasdevice = json.result.find(checkGasDevice);
  if (gasdevice) {
    stats.total_gas = gasdevice.CounterToday;
  }

  var weatherdevice = json.result.find(checkWeatherDevice);
  if (weatherdevice) {
    stats.forecast = weatherdevice.ForecastStr;
    stats.temp = weatherdevice.Temp
  }

  return stats;
}

// Extracts the power data from the json 
function extractPowerChartData(json) {

  // Create the power data object
  var data = {
    usage: [],
    return: [],
    current_return: 0,
    current_usage: 0,
    total_return: 0,
    total_usage: 0,
  }

  var start_usage = false;
  var start_return = false;

  for (var i = 100; i < json.result.length; i++) {

    var datapart = json.result[i];
    var time = extractTime(datapart.d);
    var current = 0;
    
    // Usage
    if (start_usage > 0 || (datapart.v && datapart.v > 0) || (datapart.v2 && datapart.v2 > 0)) {
      var start_usage = true;
      var value = parseInt(datapart.v) + parseInt(datapart.v2);
      
      var usagedata = {
        d: time,
        v: value
      };

      data.current_usage = value;
      data.total_usage = (parseInt(datapart.eu) / 1000);
      data.usage.push(usagedata);
    }

    // Return 
    if (start_return > 0 || (datapart.r1 && datapart.r1 > 0) || (datapart.r2 && datapart.r2 > 0)) {
      start_return = true;
      var value = parseInt(datapart.r1) + parseInt(datapart.r2)
      var returndata = {
        d: time,
        v: value
      };

      data.current_return = value;
      data.total_return = (parseInt(datapart.eg) / 1000);
      data.return.push(returndata);
    }
  }

  return data;
}
