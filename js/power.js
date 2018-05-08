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
    url: "http://" + domoticz.server + ":" + domoticz.port + "/json.htm?type=devices&filter=utility&used=true&order=[Order]&plan=0",
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
    $('#currentUsage').text(data.current_usage);
    $('#currentReturn').text(data.current_return);
    $('#totalUsage').text(data.total_usage);
    $('#totalReturn').text(data.total_return);
    $('#totalGas').text(data.total_gas);
    $('#sunrise').html("&uarr;" + data.sunrise + " &darr;" + data.sunset);
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
      return result.idx == domoticz.devices.solar;
  }

  function checkGasDevice(result) {
    return result.idx == domoticz.devices.gas;
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

  return stats;
  
  /*
  {
   "ActTime" : 1525715734,
   "ServerTime" : "2018-05-07 19:55:34",
   "Sunrise" : "05:54",
   "Sunset" : "21:12",
   "result" : [
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "Counter" : "1812.630",
         "CounterDeliv" : "3305.128",
         "CounterDelivToday" : "32.532 kWh",
         "CounterToday" : "1.115 kWh",
         "CustomImage" : 0,
         "Data" : "970326;842304;988868;2316260;0;72",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 3,
         "HardwareName" : "Smart meter",
         "HardwareType" : "P1 Smart Meter USB",
         "HardwareTypeVal" : 4,
         "HaveTimeout" : false,
         "ID" : "1",
         "LastUpdate" : "2018-05-07 19:55:33",
         "Name" : "Power",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "Energy",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "P1 Smart Meter",
         "TypeImg" : "counter",
         "Unit" : 1,
         "Usage" : "0 Watt",
         "UsageDeliv" : "72 Watt",
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "6"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "Counter" : "959.485",
         "CounterToday" : "0.290 m3",
         "CustomImage" : 0,
         "Data" : "959.485",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 3,
         "HardwareName" : "Smart meter",
         "HardwareType" : "P1 Smart Meter USB",
         "HardwareTypeVal" : 4,
         "HaveTimeout" : false,
         "ID" : "1",
         "LastUpdate" : "2018-05-07 19:54:12",
         "Name" : "Gas",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "Gas",
         "SwitchTypeVal" : 1,
         "Timers" : "false",
         "Type" : "P1 Smart Meter",
         "TypeImg" : "counter",
         "Unit" : 2,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "8"
      }
   ],
   "status" : "OK",
   "title" : "Devices"
}

*/
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
