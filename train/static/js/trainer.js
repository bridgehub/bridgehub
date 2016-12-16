var sectionList = [ //
{
	id : "MAJORRAISE",
	descr : "Trumfhöjningar till 1HÖ"
}, //
{
	id : "NTDEF",
	descr : "DONT NT-försvar"
},//
];

function getURLParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
	return "";
}

var startPage = $("#startPage");
var trainPage = $("#trainPage");
var ALL = $("#ALL");
var buttonStart = $("#buttonStart");
var biddingBox = $("#biddingBox");

var msg = $("#msg");
var msg1 = $("#msg1");
var msg2 = $("#msg2");
var msg3 = $("#msg3");
var msg4 = $("#msg4");

var data = $("#data");
var topMsg = $("#topMsg");

var sectionKeys = [];

var sectionData = {};

var storage = {};

function saveStorage() {
	localStorage.setItem('storage', storage);
}

function loadStorage() {
	storage = localStorage.getItem('storage');
}

function checkStorage() {
	if (typeof (localStorage) !== "undefined") {
		return true;
	} else {
		topMsg
				.html("<br />&nbsp; <b>ERROR: Your browser does not support HTML5 localStorage. "
						+ "Cannot continue. </b><br /><br />");
		return false;
	}
}

(function(yourcode) {
	yourcode(window.jQuery, window, document);
}
		(function($, window, document) {

			if (!checkStorage()) {
				return;
			}

			function loadSection(sectionKey) {
				// alert('Start AJAX: ' + 'data/' + sectionKey + '.json');
				$.ajax({
					url : 'data/' + sectionKey + '.json',
					type : 'get',
					async : true,
					success : function(json) {
						// alert('success: ' + json + ' ' + typeof (json));
						processSection(sectionKey, json);
					}
				});
			}

			function startClicked() {
				$(".sectionBox").each(function() {
					if ($(this).prop('checked')) {
						var section = this.id;
						sectionKeys.push(section);
						// alert('x: ' + section + ' ' + typeof (section));
					}
				});
				$.each(sectionKeys, function(ix, val) {
					loadSection(val);
				});
				startPage.hide();
				trainPage.show();
			}

			function allClicked() {
				var checked = ALL.prop('checked');
				// alert("checked: " + checked);
				$(".sectionBox").prop('checked', checked);
			}

			function bidClicked(cell) {
				var bid = $(cell);
				// var msg = "";
				// for ( var k in bid) {
				// msg += "KEY: " + k + " => " + bid[k] + "\n";
				// }
				var text = bid.text();
				msg.text(text);
			}

			var bidDenoms = //
			[ "&clubs;", "&diams;", "&hearts;", "&spades;", "NT" ];

			var colorDenom = //
			[ "#006600", "#CC2200", "#AA0000", "#0000AA", "black" ];

			function buildBiddingBox() {
				var ix = 0;
				for (var level = 7; level >= 1; level--) {

					var row = "";
					for (var denom = 4; denom >= 0; denom--) {
						var d = bidDenoms[denom];
						row += "<td id='x"
								+ (ix++)
								+ "' class='buttonBid' style='text-align:center;width:50px;color:"
								+ colorDenom[denom] + ";'>" + level + d
								+ "</td>";
					}
					row = "<tr>" + row + "</tr>";
					biddingBox.append(row + "\n");
				}
				$(".buttonBid").click(function() {
					bidClicked(this);
				})
			}

			function processSection(sectionKey, json) {
				alert('key: ' + sectionKey);
				data.text(json);
				sectionData[sectionKey] = json;
				msg4.append(sectionKey + " ");
			}

			function main() {
				for (var i = 0; i < sectionList.length; i++) {
					var id = sectionList[i]["id"];
					var descr = sectionList[i]["descr"];
					// <input type="checkbox" id="">abc</input><br />
					var item = "&nbsp;&nbsp;<input type='checkbox' class='sectionBox' id='{ID}'> &nbsp; {DESCR}</input><br />";
					item = item.replace("{ID}", id);
					item = item.replace("{DESCR}", descr);
					$("#sectionSelect").append(item);
				}

				buildBiddingBox();

				buttonStart.click(function() {
					startClicked();
				});

				ALL.change(function() {
					allClicked();
				});

				ALL.trigger('click');
				startPage.show();
			}

			$(function() {
				main();
			});
		}));
