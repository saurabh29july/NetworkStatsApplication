//Global Variables
var sdnControllerURL = null;
var sdnControllerUserName = null;
var sdnControllerPassword = null;
var base64EncodedPassword = null;

// Get the values supplied
// Store them in global valiables
// Populate Network Device section
// Show Network Devices
function trackNetworkStatisticsClicked() {

	sdnControllerURL = $("#url").val();
	sdnControllerUserName = $("#username").val();
	sdnControllerPassword = $("#password").val();
	base64EncodedPassword = "Basic "
			+ btoa(sdnControllerUserName + ":" + sdnControllerPassword);

	console.log(sdnControllerURL);
	console.log(sdnControllerUserName);
	console.log(sdnControllerPassword);
	console.log(base64EncodedPassword);

	if (ifCredentialsNotNull(sdnControllerUserName, sdnControllerPassword)) {
		populateNetworkNodes();
	} else {
		alert("Trying error cases huhh..? Please enter createndials.");
	}
}

// Fetch network nodes from OpenDaylight
// Populate Network Device section
// Show Network Devices
function populateNetworkNodes() {
	var nodes = null;
	$
			.ajax({
				url : sdnControllerURL
						+ "/controller/nb/v2/switchmanager/default/nodes",
				type : "GET",
				async : false,
				contentType : "application/json",
				success : function(data, textStatus, jqXHR) {
					console.log(data);
					nodes = data;
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert("Unable to fetch OpenDaylight Nodes.\nDid you supply the credentials correct?");
				},
				beforeSend : function(xhr) {
					// Default Base64 Encoding for (admin/admin)
					xhr
							.setRequestHeader("Authorization",
									base64EncodedPassword);
				}
			});

	if (nodes != null && nodes != undefined) {
		// Construct divs
		$.each(nodes.nodeProperties, function(index, value) {
			var div = getNetworkDeviceDiv(value.properties.description.value,
					value.node.id, value.properties.macAddress.value,
					value.properties.timeStamp.value);
			$("#nodesDiv").append(div);
		});

		$("#nodesDiv").removeClass("hidden").addClass("visible");
		$("#nodesButton").removeClass("visible").addClass("hidden");

	}

}

// Method to create the network device div programatically
// No logic here, just plain factory generating divs on supplied inputs
function getNetworkDeviceDiv(name, id, mac, upTime) {
	var div = '<div class="col-sm-6 col-md-4"><div class="thumbnail"><br /> <br /> <img src="img/device.png"><div class="caption">';
	div += '<h4>' + name + '</h4>';
	div += '<ul class="list-group">';
	div += '<li class="list-group-item"><b>Id:</b> ' + id + '</li>';
	div += '<li class="list-group-item"><b>Name:</b> ' + name + '</li>';
	div += '<li class="list-group-item"><b>MAC:</b> ' + mac + '</li>';
	div += '<li class="list-group-item"><b>Connected Since:</b> ' + upTime
			+ '</li>';
	div += '</ul><p>';
	div += '<a href="javascript:showSwitchPortStats(\''
			+ name
			+ '\',\''
			+ id
			+ '\')" class="btn btn-success" role="button">Port Stats</a> &nbsp;&nbsp;';
	div += '<a href="javascript:showSwitchTableStats(\'' + name + '\',\'' + id
			+ '\')" class="btn btn-success" role="button">Table Stats</a>';
	div += '</p></div></div></div>';

	return div;
}

