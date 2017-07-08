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

			var divMsg = $('#msg');

			function msg(s) {
				divMsg.text(s);
			}

			function msgAdd(s) {
				var txt = divMsg.text() + '\n' + s;
				msg(txt);
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

			var MYHAND_X = 100;
			var MYHAND_X_D = 15;
			var MYHAND_Y = 300;

			var NORTH_BACKSIDE_X = 240 - 50;
			var NORTH_BACKSIDE_Y = 50;
			var WEST_BACKSIDE_X = 80 - 36;
			var WEST_BACKSIDE_Y = 120;
			var EAST_BACKSIDE_X = 400 - 36;
			var EAST_BACKSIDE_Y = 120;

			var NORTH_X = 0;
			var NORTH_Y = 0;
			var WEST_X = 0;
			var WEST_Y = 0;
			var EAST_X = 0;
			var EAST_Y = 0;

			var BIDDINGBOX_X = 450;
			var BIDDINGBOX_Y = 300;

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

			var SPRITE_POS_RANK = [ 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0 ];
			var SPRITE_POS_SUIT = [ 0, 3, 1, 2 ];

			var SUIT_ZINDEX = [ 1, 0, 2, 3 ];

			var PHASE_INIT = 0;
			var PHASE_BID = 1;
			var PHASE_PLAY = 2;
			var PHASE_ASK = 3;
			var PHASE_CONTINUE = 4;
			var PHASE_END = 9;

			var phase = PHASE_INIT;

			var north = $("#north");
			var east = $("#east");
			var south = $("#south");
			var west = $("#west");
			var deck = $("#deck");

			var hrefNewURL = $("#hrefNewURL");
			// var msg = $("#msg");

			var card_html = "<span class='card' id='{id}'>&nbsp;</span>";
			var card_id = "C_{hand}_{suit}_{ix}";

			var divInfo = $('#info');
			var divBiddingBox = $('#biddingBox');
			var divAuction = $('#auction');

			function randomInt(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			}

			var CARDS = [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ];

			function backside(x, y, d) {
				var myhand = $('#myhand');

				var div = $($.parseHTML('<div />'));
				div.addClass('backside');
				div.css('display', 'block');
				div.css('position', 'absolute');
				div.css('z-index', '2');
				div.css('display', 'block');

				var img = $($.parseHTML("<img />"));
				img.attr('src', 'img/backside' + d + '.png');
				img.css('border-style', 'solid');
				img.css('border-width', '0px');

				div.append(img);
				div.css('left', x + 'px');
				div.css('top', y + 'px');
				myhand.append(div);
			}

			function cardDiv(s, r) {
				var suit_rank = SUIT_CHARS[s] + '_' + RANK_CHARS[r];
				var divId = 'C_' + suit_rank;
				var imgId = 'I_' + suit_rank;
				var div = $($.parseHTML('<div />'));
				{
					div.addClass('card');
					div.attr('id', divId);
					div.css('display', 'block');
					div.css('position', 'absolute');
					var ss = (3 - SUIT_ZINDEX[s]) * 15;
					var rr = (15 - r);
					var zindex = ss + rr;
					div.css('z-index', '' + zindex);
					div.css('top', ((s * 60) + 100) + 'px');
					div.css('left', ((15 - r) * 20 + 35) + 'px');
				}
				var img = $($.parseHTML("<img />"));
				{
					img.attr('id', imgId);
					img.attr('src', 'img/cards.png');
					img.css('border-style', 'solid');
					img.css('border-width', '1px');
					img.css('object-fit', 'none');
					var x = -3 - (75 * SPRITE_POS_RANK[r]);
					var y = -6 - (101 * SPRITE_POS_SUIT[s]);
					img.css('object-position', x + 'px ' + y + 'px');
					img.css('width', '69px');
					img.css('height', '92px');
				}
				div.append(img);
				return div;
			}

			function biddingBox() {
				var bb = $($.parseHTML('<table></table>'));
				bb.css('font-size', '0.9em');
				bb.css('border-spacing', '0px');
				bb.css('background-color', '#FFFFFF');
				for (var row = 7; row >= 1; row--) {
					var tr = $($.parseHTML('<tr></tr>'));
					for (var cell = NT; cell >= CLUBS; cell--) {
						var td = $($.parseHTML('<td></td>'));
						td.html('' + row + SYM_SUIT[cell]);
						td.addClass('bid');
						td.addClass('col' + cell);
						td.attr('id', 'B_' + row + '_' + cell);
						td.css('border-style', 'solid');
						td.css('border-width', '0.1px');
						tr.append(td);
					}
					bb.append(tr);
				}
				var tr = $($.parseHTML('<tr></tr>'));
				var dbl = $($.parseHTML('<td></td>'));
				{
					dbl.text('X');
					dbl.css('text-align', 'center');
					dbl.css('background-color', '#FF0000');
					dbl.css('color', '#FFFFFF');
					dbl.css('border-color', '#000000');
					dbl.css('border-style', 'solid');
					dbl.css('border-width', '0.1px');
					dbl.addClass('bid');
					dbl.attr('id', 'B_0_X');
				}
				var pass = $($.parseHTML('<td></td>'));
				{
					pass.attr('colspan', '3');
					pass.text('PASS');
					pass.css('text-align', 'center');
					pass.css('background-color', '#008800');
					pass.css('color', '#FFFFFF');
					pass.css('border-color', '#000000');
					pass.css('border-style', 'solid');
					pass.css('border-width', '0.1px');
					pass.addClass('bid');
					pass.attr('id', 'B_0_P');
				}
				var rdbl = $($.parseHTML('<td></td>'));
				{
					rdbl.text('XX');
					rdbl.css('text-align', 'center');
					rdbl.css('background-color', '#000088');
					rdbl.css('color', '#FFFFFF');
					rdbl.css('border-color', '#000000');
					rdbl.css('border-style', 'solid');
					rdbl.css('border-width', '0.1px');
					rdbl.addClass('bid');
					rdbl.attr('id', 'B_0_XX');
				}
				tr.append(rdbl);
				tr.append(pass);
				tr.append(dbl);
				bb.append(tr);

				divBiddingBox.css('position', 'absolute');
				divBiddingBox.css('left', BIDDINGBOX_X + 'px');
				divBiddingBox.css('top', BIDDINGBOX_Y + 'px');
				divBiddingBox.append(bb);
			}

			function dealCards(deal) {
				var y = 0;
				var x = 0;
				var last_suit;
				$('.card').css('display', 'none');
				for (var i = 0; i < deal.length; i++) {
					var s_r = deal[i].split('');
					var s = SUIT_CHARS.indexOf(s_r[0]);
					var r = RANK_CHARS.indexOf(s_r[1]);
					var card = CARDS[s][r];
					if (last_suit || 0 === last_suit) {
						if (last_suit === s) {
						} else {
							x++;
						}
					}
					var xx = MYHAND_X + x * MYHAND_X_D;
					var yy = MYHAND_Y - y * 0;
					card.css('left', xx + 'px');
					card.css('top', yy + 'px');
					card.css('display', 'block');
					x++;
					y++;
					last_suit = s;
				}
			}

			function bidClicked() {
				var id = $(this).attr('id');
				uiController('click', id);
			}

			function cardClicked() {
				var id = $(this).attr('id');
				uiController('click', id);
			}

			// var DEAL = [ 'SA', 'SK', 'SQ', 'SJ', 'ST', 'S9', 'S8', 'S7',
			// 'S6', 'S2', 'H2', 'C2', 'D2' ];
			var DEAL = 'md|3SQ92HKJ53DAQ63CKT,S4HT76DJ974CAQJ95,SAKJ653HA9DKT2C76,ST87HQ842D85C8432|sv|0|ah|Board+1|mb|1S|an|Major+suit+opening+--+5++!S;+11-21+HCP;+12-22+total+points|mb|P|mb|2N!|an|Jacoby+->+support;+balanced+--+4++!S;+13++total+points|mb|P|mb|3N|an|Balanced+submaximum+--+2++!C;+2++!D;+2++!H;+5++!S;+15-17+HCP|mb|P|mb|6N|an|4++!S;+13++total+points|mb|P|mb|P|mb|P|pc|H6|pc|H9|pc|HQ|pc|HK|pc|S2|pc|S4|pc|SA|pc|S7|pc|S3|pc|ST|pc|SQ|pc|C5|pc|S9|pc|C9|pc|SK|pc|S8|pc|HA|pc|H2|pc|H3|pc|H7|pc|D2|pc|D5|pc|DA|pc|D7|pc|HJ|pc|HT|pc|C6|pc|H4|pc|D6|pc|D9|pc|DK|pc|D8|pc|SJ|pc|C4|pc|CT|pc|CQ|pc|S6|pc|C2|pc|CK|pc|CA|pc|S5|pc|C3|pc|H5|pc|D4|pc|DT|pc|C8|pc|DQ|pc|DJ|pc|D3|pc|CJ|pc|C7|pc|H8|';

			function readURL(url) {
				url = url.replace(new RegExp('\\+\\+', 'g'), '# ');
				url = url.replace(new RegExp('\\+', 'g'), ' ');
				url = url.replace(new RegExp('#', 'g'), '+');
				return url;
				// res = res.replace(new RegExp('%2C', 'g'), ',');
				// res = res.replace(new RegExp('%20', 'g'), ' ');
				// res = res.replace(new RegExp('%2!', 'g'), '!');
				// res = res.replace(new RegExp('%3B', 'g'), ';');
			}

			function parseDeal(deal) {
				deal = readURL(deal);
				var tok = deal.split('|');
				var result = {};
				for (var i = 0; i < tok.length; i += 2) {
					var key = tok[i];
					var val = tok[i + 1];
					if ('an' === key) {
						var an = result[key];
						an[an.length - 1] = val;
					} else {
						var entry = result[key];
						if (entry) {
							entry.push(val);
							if ('mb' === key) {
								result['an'].push('');
							}
						} else {
							entry = [ val ];
							result[key] = entry;
							if ('mb' === key) {
								result['an'] = [ '' ];
							}
						}
					}
				}
				return result;
			}

			var dealConvert = [ 2, 3, 0, 1 ];

			function parseHand(hand) {
				var result = [];
				var suit = 'S';
				var tok = hand.split('');
				for (var i = 0; i < tok.length; i++) {
					var t = tok[i];
					if (SUIT_CHARS.includes(t)) {
						suit = t;
					} else {
						var card = suit + t;
						result.push(card);
					}
				}
				return result;
			}

			function parseHands(result, hands) {
				var dealer = dealConvert[Number(hands.substring(0, 1)) - 1];
				hands = hands.substring(1).split(',');
				var cards = [];
				// LOG(dealer);
				// LOG(hands);
				for (var p = NORTH; p <= WEST; p++) {
					var hand = parseHand(hands[dealConvert[p]]);
					cards.push(hand);
					// LOG(hand);
				}
				result['dealer'] = dealer;
				result['turn'] = dealer;
				result['cards'] = cards;
			}

			function orderSHCD(hand) {
				var result = [];
				for (var i = 0; i < hand.length; i++) {
					if (hand[i].split('')[0] === 'D') {
						// nothing
					} else {
						result.push(hand[i]);
					}
				}
				for (var i = 0; i < hand.length; i++) {
					if (hand[i].split('')[0] === 'D') {
						result.push(hand[i]);
					} else {
						// nothing
					}
				}
				return result;
			}

			function displayCards(hand) {
				hand = orderSHCD(hand);
				dealCards(hand);
			}

			function tst() {
				var a = {};
				var b = {};
				var c = (a === b);
				LOG("EQ: " + c);
			}

			function loadNewDeal() {
				// tst();
				var result = {}
				phase = PHASE_BID;
				var d = parseDeal(DEAL);
				var hands = d['md'][0];
				var bids = d['mb'];
				var expl = d['an'];
				parseHands(result, hands);
				result['bids'] = bids;
				result['expl'] = expl;
				result['play'] = d['pc'];
				result['ixBid'] = 0;
				result['ixPlay'] = 0;
				LOG(result);
				var south = result['cards'][SOUTH];
				displayCards(south);
				var firstLead = locateCard(result['cards'], result['play'][0]);
				var dummy = ((1 + firstLead) % 4);
				var declarer = ((3 + firstLead) % 4);
				result['declarer'] = declarer;
				result['dummy'] = dummy;
				msgAdd('DECLARER: ' + declarer);
				msgAdd('DUMMY   : ' + dummy);
				return result;
			}

			var info = $('#info');

			function tick() {
				uiController('tick');
			}

			function locateCard(cards, nextPlay) {
				for (var i = NORTH; i <= WEST; i++) {
					if (cards[i].includes(nextPlay)) {
						// LOG('Found: ' + nextPlay);
						// LOG(cards);
						// LOG('Hand: ' + i);
						return i;
					}
				}
				LOG('Could not find card: ' + nextPlay);
				LOG(cards);
			}

			function switchBidToPlay() {
				msg('');
				phase = PHASE_PLAY;
				var deal = load('deal');
				var cards = deal['cards'];
				var play = deal['play'];
				var ixPlay = deal['ixPlay'];
				var nextPlay = play[ixPlay];
				var turn = locateCard(cards, nextPlay);
				deal['turn'] = turn;
				save('deal', deal);
			}

			function showDummy() {
				LOG('=showDummy=')
				msgAdd('=showDummy=')
			}

			function advanceGame() {
				var deal = load('deal');
				var turn = deal['turn'];
				if (PHASE_BID === phase) {
					var ixBid = deal['ixBid'];
					ixBid++;
					deal['ixBid'] = ixBid;
					var bids = deal['bids'];
					if (ixBid >= bids.length) {
						LOG('= AUCTION COMPLETED =');
						switchBidToPlay();
						return;
					}
					turn = ((1 + turn) % 4);
					deal['turn'] = turn;
				} else if (PHASE_PLAY === phase) {
					var ixPlay = deal['ixPlay'];
					ixPlay++;
					if (1 === ixPlay) {
						showDummy();
					}
					deal['ixPlay'] = ixPlay;
					var play = deal['play'];
					if (ixPlay >= play.length) {
						phase = PHASE_END;
						return;
					}
					var cards = deal['cards'];
					var nextPlay = play[ixPlay];
					turn = locateCard(cards, nextPlay);
					deal['turn'] = turn;
				}
				save('deal', deal);
			}

			function nextAutoBid() {
				var deal = load('deal');
				var turn = deal['turn'];
				var player = PLAYER_CHARS[turn];
				var bids = deal['bids'];
				var ixBid = deal['ixBid'];
				var bid = bids[ixBid];
				var expl = deal['expl'][ixBid];
				// LOG(player + ": " + bid + ' -- ' + expl);
				msgAdd(player + ": " + bid + ' -- ' + expl);
				advanceGame();
			}

			function nextAutoPlay() {
				var deal = load('deal');
				var turn = deal['turn'];
				var player = PLAYER_CHARS[turn];
				var play = deal['play'];
				var ixPlay = deal['ixPlay'];
				var card = play[ixPlay];
				msgAdd(player + ": " + card);
				advanceGame();
			}

			function handleTick(p) {
				if (PHASE_INIT === phase) {
					var deal = loadNewDeal();
					save('deal', deal);
					phase = PHASE_BID;
					return;
				}
				if (PHASE_BID === phase) {
					nextAutoBid();
				}
				if (PHASE_PLAY === phase) {
					nextAutoPlay();
				}
			}

			function makeBid(p) {
				var lvl = p[1];
				var denom = SUIT_CHARS[Number(p[2])];
				if (denom) {
					// nothing
				} else {
					denom = p[2];
				}
				var actualBid = lvl + '' + denom;
				// msgAdd(actualBid);
				var deal = load('deal');
				var bids = deal['bids'];
				var ixBid = deal['ixBid'];
				var expectedBid = deal['bids'][ixBid].replace('!', '');
				LOG('EXPECTED: ' + expectedBid);
				if (expectedBid === actualBid) {
					msgAdd('YES: ' + actualBid);
					advanceGame();
				} else {
					msgAdd('NOPE ' + expectedBid + ' ' + actualBid);
				}
			}

			function makePlay(tok) {
				var deal = load('deal');
				var play = deal['play'];
				var ixPlay = deal['ixPlay'];
				var expectedCard = play[ixPlay];
				var actualCard = tok[1] + tok[2];
				if (expectedCard === actualCard) {
					msgAdd('YES: ' + actualCard);
					advanceGame();
				} else {
					msgAdd('NOPE ' + expectedCard + ' ' + actualCard);
				}
			}

			function handleClick(p) {
				LOG('CLICK: ' + p);
				var tok = p.split('_');
				var action = tok[0];
				if (PHASE_BID === phase && action === 'B') {
					makeBid(tok);
				} else if (PHASE_PLAY === phase && action === 'C') {
					makePlay(tok);
				} else {
					msgAdd('???');
				}
			}

			function uiController(t, p) {
				var tag = info.text();
				if ('=' === tag) {
					info.text(':');
				} else {
					info.text('=');
				}
				if (PHASE_INIT === phase) {
					handleTick(p);
					return;
				}
				var deal = load('deal');
				var turn = deal['turn'];
				var declarer = deal['declarer'];
				LOG('TURN: ' + turn);
				var manualDummyPlay = (PHASE_PLAY === phase && turn === NORTH && declarer === SOUTH);
				if ('click' === t && (turn === SOUTH || manualDummyPlay)) {
					handleClick(p);
				} else if ('tick' === t && turn !== SOUTH && !manualDummyPlay) {
					handleTick(p);
				}
			}

			function setup() {
				console.clear();
				biddingBox();
				info.css('color', '#FFFFFF');
				info.css('font-weight', 'bold');
				var myhand = $('#myhand');
				for (var s = CLUBS; s <= SPADES; s++) {
					for (var r = 2; r <= 14; r++) {
						// myhand.append(' ' + s + ' ' + r);
						var div = cardDiv(s, r);
						myhand.append(div);
						CARDS[s].push(div);
					}
				}
				$('.card').click(cardClicked);
				$('.bid').click(bidClicked);
				$('.card').css('display', 'none');
				// $('#myhand').click(cardClicked);
			}

			$(function() {
				info.text('-');
				setup();
				backside(NORTH_BACKSIDE_X, NORTH_BACKSIDE_Y, 'H');
				backside(WEST_BACKSIDE_X, WEST_BACKSIDE_Y, 'V');
				backside(EAST_BACKSIDE_X, EAST_BACKSIDE_Y, 'V');

				// dealCards(DEAL);

				backside(20, 500, 'H');
				backside(40, 480, 'V');
				backside(60, 500, 'H');
				backside(80, 500, 'H');
				backside(100, 480, 'V');

				setInterval(tick, 250);

				// CARDS[2][5].css('display', 'none');
				// var SA = CARDS[3][14];
				// SA.css('top', (4 * 60 + 100) + 'px');
				// SA.css('left', (15 * 20 + 35) + 'px');
				// $('.card').css('display', 'block');
			});
		}));
