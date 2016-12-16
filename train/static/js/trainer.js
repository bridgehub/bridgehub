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

function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

var startPage = $("#startPage");
var trainPage = $("#trainPage");
var ALL = $("#ALL");
var buttonStart = $("#buttonStart");
var biddingBox = $("#biddingBox");

var south = $("#south");

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

			var requiredSections = 0;
			var loadedSections = 0;

			function startClicked() {
				$(".sectionBox").each(function() {
					if ($(this).prop('checked')) {
						var section = this.id;
						sectionKeys.push(section);
						// alert('x: ' + section + ' ' + typeof (section));
					}
				});
				loadedSections = 0;
				requiredSections = 0;
				$.each(sectionKeys, function(ix, val) {
					requiredSections++;
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

			var suitSym = //
			[ "&spades;", "<span style='color:red;'>&hearts;</span>",
					"<span style='color:red;'>&diams;</span>", "&clubs;" ];

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

			var deals = [];
			var N = 0;
			var L = 0;
			var currentDeal;

			function initTrainer() {
				deals = [];
				for ( var sectionKey in sectionData) {
					deals = deals.concat(sectionData[sectionKey]);
				}
				L = deals.length;
				for (var i = 0; i < L; i++) {
					var r = randomInt(0, L);
					msg4.append('' + r + ' ');
					var t = deals[i];
					deals[i] = deals[r];
					deals[r] = t;
				}
				msg3.append('' + L);
				for (var i = 0; i < L; i++) {
					var cards = deals[i]['cards'];
					msg1.append('' + suitSym[i] + ' ' + cards + '<br />');
				}
				N = 0;
				loadDeal();
			}

			function parseDeal(h) {
				var result = {}
				var hand = {};
				var suits = h['cards'].split(':')[1].split('.');
				hand[0] = suits[0];
				hand[1] = suits[1];
				hand[2] = suits[2];
				hand[3] = suits[3];
				result[0] = hand;
				return result;
			}

			function loadDeal() {
				var currentDeal = deals[N];
				var deal = parseDeal(currentDeal);
				south.html('');
				for (var i = 0; i < 4; i++) {
					south.append('' + suitSym[i] + ' ' + cards + '<br />');
				}
			}

			function processSection(sectionKey, json) {
				// alert('key: ' + sectionKey);
				data.text(json);
				sectionData[sectionKey] = json;
				msg4.append(sectionKey + " ");
				loadedSections++;
				if (loadedSections >= requiredSections) {
					initTrainer();
				}
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
