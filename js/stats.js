// Gets the stats data
function getStatsData() {
  jQuery.ajax({
    headers: {
      Authorization: "Basic " + domoticz.auth
    },
    url:
      "http://" +
      domoticz.server +
      ":" +
      domoticz.port +
      "/json.htm?type=devices&filter=all&favorite=1&used=true&order=[Order]&plan=0",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function(json) {
      var stats = extractStatsData(json);
      renderStats(stats);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  });
}

// Renders the current stats
function renderStats(data) {
  if (data) {
    if (data.current_usage) {
      $("#currentUsage").text(data.current_usage);
    }
    if (data.total_usage) {
      $("#totalUsage").text(data.total_usage);
    }
    if (data.current_return) {
      $("#currentReturn").text(data.current_return);
    }
    if (data.total_return) {
      $("#totalReturn").text(data.total_return);
    }
    if (data.total_gas) {
      $("#totalGas").text(data.total_gas);
    }
    if (data.sunrise && data.sunset) {
      $("#sunrise").html("&uarr;" + data.sunrise + " &darr;" + data.sunset);
    }
    if (data.forecast && data.temp) {
      $("#weather").html(data.forecast + " " + data.temp + "&#8451;");
    }
  }
}

// Extracts the stats data from the json
function extractStatsData(json) {
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
  };

  var solardevice = json.result.find(checkSolarDevice);
  if (solardevice) {
    stats.current_return = solardevice.UsageDeliv;
    stats.current_usage = solardevice.Usage;
    stats.total_return = solardevice.CounterDelivToday;
    stats.total_usage = solardevice.CounterToday;
  }

  var gasdevice = json.result.find(checkGasDevice);
  if (gasdevice) {
    stats.total_gas = gasdevice.CounterToday;
  }

  var weatherdevice = json.result.find(checkWeatherDevice);
  if (weatherdevice) {
    stats.forecast = weatherdevice.ForecastStr;
    stats.temp = weatherdevice.Temp;
  }

  return stats;
}
