(function(yourcode) {
	yourcode(window.jQuery, window, document);
}
		(function($, window, document) {

			var logEnabled = true;
			function LOG(s) {
				if (logEnabled) {
					if (console) {
						console.log(JSON.stringify(s));
					}
				}
			}

			var BR = '<br />';
			var NL = '\n';
			var BR_NL = BR + NL;
			var NBSP = '&nbsp;';

			var NORTH = 0;
			var EAST = 1;
			var SOUTH = 2
			var WEST = 3;
			var DECK = 4;

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

			var SUIT_CHARS = [ 'C', 'D', 'H', 'S', 'N' ];
			var PLAYER_CHARS = [ 'N', 'E', 'S', 'W', 'D' ];
			var PLAYER_TEXT = [ 'North', 'East', 'South', 'West', 'Deck' ];
			var RANK_CHARS = [ '', '', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];

			var north = $("#north");
			var east = $("#east");
			var south = $("#south");
			var west = $("#west");
			var deck = $("#deck");

			var hrefNewURL = $("#hrefNewURL");
			var msg = $("#msg");

			var card_html = "<span class='card' id='{id}'>&nbsp;</span>";
			var card_id = "C_{hand}_{suit}_{ix}";

			// function msgAdd(m) {
			// var txt = msg.text();
			// txt = JSON.stringify(m) + ' --- ' + txt;
			// msg.text(txt);
			// }
			//
			// function msgText(s) {
			// var txt = JSON.stringify(s);
			// msg.text(s);
			// }

			function randomInt(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			}

			function sortDeal(deal) {
				for (var h = NORTH; h <= DECK; h++) {
					sortHand(deal[h]);
				}
				return deal;
			}

			function sortHand(hand) {
				for (var s = CLUBS; s <= SPADES; s++) {
					sortSuit(hand[s]);
				}
			}

			function sortSuit(suit) {
				suit.sort(function(x, y) {
					var xx = RANK_CHARS.indexOf(x);
					var yy = RANK_CHARS.indexOf(y);
					if (yy < 0) {
						return -1;
					}
					if (xx < 0) {
						return 1;
					}
					return (yy - xx);
				});
			}

			function cardId(hand, suit, ix) {
				return card_id.replace('{hand}', hand).replace('{suit}', suit) //
				.replace('{ix}', ix);
			}

			function cardHtml(hand, suit, ix) {
				return card_html.replace('{id}', cardId(hand, suit, ix));
			}

			function suitHtml(hand, suit) {
				var res = '<span class="col' + suit + '">' + SYM_SUIT[suit] + '</span>' + NBSP;
				for (var i = 0; i < 13; i++) {
					res += cardHtml(hand, suit, i)
				}
				return res + BR_NL;
			}

			function handHtml(hand, label) {
				var res = "<span id='H_{id}' class='player'><u>" + label + "</u></span>" + BR_NL;
				res = res.replace('{id}', '' + hand);
				for (var i = SPADES; i >= CLUBS; i--) {
					res += suitHtml(hand, i);
				}
				return res;
			}

			function addCard(suit, sRank) {
				for (var pos = 0; pos <= 12; pos++) {
					if (suit[pos]) {
					} else {
						suit[pos] = sRank;
						return;
					}
				}
			}

			function playerClicked() {
				var id = $(this).attr('id');
				var tok = id.split('_');
				var hand = parseInt(tok[1]);
				if (hand >= NORTH && hand <= WEST) {
					var deal = load('deal');
					deal['active'] = hand;
					save('deal', deal);
					displayActiveHand();
				}
			}

			function displayContract(key, val) {
				var deal = load('deal');
				var level = deal['level'];
				var denom = deal['denom'];
				var declarer = deal['declarer'];
				if (level) {
				} else {
					level = 1;
				}
				if (denom || 0 === denom) {
				} else {
					denom = NT;
				}
				if (declarer || 0 === declarer) {
				} else {
					declarer = SOUTH;
				}
				if ('LVL' === key) {
					level = val;
				}
				if ('DENOM' === key) {
					denom = val;
				}
				if ('PLAYER' === key) {
					declarer = val;
				}
				var contract = level + '<span class=\'col' + denom + '\'>' + SYM_SUIT[denom] + '</span> by ' + PLAYER_TEXT[declarer];
				LOG(contract)
				deal['level'] = level;
				deal['denom'] = denom;
				deal['declarer'] = declarer;
				save('deal', deal);
				$('#txtContract').html(contract);
			}

			function contractClicked() {
				var id = $(this).attr('id');
				var tok = id.split('_');
				var key = tok[0];
				var val = parseInt(tok[1]);
				displayContract(key, val);
			}

			function cardClicked() {
				var id = $(this).attr('id');
				var tok = id.split('_');
				var hand = parseInt(tok[1]);
				var suit = parseInt(tok[2]);
				var pos = parseInt(tok[3]);

				var sHand = PLAYER_CHARS[hand];
				var sSuit = SUIT_CHARS[suit];
				var deal = load('deal');
				var sRank = deal['hands'][hand][suit][pos];

				if (sRank) {
				} else {
					return;
				}

				if (DECK === hand) {
					var active = deal['active'];
					if (active >= NORTH && active <= WEST) {
						addCard(deal['hands'][active][suit], sRank);
						deal['hands'][hand][suit].splice(pos, 1);
						deal['hands'][hand][suit].push(undefined);
						save('deal', deal);
					}
				} else {
					addCard(deal['hands'][DECK][suit], sRank);
					deal['hands'][hand][suit].splice(pos, 1);
					deal['hands'][hand][suit].push(undefined);
					deal['active'] = hand;
					save('deal', deal);
				}
				displayDeal();
				// msg.text(JSON.stringify(tok));
				LOG(sHand + ':' + sSuit + ':' + sRank);
			}

			function decodeURL(url) {
				var res = url;
				res = res.replace(new RegExp('%2C', 'g'), ',');
				res = res.replace(new RegExp('%20', 'g'), ' ');
				res = res.replace(new RegExp('%21', 'g'), '!');
				res = res.replace(new RegExp('%3B', 'g'), ';');
				res = res.replace(new RegExp('%7C', 'g'), '|');
				return res;
			}

			// deal-format:
			// suit = {} //ranks falling 'A','K','Q','J','T','9',...
			// hand => 4*suit; // 0=north, etc
			// hands = 4*hand;
			// deal = {'hands':hands, 'declarer':0..3,
			// / / / / 'denom': 0..4, 'level': 1..7}

			function initDeal() {
				var deal = load('deal');
				var level = 1;
				var denom = NT;
				var declarer = SOUTH;
				if (deal) {
					if (deal['declarer'] || 0 === deal['declarer']) {
						declarer = deal['declarer'];
					}
					if (deal['denom'] || 0 === deal['denom']) {
						denom = deal['denom'];
					}
					if (deal['level']) {
						level = deal['level'];
					}
				}

				var deal = {};

				deal['hands'] = [ [ [], [], [], [] ], [ [], [], [], [] ], [ [], [], [], [] ], [ [], [], [], [] ], [ [], [], [], [] ] ];

				deal['declarer'] = declarer; // north
				deal['denom'] = denom; // NT
				deal['level'] = level;
				return deal;
			}

			function parseLIN(lin) {
				var result = {};
				var tokens = lin.split('|');
				var key;
				var val;
				for (var t = 0; t < tokens.length; t++) {
					if (0 === t % 2) {
						key = tokens[t];
					} else {
						val = tokens[t];
						if (key in result) {
							var v = result[key];
							if ($.isArray(v)) {
								// nothing
							} else {
								v = [ v ];
							}
							result[key] = v.concat([ val ]);
						} else {
							result[key] = val;
						}
					}
				}
				LOG(result);
				return result;
			}

			function isSuit(c) {
				return (SUIT_CHARS.indexOf(c) >= 0);
			}

			function ixSuit(c) {
				return (SUIT_CHARS.indexOf(c));
			}

			function completeDeal(deal) {
				LOG('completeDeal:');
				LOG(deal);
				var deck = fullDeck();
				var hands = deal['hands'];

				var ix = 0;
				for (var p = 0; p <= 3; p++) {
					var hand = hands[p];
					for (var s = 0; s <= 3; s++) {
						if (ix < tok.length) {
							var suit = tok[ix++];
							if (suit != '-') {
								var cards = suit.split('');
								for (var c = 0; c < cards.length; c++) {
									if (removeCard(deck, s, cards[c])) {
										hands[p][s].push(cards[c]);
									}
								}
							}
						}
					}
				}
				hands[DECK] = deck;

				LOG(deck);
				return deal;
			}

			function parseFromLINParams(params) {
				var deal = initDeal();
				var deck = fullDeck();
				var md = params['md'];
				var hands = md.split(',');
				var south = hands[0];
				var dealer = south.substring(0, 1);
				south = south.substring(1);
				hands[0] = south;
				var ixPlayer = [ SOUTH, WEST, NORTH, EAST ];
				var suit;
				for (var p = 0; p <= 3; p++) {
					var pl = ixPlayer[p];
					var hand = hands[p];
					var suits = [ [], [], [], [] ];
					if (hand) {
						var tok = Array.from(hand);
						for (var i = 0; i < tok.length; i++) {
							var c = tok[i];
							if (isSuit(c)) {
								suit = ixSuit(c);
							} else {
								if (removeCard(deck, suit, c)) {
									suits[suit].push(c);
								}
							}
						}
					}
					deal['hands'][pl] = suits;
				}
				if ((0 === countCardsHand(deal['hands'][EAST])) && (13 == countCardsHand(deck))) {
					deal['hands'][EAST] = deck;
				} else {
					deal['hands'][DECK] = deck;
				}
				// completeDeal(deal);
				// sortDeal(deal);
				return deal;
			}

			function parseFromParams(params) {
				var deal = initDeal();
				var players = Array.from('nesw');
				for (var p = 0; p < players.length; p++) {
					var pl = players[p];
					var hand = params[pl];
					var suits = [ [], [], [], [] ];
					if (hand) {
						var tok = Array.from(hand);
						var suit;
						for (var i = 0; i < tok.length; i++) {
							var c = tok[i];
							if (isSuit(c)) {
								suit = ixSuit(c);
							} else {
								suits[suit].push(c);
							}
						}
					}
					deal['hands'][p] = suits;
				}
				// completeDeal(deal);
				// sortDeal(deal);
				return deal;
			}

			function parseURLParams(url) {
				url = decodeURL(url);
				var res = {};
				var tok = url.split(new RegExp('[&\?]', 'g'));
				for (var i = 1; i < tok.length; i++) {
					var pair = tok[i].split('=');
					var key = pair[0];
					var value = pair[1];
					if (key) {
						if (value) {
							res[key] = value;
						}
					}
				}
				return res;
			}

			function displayClear() {
				for (var p = NORTH; p <= DECK; p++) {
					for (var s = CLUBS; s <= SPADES; s++) {
						for (var pos = 0; pos <= 12; pos++) {
							var id = cardId(p, s, pos);
							$('#' + id).html('&nbsp;');
						}
					}
				}
			}

			function countCardsSuit(suit) {
				var res = 0;
				for (var pos = 0; pos <= 12; pos++) {
					if (suit[pos]) {
						res++;
					}
				}
				return res;
			}

			function countCardsHand(hand) {
				return countCardsSuit(hand[CLUBS]) + countCardsSuit(hand[DIAMS]) + countCardsSuit(hand[HEARTS]) + countCardsSuit(hand[SPADES]);
			}

			function displayActiveHand() {
				var deal = load('deal');
				var active = deal['active'];
				var bActive = 0;
				$(".player").removeClass('active');
				if (active || 0 === active) {
					if (active >= NORTH && active <= WEST) {
						var hands = deal['hands'];
						var hand = hands[active];
						if (countCardsHand(hand) < 13) {
							$('#H_' + active).addClass('active');
							bActive = 1;
						}
					}
				}
				if (bActive) {
					return;
				}
				var hands = deal['hands'];
				for (var h = NORTH; h <= WEST; h++) {
					var hand = hands[h];
					var c = countCardsHand(hand)
					// LOG(h + "=>" + c);
					if (c < 13) {
						active = h;
						deal['active'] = active;
						$('#H_' + active).addClass('active');
						bActive = 1;
						break;
					}
				}
				if (bActive) {
				} else {
					deal['active'] = -1;
				}
				save('deal', deal);
			}

			function displayDeal() {
				displayClear();
				var deal = load('deal');
				if (deal) {
				} else {
					return;
				}
				sortDeal(deal['hands']);
				save('deal', deal);
				var hands = deal['hands'];
				for (var pl = NORTH; pl <= DECK; pl++) {
					for (var su = CLUBS; su <= SPADES; su++) {
						var suit = hands[pl][su];
						for (var i = 0; i <= suit.length; i++) {
							var c = suit[i];
							var id = cardId(pl, su, i);
							$('#' + id).text(c);
						}
					}
				}
				displayActiveHand();
			}

			// function isSuit(s) {
			// s = s.replace('E', 'A');
			// s = s.replace('D', 'Q');
			// s = s.replace('kn', 'J');
			// s = s.replace('Kn', 'J');
			// s = s.replace('10', 'T');
			// // LOG(s);
			// }

			function cntSuits(lines) {
				("LEN:" + lines.filter(isSuit).length);
			}

			function parseBW(s) {
				var lines = s.split('\n');
				var nSuits = cntSuits(lines);
				// LOG(lines.length + "=>" + lines);
			}

			function parseBBOURL(url) {
				var res = {};
				var urlParams = parseURLParams(url);

				// msg.text(JSON.stringify(urlParams));

				if (urlParams['lin']) {
					deal = parseFromLINParams(parseLIN(urlParams['lin']));
					LOG(deal);
				} else {
					deal = parseFromParams(urlParams);
					LOG(deal);
				}

				// msg.text(JSON.stringify(deal));

				return deal;

				// res['mb'] = [];
				// var tok = url.split(new RegExp('[&\?]', 'g'));
				//
				// for (var i = 0; i < tok.length; i++) {
				// var prop = tok[i].split('=');
				// if (prop[0] === 'lin') {
				// lin = prop[1];
				// }
				// }
				// if (lin) {
				// } else {
				// res['error'] = 'No lin parameter found';
				// // msg.text(JSON.stringify(res));
				// return res;
				// }
				// tok = lin.split('|');
				// var key;
				// var value;
				// for (var i = 0; i < tok.length; i++) {
				// if (i % 2 == 0) {
				// key = tok[i];
				// } else {
				// value = tok[i];
				// if (key === 'mb') {
				// if (!value === 'p') {
				// res[key].push(value);
				// }
				// } else {
				// res[key] = value;
				// }
				// }
				// }
				// // msg.text(JSON.stringify(res));
				// // $("outURL").html(JSON.stringify(res));
				// return res;
			}

			function load(id) {
				var json = localStorage.getItem(id);
				var obj = JSON.parse(json);
				return obj;
			}

			function save(id, obj) {
				if (obj) {
					var json = JSON.stringify(obj);
					localStorage.setItem(id, json);
				} else {
					localStorage.removeItem(id);
				}
			}

			function isCardSymbols(s) {
				if ('' === s) {
					return false;
				}
				if ('-' === s) {
					return true;
				}
				var tok = s.split("");
				for (var i = 0; i < tok.length; i++) {
					var ix = RANK_CHARS.indexOf(tok[i]);
					if (ix < 2 || ix > 14) {
						return false;
					}
				}
				return true;
			}

			function linearDeck(deck) {
				var linear = [];
				for (s = CLUBS; s <= SPADES; s++) {
					for (c = 0; c < deck[s].length; c++) {
						var card = [ s, deck[s][c] ];
						linear.push(card);
					}
				}
				// LOG(linear);
				return linear;
			}

			function shuffleDeck(linearDeck) {
				LOG('---');
				LOG(linearDeck);
				var len = linearDeck.length;
				for (var i = 0; i < len; i++) {
					var r = randomInt(0, len);
					var t = linearDeck[r];
					linearDeck[r] = linearDeck[i];
					linearDeck[i] = t;
				}
				LOG(linearDeck);
				return linearDeck;
			}

			function fullDeck() {
				LOG('FULL');
				var deck = [ [], [], [], [] ];
				for (var s = CLUBS; s <= SPADES; s++) {
					for (var r = 14; r >= 2; r--) {
						deck[s].push(RANK_CHARS[r]);
					}
				}
				// LOG(deck);
				return deck;
			}

			function removeCard(deck, suit, card) {
				// LOG(suit + ':' + card);
				// LOG(deck[suit]);
				// LOG(deck);
				// LOG('S:' + suit);
				for (var c = 0; c < deck[suit].length; c++) {
					// LOG(deck[suit][c] + '(eq)' + card)
					if (deck[suit][c] === card) {
						deck[suit].splice(c, 1);
						return true;
					}
				}
				return false;
			}

			function parseDeal(s) {
				var deal = initDeal();
				var hands = [ [ [], [], [], [] ], [ [], [], [], [] ], [ [], [], [], [] ], [ [], [], [], [] ], [ [], [], [], [] ] ];
				var deck = fullDeck();
				s = s.toUpperCase();
				s = s.replace(new RegExp('\-', 'g'), ' - ');
				s = s.replace(new RegExp('E', 'g'), 'A');
				s = s.replace(new RegExp('D', 'g'), 'Q');
				s = s.replace(new RegExp('KN', 'g'), 'J');
				s = s.replace(new RegExp('10', 'g'), 'T');
				s = s.replace(new RegExp(' ', 'g'), '\n');
				s = s.replace(new RegExp('\\.', 'g'), '\n');
				s = s.replace(new RegExp('\t', 'g'), '\n');
				var tok = s.split('\n').filter(isCardSymbols);

				// res = res.replace(new RegExp('%2C', 'g'), ',');
				LOG(tok);
				LOG('' + tok.length);

				var d = '';
				for (var p = 0; p < tok.length; p++) {
					d += tok[p] + ' ';
					if (0 == (p + 1) % 4) {
						d += '\n';
					}
				}

				if (16 === tok.length || 8 === tok.length) {
					$('#dealInput').val(d);
				} else {
					d = 'Please correct input: \n\n' + d;
					$('#dealInput').val(d);
					alert('Parse failed, sorry');
					return deal;
				}

				var ix = 0;
				for (var p = 0; p <= 3; p++) {
					for (var s = 3; s >= 0; s--) {
						if (ix < tok.length) {
							var suit = tok[ix++];
							if (suit != '-') {
								var cards = suit.split('');
								for (var c = 0; c < cards.length; c++) {
									if (removeCard(deck, s, cards[c])) {
										hands[p][s].push(cards[c]);
									}
								}
							}
						}
					}
				}
				hands[DECK] = deck;
				deal['hands'] = hands;
				var linear = linearDeck(deck);
				var lix = 0;
				if (linear.length > 0) {
					linear = shuffleDeck(linear);
				}
				for (p = NORTH; p <= WEST; p++) {
					while (countCardsHand(hands[p]) < 13 && (lix < linear.length)) {
						var c = linear[lix++];
						var s = c[0];
						var r = c[1];
						if (removeCard(deck, s, r)) {
							hands[p][s].push(r);
						}
					}
				}
				return deal;
			}

			function rotateLeft() {
				var deal = load('deal');
				var t = deal['hands'][0];
				deal['hands'][0] = deal['hands'][1];
				deal['hands'][1] = deal['hands'][2];
				deal['hands'][2] = deal['hands'][3];
				deal['hands'][3] = t;
				save('deal', deal);
				displayDeal();
			}

			function rotateRight() {
				var deal = load('deal');
				var t = deal['hands'][0];
				deal['hands'][0] = deal['hands'][3];
				deal['hands'][3] = deal['hands'][2];
				deal['hands'][2] = deal['hands'][1];
				deal['hands'][1] = t;
				save('deal', deal);
				displayDeal();
			}

			function btnSwapHands(h1, h2) {
				var deal = load('deal');
				var t = deal['hands'][h1];
				deal['hands'][h1] = deal['hands'][h2];
				deal['hands'][h2] = t;
				save('deal', deal);
				displayDeal();
			}

			function btnReverseSuits(s1, s2) {
				var deal = load('deal');
				for (var h = NORTH; h <= DECK; h++) {
					var t = deal['hands'][h][s1];
					deal['hands'][h][s1] = deal['hands'][h][s2];
					deal['hands'][h][s2] = t;
				}
				save('deal', deal);
				displayDeal();
			}

			function btnLoadURLClicked() {
				var inp0 = '' + $('#dealInput').val();
				var deal
				if (inp0.indexOf('http://www.bridgebase.com/') >= 0) {
					var inp = decodeURL(inp0);
					deal = parseBBOURL(inp);
				} else {
					deal = parseDeal(inp0);
				}
				save('deal', deal);
				displayDeal();
			}

			function btnLoadDealClicked() {
				var inp = '' + $('#dealInput').val();
				var deal = parseDeal(inp);
				save('deal', deal);
				displayDeal();
			}

			function btnLoadBWClicked() {
				var inp0 = '' + $('#dealInput').val();
				var inp = parseBW(inp0);
				// // alert('.\n.\n' + inp0.substring(0, 20) + '.\n.\n');
				// var inp = decodeURL(inp0);
				// // alert('.\n.\n' + inp.substring(0, 20) + '.\n.\n');
				// var deal = parseBBOURL(inp);
				// // var deal = parseDeal(deal0);
				// save('deal', deal);
				// displayDeal();
			}

			var BBO_URL = 'http://www.bridgebase.com/tools/handviewer.html?n={n}&e={e}&s={s}&w={w}&d={d}&a={a}';

			function bboUrl(n, e, s, w, d, a) {
				var url = BBO_URL.replace('{n}', n).replace('{e}', e).replace('{s}', s).replace('{w}', w).replace('{d}', d).replace('{a}', a);
				return url;
			}

			function stringHand(hand) {
				return 'S' + hand[SPADES].join('') + 'H' + hand[HEARTS].join('') + 'D' + hand[DIAMS].join('') + 'C' + hand[CLUBS].join('');
			}

			function readAuction() {
				var deal = load('deal');
				var level = deal['level'];
				var denom = deal['denom'];
				return '' + level + SUIT_CHARS[denom] + 'PPP';
			}

			function readDeclarer() {
				var deal = load('deal');
				var declarer = PLAYER_CHARS[deal['declarer']];
				return declarer;
			}

			function btnCreateURLClicked() {
				// alert('btnCreateURLClicked');
				var deal = JSON.parse(localStorage.getItem('deal'));
				// alert(JSON.stringify(deal));
				var hands = deal['hands'];
				// alert(JSON.stringify(hands));
				var n = stringHand(hands[NORTH]);
				var e = stringHand(hands[EAST]);
				var s = stringHand(hands[SOUTH]);
				var w = stringHand(hands[WEST]);

				var auction = readAuction();
				var declarer = readDeclarer();

				var url = bboUrl(n, e, s, w, declarer, auction);
				var name = 'w' + randomInt(1000000000, 2000000000);
				window.open(url, name);
				return;

				// var a = $("#hrefNewURL");
				// a.attr('href', bboUrl(n, e, s, w));
				// a.attr('target', 'w' + randomInt(1000000000, 2000000000));
				// a.text('handviewer_link');
			}

			function init() {
				// for (var x = 0; x < 20; x++) {
				// LOG(randomInt(4, 8));
				// }

				$('#dealInput').focus();
				north.html(handHtml("0", "North"));
				east.html(handHtml("1", "East"));
				south.html(handHtml("2", "South"));
				west.html(handHtml("3", "West"));
				deck.html(handHtml("4", "Deck"));
				$('.card').click(cardClicked);
				$('.contract').click(contractClicked);
				$('.card').css('cursor', 'crosshair');
				$('.contract').css('cursor', 'crosshair');
				$('.player').click(playerClicked);
				$('.player').css('cursor', 'crosshair');
				$('#btnLoadURL').click(btnLoadURLClicked);
				$('#btnLoadBW').click(btnLoadBWClicked);
				$('#btnLoadDeal').click(btnLoadDealClicked);
				$('#btnCreateURL').click(btnCreateURLClicked);
				$('#swapNE').click(function() {
					btnSwapHands(NORTH, EAST);
				});
				$('#swapNS').click(function() {
					btnSwapHands(NORTH, SOUTH);
				});
				$('#swapNW').click(function() {
					btnSwapHands(NORTH, WEST);
				});
				$('#swapES').click(function() {
					btnSwapHands(EAST, SOUTH);
				});
				$('#swapEW').click(function() {
					btnSwapHands(EAST, WEST);
				});
				$('#swapSW').click(function() {
					btnSwapHands(SOUTH, WEST);
				});
				$('#rotL').click(rotateLeft);
				$('#rotR').click(rotateRight);
				$('#reverseSuits').click(function() {
					btnReverseSuits(SPADES, CLUBS);
					btnReverseSuits(HEARTS, DIAMS);
				});

				// save('deal', null);

				// var x = null;
				// localStorage.setItem('deal', x);
				displayDeal();
				displayContract();
			}

			function update() {
				hrefNewURL.attr('target', ('' + new Date().getTime()));
				hrefNewURL
						.attr(
								'href',
								'http://www.bridgebase.com/tools/handviewer.html?bbo=y&lin=pn|stefan_o,~~M55917,~~M55415,~~M55416|st||md|3S56KH7KD2389JKCKA%2CSH45QD46QAC24689Q%2CS238TJAH389TAD5TC%2C|rh||ah|Board 1|sv|o|mb|p|mb|p|mb|1D|an|Minor suit opening -- 3%2B !D%3B 11-21 HCP%3B |mb|p|mb|1S|an|One over one -- 4%2B !S%3B 11- HCP%3B 6-12 total points |mb|p|mb|2N|an|Jump in notrump -- 2-4 !C%3B 3-5 !D%3B 2-4 !|mb|p|mb|3H|an|5%2B !H%3B 5%2B !S%3B 11- HCP%3B 6-12 total points |mb|p|mb|4S|an|2-4 !C%3B 3-5 !D%3B 2-4 !H%3B 3 !S%3B 18-19 HCP%3B|mb|p|mb|5C|an|Cue bid -- 5%2B !H%3B 5%2B !S%3B 11 HCP%3B !CA%3B 12 total points%3B forcing |mb|p|mb|5S|an|2-4 !C%3B 3-5 !D%3B 2-4 !H%3B 3 !S%3B 18-19 HCP%3B|mb|p|mb|p|mb|p|pc|D7|pc|D2|pc|DQ|pc|DT|pc|DA|pc|D5|pc|H2|pc|D3|pc|D6|pc|SA|pc|C3|pc|D8|pc|SJ|pc|SQ|pc|SK|pc|C6|pc|CA|pc|C9|pc|H3|pc|C7|pc|CK|pc|C4|pc|H8|pc|C5|pc|HK|pc|H4|pc|H9|pc|H6|pc|H7|pc|H5|pc|HA|pc|HJ|pc|HT|pc|S7|pc|D9|pc|HQ|pc|CJ|pc|S5|pc|C8|pc|S2|pc|S6|pc|C2|pc|ST|pc|S4|pc|S8|pc|S9|pc|DJ|pc|D4|pc|CT');
				hrefNewURL.text('xxx');
			}

			$(function() {
				init();
				// update();
			});
		}));
