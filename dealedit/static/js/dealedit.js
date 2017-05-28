(function(yourcode) {
	yourcode(window.jQuery, window, document);
}
		(function($, window, document) {

			var BR = '<br />';
			var NL = '\n';
			var BR_NL = BR + NL;
			var NBSP = '&nbsp;';

			var CLUBS = 0;
			var DIAMS = 1;
			var HEARTS = 2
			var SPADES = 3;
			var NT = 4;

			var SYM_SUIT = {};
			SYM_SUIT[CLUBS] = '&clubs;';
			SYM_SUIT[DIAMS] = '&diams;';
			SYM_SUIT[HEARTS] = '&hearts;';
			SYM_SUIT[SPADES] = '&spades;';
			SYM_SUIT[NT] = 'NT';

			var north = $("#north");
			var east = $("#east");
			var south = $("#south");
			var west = $("#west");

			var hrefNewURL = $("#hrefNewURL");
			var msg = $("#msg");

			var card_html = "<span class='card' id='{id}'>&nbsp;</span>";
			var card_id = "C_{hand}_{suit}_{ix}";

			function cardId(hand, suit, ix) {
				return card_id.replace('{hand}', hand).replace('{suit}', suit) //
				.replace('{ix}', ix);
			}

			function cardHtml(hand, suit, ix) {
				return card_html.replace('{id}', cardId(hand, suit, ix));
			}

			function suitHtml(hand, suit) {
				var res = SYM_SUIT[suit] + NBSP;
				for (var i = 0; i < 13; i++) {
					res += cardHtml(hand, suit, i)
				}
				return res + BR_NL;
			}

			function handHtml(hand) {
				var res = "<span class='card'><u>" + hand + "</u></span>"
						+ BR_NL;
				for (var i = SPADES; i >= CLUBS; i--) {
					res += suitHtml(hand, i);
				}
				return res;
			}

			function decodeURL(url) {
				var res = url.replace(new RegExp('%2C', 'g'), ',');
				res = res.replace(new RegExp('%20', 'g'), ' ');
				return res;
			}

			function parseBBOURL(url) {
				var res = {};

				var urlParams = {};

				res['mb'] = [];
				url = decodeURL(url);
				var tok = url.split(new RegExp('[&\?]', 'g'));

				for (var i = 0; i < tok.length; i++) {
					var prop = tok[i].split('=');
					if (prop[0] === 'lin') {
						lin = prop[1];
					}
				}
				if (lin) {
				} else {
					res['error'] = 'No lin parameter found';
					msg.text(JSON.stringify(res));
					return res;
				}
				tok = lin.split('|');
				var key;
				var value;
				for (var i = 0; i < tok.length; i++) {
					if (i % 2 == 0) {
						key = tok[i];
					} else {
						value = tok[i];
						if (key === 'mb') {
							if (!value === 'p') {
								res[key].push(value);
							}
						} else {
							res[key] = value;
						}
					}
				}
				msg.text(JSON.stringify(res));
				// $("outURL").html(JSON.stringify(res));
				return res;
			}

			function parseDeal() {
			}

			function btnLoadClicked() {
				var txt = '';
				var inp0 = '' + $('#inputURL').val();
				// alert('.\n.\n' + inp0.substring(0, 20) + '.\n.\n');
				var inp = decodeURL(inp0);
				// alert('.\n.\n' + inp.substring(0, 20) + '.\n.\n');
				var deal0 = parseBBOURL(inp);
				var deal = parseDeal(deal0);
			}

			function loadData() {
			}

			function saveData() {
			}

			function init() {
				$('#inputURL').focus();
				north.html(handHtml("N"));
				south.html(handHtml("S"));
				east.html(handHtml("E"));
				west.html(handHtml("W"));
				$('#btnLoad').click(btnLoadClicked);
			}

			function update() {
				$("#C_N_3_0").text('J');
				$("#C_N_3_1").text('T');
				hrefNewURL.attr('target', ('' + new Date().getTime()));
				hrefNewURL
						.attr(
								'href',
								'http://www.bridgebase.com/tools/handviewer.html?bbo=y&lin=pn|stefan_o,~~M55917,~~M55415,~~M55416|st||md|3S56KH7KD2389JKCKA%2CSH45QD46QAC24689Q%2CS238TJAH389TAD5TC%2C|rh||ah|Board 1|sv|o|mb|p|mb|p|mb|1D|an|Minor suit opening -- 3%2B !D%3B 11-21 HCP%3B |mb|p|mb|1S|an|One over one -- 4%2B !S%3B 11- HCP%3B 6-12 total points |mb|p|mb|2N|an|Jump in notrump -- 2-4 !C%3B 3-5 !D%3B 2-4 !|mb|p|mb|3H|an|5%2B !H%3B 5%2B !S%3B 11- HCP%3B 6-12 total points |mb|p|mb|4S|an|2-4 !C%3B 3-5 !D%3B 2-4 !H%3B 3 !S%3B 18-19 HCP%3B|mb|p|mb|5C|an|Cue bid -- 5%2B !H%3B 5%2B !S%3B 11 HCP%3B !CA%3B 12 total points%3B forcing |mb|p|mb|5S|an|2-4 !C%3B 3-5 !D%3B 2-4 !H%3B 3 !S%3B 18-19 HCP%3B|mb|p|mb|p|mb|p|pc|D7|pc|D2|pc|DQ|pc|DT|pc|DA|pc|D5|pc|H2|pc|D3|pc|D6|pc|SA|pc|C3|pc|D8|pc|SJ|pc|SQ|pc|SK|pc|C6|pc|CA|pc|C9|pc|H3|pc|C7|pc|CK|pc|C4|pc|H8|pc|C5|pc|HK|pc|H4|pc|H9|pc|H6|pc|H7|pc|H5|pc|HA|pc|HJ|pc|HT|pc|S7|pc|D9|pc|HQ|pc|CJ|pc|S5|pc|C8|pc|S2|pc|S6|pc|C2|pc|ST|pc|S4|pc|S8|pc|S9|pc|DJ|pc|D4|pc|CT');
				hrefNewURL.text('xxx');
			}

			$(function() {
				init();
				update();
			});
		}));
