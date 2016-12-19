var sectionList = [ //
{
	id : "MAJORRAISE",
	descr : "Trumfhöjningar till 1HÖ"
}, //
{
	id : "NEGDBL",
	descr : "Störd färgbudgivning"
}, //
{
	id : "MULTIDEF",
	descr : "Försvar mot 2RU Multi"
}, //
// {
// id : "NTDEF",
// descr : "DONT NT-försvar"
// },//
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
var buttonRestart = $("#buttonRestart");
var buttonPrev = $("#buttonPrev");
var buttonNext = $("#buttonNext");
var biddingBox = $("#biddingBox");
var bidding = $("#bidding");
var dealCount = $("#dealCount");

var south = $("#south");

var msg = $("#msg");
var msg1 = $("#msg1");
var msg2 = $("#msg2");
var msg3 = $("#msg3");
var msg4 = $("#msg4");
var errMsg = $("#errMsg");

var yourBid = $("#yourBid");

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

var errorTimer = -99;

var yourBidTimer = -99;

function setError(msg, timeout) {
	// var m = "<span>&nbsp;{MSG}&nbsp;</span>";
	errMsg.css('font-weight', 'bold');
	errMsg.css('background-color', 'yellow');
	errMsg.css('color', 'red');
	msg = '&nbsp;' + msg + '&nbsp;';
	errMsg.html(msg);
	errorTimer = timeout;
}

function setInfo(msg, timeout) {
	// var m = "<span>&nbsp;{MSG}&nbsp;</span>";
	errMsg.css('font-weight', 'normal');
	errMsg.css('background-color', '#88FF88');
	errMsg.css('color', 'black');
	msg = '&nbsp;' + msg + '&nbsp;';
	errMsg.html(msg);
	errorTimer = timeout;
}

function clearError() {
	errMsg.css('background-color', '#FFFFFF');
	errMsg.css('color', '#FFFFFF');
	errMsg.html('&nbsp;');
	errorTimer = 0;
}

function setYourBid() {
	yourBid.css('background-color', '#FFFF00');
	yourBidTimer = 7;
}

function clearYourBid() {
	yourBid.css('background-color', '#FFFFFF');
	yourBidTimer = 0;
}

function startTimer() {
	if (errorTimer >= 0) {
		return;
	}
	errorTimer = 0;
	yourBidTimer = 0;
	setInterval(function() {
		if (errorTimer == 1) {
			clearError();
		}
		if (errorTimer >= 1) {
			errorTimer--;
		}
		if (yourBidTimer == 1) {
			clearYourBid();
		}
		if (yourBidTimer >= 1) {
			yourBidTimer--;
		}
	}, 100);
}

function checkStorage() {
	// NOT USED YET
	return true;
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

			var DEALS = [];
			var BID_IX = 0;
			var CURRENT_DEAL;
			var N = 0;
			var L = 0;
			var BIDDER = 0;
			var DEALER = 0;
			var BID_ROUND = 0;

			function loadSection(sectionKey) {
				$.ajaxSetup({
					cache : false
				});
				$.ajax({
					url : 'data/' + sectionKey + '.json',
					type : 'get',
					async : true,
					cache : false,
					success : function(json) {
						// alert('success: ' + json.length);
						processSection(sectionKey, json);
					}
				});
			}

			var requiredSections = 0;
			var loadedSections = 0;

			function startClicked() {
				sectionKeys = [];
				sectionData = {};
				loadedSections = 0;
				requiredSections = 0;
				$(".sectionBox").each(function() {
					if ($(this).prop('checked')) {
						var section = this.id;
						sectionKeys.push(section);
						// alert('x: ' + section + ' ' + typeof (section));
					}
				});
				// alert('sectionKeys: ' + sectionKeys);
				$.each(sectionKeys, function(ix, val) {
					requiredSections++;
				});
				if (requiredSections <= 0) {
					alert('Du måste välja minst en sektion ur listan.');
					return;
				}
				$.each(sectionKeys, function(ix, val) {
					loadSection(val);
				});
			}

			function restartClicked() {
				trainPage.hide();
				startPage.show();
			}

			function allClicked() {
				var checked = ALL.prop('checked');
				// alert("checked: " + checked);
				$(".sectionBox").prop('checked', checked);
			}

			function bidClicked(cell) {
				clearError();
				if (BID_IX >= BIDS.length) {
					setInfo(
							"Budgivningen &auml;r avslutad. V&auml;lj 'N&auml;sta giv'.",
							20);
					return;
				}
				var bid = $(cell);
				var text = bid.text();
				var id = bid.attr('id');
				// setError('Otillr&auml;ckligt bud: ' + text, 12);
				var expected = BIDS[BID_IX];
				var actual;
				if (id.search("_") == 1) {
					var tokens = id.split("_");
					actual = tokens[0] + tokens[1];
				} else {
					actual = id;
				}
				var ok = (expected === actual);
				// alert('expected: ' + expected + ' actual: ' + actual + ' => '
				// + ok);
				if (!ok) {
					setError('Det finns ett b&auml;ttre bud!', 8);
					return;
				}

				var bidder = (DEALER + BID_IX) % 4;
				var selector = biddingCell(bidder, BID_ROUND);
				// alert('selector: ' + selector);
				$(selector).html(htmlCenter(htmlBid(expected)));
				BID_IX++;
				BID_ROUND++;
				play();
			}

			function nextClicked() {
				if (N >= L - 1) {
					setInfo(
							"Detta var sista given i detta urval.&nbsp;<br />&nbsp;Klicka på 'Nytt urval' för att välja nya givar.",
							30);
					return;
				}
				N++;
				loadDeal();
				play();
			}

			function prevClicked() {
				if (N <= 0) {
					setInfo('Detta är första given.', 15);
					return;
				}
				N--;
				loadDeal();
				play();
			}

			var suitSym = //
			[ "&spades;", "<span style='color:red;'>&hearts;</span>",
					"<span style='color:red;'>&diams;</span>", "&clubs;" ];

			var bidSymbols = //
			[ "&clubs;", "&diams;", "&hearts;", "&spades;", "NT" ];

			var bidDenoms = //
			[ "C", "D", "H", "S", "N" ];

			var colorDenom = //
			[ "#006600", "#CC2200", "#AA0000", "#0000AA", "black" ];

			function htmlCenter(s) {
				return "<center>" + s + "</center>"
			}

			function htmlBid(s) {
				if (s === "?") {
					return "?";
				}
				if (s === "P") {
					return "<span style='color:green'>PASS</span>";
				}
				if (s === "X") {
					return "<span style='color:red'>X</span>";
				}
				if (s === "XX") {
					return "<span style='color:blue'>XX</span>";
				}
				var level = s.charAt(0);
				var denom = s.charAt(1);
				var color = colorDenom["CDHSN".search(denom)];
				var symbol = bidSymbols["CDHSN".search(denom)];
				var html = "<span style='color:{COLOR}'>{LEVEL}{SYMBOL}</span>{ALERT}";
				if (s.search('\\*') >= 1) {
					html = html.replace('{ALERT}', '<sup><b>&#42;</b></sup>');
				} else {
					html = html.replace('{ALERT}', '');
				}
				return html.replace("{COLOR}", color).replace("{LEVEL}", level)
						.replace("{SYMBOL}", symbol);
			}

			function buildBiddingBox() {
				var ix = 0;
				row = "<tr><td id='X' class='buttonBid' colspan='3' style='background-color:#FF0000;color:white'><center> DOUBLE </center></td>"
						+ "<td id='XX' class='buttonBid' colspan='2' style='background-color:#0000BB;color:white'><center>REDOUBLE</center></td></tr>";
				biddingBox.append(row + "\n");
				for (var level = 7; level >= 1; level--) {
					var row = "";
					for (var denom = 4; denom >= 0; denom--) {
						var d = bidDenoms[denom];
						var bid = '' + level + '' + d;
						var id = level + '_' + d;
						row += "<td id='" + id
								+ "' class='buttonBid' style='width:50px;'>"
								+ htmlCenter(htmlBid(bid)) + "</td>";
					}
					row = "<tr>" + row + "</tr>";
					biddingBox.append(row + "\n");
				}
				row = "<tr><td id='P' class='buttonBid' colspan='5' style='background-color:#00AA00;color:white'><center>PASS</center></td></tr>";
				biddingBox.append(row + "\n");
				$(".buttonBid").click(function() {
					bidClicked(this);
				})
			}

			function biddingCell(bidder, bid_round) {
				var x = 1 + ((1 + bidder) % 4);
				var y = (2 + bid_round);
				var selector = "#bidding tr:nth-child({Y}) td:nth-child({X})";
				return selector.replace("{X}", x).replace("{Y}", y);
			}

			function play() {
				while (true) {
					var bidder = (DEALER + BID_IX) % 4;
					if (BID_IX >= BIDS.length) {
						setInfo('Budgivningen &auml;r avslutad.', 12);
						break;
					}
					var nextBid = BIDS[BID_IX];
					if (bidder == 2) {
						nextBid = "?";
						setYourBid();
					}
					var selector = biddingCell(bidder, BID_ROUND);
					$(selector).html(htmlCenter(htmlBid(nextBid)));
					if (bidder == 2) {
						break;
					}
					BID_IX++;
				}
				// var bidder = (DEALER + BID_IX) % 4;
				// var selector = biddingCell(bidder, BID_ROUND);
				// // alert(selector);
				// $(selector).text("?");
				// // alert(BID_IX);
				startPage.hide();
				trainPage.show();
			}

			function initTrainer() {
				DEALS = [];
				for ( var sectionKey in sectionData) {
					DEALS = DEALS.concat(sectionData[sectionKey]);
				}
				L = DEALS.length;
				for (var i = 0; i < L; i++) {
					var r = randomInt(0, L);
					// msg4.append('' + r + ' ');
					var t = DEALS[i];
					DEALS[i] = DEALS[r];
					DEALS[r] = t;
				}
				// msg3.append('' + L);
				// for (var i = 0; i < L; i++) {
				// var cards = DEALS[i]['cards'];
				// // msg1.append('' + ' ' + cards + '<br />');
				// }
				// alert('L: ' + L);
				N = 0;
				loadDeal();
				play();
			}

			function parseCards(cards) {
				// alert('cards: ' + cards);
				var result = {};
				var handList = cards.split(" ");
				var firstHand = handList[0];
				var handId = "S";
				if (firstHand.search(":") >= 1) {
					var tokens = firstHand.split(":");
					handId = tokens[0];
					handList[0] = tokens[1];
				}
				result[0] = "?";
				result[1] = "?";
				result[2] = "?";
				result[3] = "?";
				var handIx = "NESW".search(handId);
				for (var i = 0; i < handList.length; i++) {
					result[(i + handIx) % 4] = handList[i];
				}
				return result;
			}

			function parseBids(bids) {
				// alert('bids: ' + bids);
				var result = {};
				var bidList = bids.split(" ");
				var firstBid = bidList[0];
				var dealer = "S";
				if (firstBid.search(":") >= 1) {
					var tokens = firstBid.split(":");
					dealer = tokens[0];
					bidList[0] = tokens[1];
				}
				result['dealer'] = dealer;
				result['bids'] = bidList;
				return result;
			}

			function parseDeal(h) {
				var result = {}
				result['cards'] = parseCards(h['cards']);
				result['bids'] = parseBids(h['bids']);
				return result;
			}

			function clearDeal() {
				$(".bidCell").html("&nbsp;");
			}

			function loadDeal() {
				clearDeal();
				var currentDeal = DEALS[N];
				var deal = parseDeal(currentDeal);
				deal['DESCR'] = currentDeal['DESCR'];
				south.html('<br />');
				for (var i = 0; i < 4; i++) {
					var cards = deal['cards'][2].split(".")[i];
					south.append('' + suitSym[i] + ' ' + cards + '<br />');
				}
				// south.append('<br />');
				BID_IX = 0;
				BID_ROUND = 0;
				DEALER = "NESW".search(deal['bids']['dealer']);
				BIDS = deal['bids']['bids'];
				// alert('BIDS: ' + BIDS);
				CURRENT_DEAL = deal;
				var dealText = '' + (1 + N) + ' / ' + L;
				dealCount.text(dealText);
				if (isLocalhost()) {
					topMsg.html(CURRENT_DEAL['DESCR']);
				}
				return deal;
			}

			function isLocalhost() {
				var hostname = window.location.hostname;
				return (hostname.startsWith("localhost") //
				|| hostname.startsWith("127."));
			}

			function validateData(cards, bids) {
				if (isLocalhost()) {
					if (cards.search("S:") != 0) {
						alert("INCORRECT CARDS: " + cards);
					}
					if ((!bids.startsWith("N:") //
							&& !bids.startsWith("S:") //
							&& !bids.startsWith("E:") // 
					&& !bids.startsWith("W:")) || bids.endsWith("P P P P")
							|| !bids.endsWith(" P P P")
							|| bids.search("NT") >= 0) {
						alert("INCORRECT BIDS: " + bids);
					}
				}
			}

			function processSection(sectionKey, json) {
				// alert('key: ' + sectionKey);
				// data.text(json);
				var json2 = [];
				for (var i = 0; i < json.length; i++) {
					var item = json[i];
					for ( var key in item) {
						if (key === 'cards') {
							if ("" !== item[key]) {
								var cards = item[key];
								var bids = item['bids'];
								validateData(cards, bids);
								json2.push(item);
							}
						}
					}
				}
				sectionData[sectionKey] = json2;
				// msg4.append(sectionKey + " ");
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

				buttonRestart.click(function() {
					restartClicked();
				});

				buttonPrev.click(function() {
					prevClicked();
				});

				buttonNext.click(function() {
					nextClicked();
				});

				ALL.change(function() {
					allClicked();
				});

				ALL.trigger('click');
				startPage.show();

				buttonStart.focus();

				startTimer();
			}

			$(function() {
				main();
			});
		}));