// Fetch ports for a node from OpenDaylight
// Populate ports stats section
function showSwitchPortStats(name, id) {
	var ports = null;
	$
			.ajax({
				url : sdnControllerURL
						+ "/controller/nb/v2/statistics/default/port/node/OF/"
						+ id,
				type : "GET",
				async : false,
				contentType : "application/json",
				success : function(data, textStatus, jqXHR) {
					console.log(data);
					ports = data;
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert("Unable to fetch OpenDaylight Node Ports.\nDid you supply the credentials correct?");
				},
				beforeSend : function(xhr) {
					// Default Base64 Encoding for (admin/admin)
					xhr
							.setRequestHeader("Authorization",
									base64EncodedPassword);
				}
			});

	if (ports != null && ports != undefined) {
		// Construct divs
		var finalDiv = '<div class="col-lg-12"><div class="panel panel-success"><div class="panel-heading"><h4>';
		finalDiv += name + ' : Port Statistics</h4>';
		finalDiv += '</div><div class="panel-body">';

		// For each port create a sub element in the final div
		$.each(ports.portStatistic, function(index, value) {
			var div = getPortsDiv(value.nodeConnector.id, value.receivePackets,
					value.transmitPackets, value.receiveBytes,
					value.transmitBytes, value.receiveDrops,
					value.transmitDrops);
			finalDiv += div;
		});

		finalDiv += '</div></div></div>';
		$("#portDiv").append(finalDiv);
		$("#portDiv").removeClass("hidden").addClass("visible");
		$("#portButton").removeClass("visible").addClass("hidden");

	}

}

// Method to create the port stats div programatically
// No logic here, just plain factory generating divs on supplied inputs
function getPortsDiv(portId, receivePackets, transmitPackets, receiveBytes,
		transmitBytes, receiveDrops, transmitDrops) {
	var div = '<div class="col-sm-2 col-md-2"><div class="thumbnail"><img src="img/port.png" alt="..." height="60" width="60"><div class="caption">';
	div += '<p align="center">Port ' + portId + '</p></div>';
	div += 'Packet Rx: ' + receivePackets + '<br /> Packet Tx: '
			+ transmitPackets + '<br />Byte Rx: ' + receiveBytes
			+ '<br />Byte Tx: ' + transmitBytes + '<br />Drop Rx: '
			+ receiveDrops + '<br />Drop Tx: ' + transmitDrops + '</div></div>';
	return div;
}

// Fetch table stats for a node from OpenDaylight
// Populate table stats section
function showSwitchTableStats(name, id) {
	var tableStats = null;
	$
			.ajax({
				url : sdnControllerURL
						+ "/controller/nb/v2/statistics/default/table/node/OF/"
						+ id,
				type : "GET",
				async : false,
				contentType : "application/json",
				success : function(data, textStatus, jqXHR) {
					console.log(data);
					tableStats = data;
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert("Unable to fetch OpenDaylight Node Table Stats.\nDid you supply the credentials correct?");
				},
				beforeSend : function(xhr) {
					// Default Base64 Encoding for (admin/admin)
					xhr
							.setRequestHeader("Authorization",
									base64EncodedPassword);
				}
			});

	if (tableStats != null && tableStats != undefined) {
		// Construct divs
		var firstTable = null;
		var finalDiv = '<div class="col-lg-12"><div class="panel panel-success"><div class="panel-heading">';
		finalDiv += '<h4>' + name + ' : Table Statistics</h4>';

		// I'm only considering one table for this demo project.
		// You can actually iterate thru them to have multiple as per OF spec
		$.each(tableStats.tableStatistic, function(index, value) {
			firstTable = value;
			return;
		});

		finalDiv += '</div><div class="panel-body"><p>Table Id: '
				+ firstTable.nodeTable.id + '</p></div>';
		finalDiv += '<ul class="list-group">';
		finalDiv += '<li class="list-group-item"><span class="badge badge-success">'
				+ firstTable.activeCount + '</span>Active Count</li>';
		finalDiv += '<li class="list-group-item"><span class="badge badge-success">'
				+ firstTable.lookupCount + '</span>Lookup Count</li>';
		finalDiv += '<li class="list-group-item"><span class="badge badge-success">'
				+ firstTable.matchedCount + '</span>Matched Count</li>';
		finalDiv += '<li class="list-group-item"><span class="badge badge-success">'
				+ firstTable.maximumEntries
				+ '</span>Maximum Supported Entries</li>';
		finalDiv += '</ul></div></div>';

		$("#tableDiv").append(finalDiv);
		$("#tableDiv").removeClass("hidden").addClass("visible");
		$("#tableButton").removeClass("visible").addClass("hidden");

	}

}

// Utility function to check not null user name password
function ifCredentialsNotNull(username, password) {

	if (username != null && password != null && username != ''
			&& password != '') {
		return true;
	}

	return false;

}