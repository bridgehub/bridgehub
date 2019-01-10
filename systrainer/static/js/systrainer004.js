(function(yourcode) {
	yourcode(window.jQuery, window, document);
}
		(function($, window, document) {

			if (!localStorage) {
				var txt = 'Hmmm... there seems to be a problem:<br /><br />';
				txt += 'This application requires HTML5 localStorage.<br /><br />';
				txt += 'Either it has been disabled (private-browsing, cookies-disabled, etc)<br />'
				txt += 'or your browser is out-dated and does not support it.<br /><br />';
				txt += 'If your browser is out-dated,<br />try using an up-to-date version of Chrome or Firefox browsers.<br /><br />';
				txt += 'If you think you have disabled localStorage and <br />want to enable it, google: enable localStorage';
				$('body').html(txt);
				return;
			}

			if (!Modernizr.objectfit) {
				var txt = 'Hmmm... there seems to be a problem:<br /><br />';
				txt += 'This application requires the HTML5 object-fit feature.<br />';
				txt += 'and it seems your browser does not support this.<br /><br />'
				txt += 'Please try visit this web-app with an up-to-date <br />';
				txt += 'version of Chrome or Firefox browsers.<br /><br />';
				$('body').html(txt);
				return;
			}

			var VERSION = '20170721A';
			var SERIES = './ser001';
			var DEAL_MAX = 1262;

			var logEnabled = true;
			function LOG(s) {
				if (logEnabled) {
					if (console) {
						console.log(JSON.stringify(s));
					}
				}
			}

			// var DEAL = [ 'SA', 'SK', 'SQ', 'SJ', 'ST', 'S9', 'S8', 'S7',
			// 'S6', 'S2', 'H2', 'C2', 'D2' ];
			var DEA2 = 'md|3SQ92HKJ53DAQ63CKT,S4HT76DJ974CAQJ95,SAKJ653HA9DKT2C76,ST87HQ842D85C8432|sv|0|ah|Board+1|mb|1S|an|Major+suit+opening+--+5++!S;+11-21+HCP;+12-22+total+points|mb|P|mb|2N!|an|Jacoby+->+support;+balanced+--+4++!S;+13++total+points|mb|P|mb|3N|an|Balanced+submaximum+--+2++!C;+2++!D;+2++!H;+5++!S;+15-17+HCP|mb|P|mb|6N|an|4++!S;+13++total+points|mb|P|mb|P|mb|P|pc|H6|pc|H9|pc|HQ|pc|HK|pc|S2|pc|S4|pc|SA|pc|S7|pc|S3|pc|ST|pc|SQ|pc|C5|pc|S9|pc|C9|pc|SK|pc|S8|pc|HA|pc|H2|pc|H3|pc|H7|pc|D2|pc|D5|pc|DA|pc|D7|pc|HJ|pc|HT|pc|C6|pc|H4|pc|D6|pc|D9|pc|DK|pc|D8|pc|SJ|pc|C4|pc|CT|pc|CQ|pc|S6|pc|C2|pc|CK|pc|CA|pc|S5|pc|C3|pc|H5|pc|D4|pc|DT|pc|C8|pc|DQ|pc|DJ|pc|D3|pc|CJ|pc|C7|pc|H8|';
			var DEA3 = 'md|2SAKT2H832DAKQ73CQ,SJ94HKQJ6D9CAJT87,S873HA754D82C9642,SQ65HT9DJT654CK53|sv|0|ah|Board+8|mb|1C|an|Minor+suit+opening+--+3++!C;+11-21+HCP;+12-22+total+points|mb|P|mb|1D|an|One+over+one+--+4++!D;+6++total+points|mb|D|an|Two+suit+takeout+--+5-+!C;+5-+!D;+4++!H;+4++!S;+12++total+points|mb|1H|an|3++!C;+4++!H;+11++HCP;+12-18+total+points|mb|P|mb|1N|an|Balanced+minimum+--+2-3+!C;+4++!D;+2-3+!H;+2-3+!S;+6-10+HCP|mb|2D|an|5-+!C;+5-+!D;+4++!H;+4++!S;+24++HCP;+25++total+points;+forcing+to+3N|mb|P|mb|2S|an|4++!S;+8-+total+points;+forcing+to+3N|mb|P|mb|4S|an|5-+!C;+5-+!D;+4++!H;+4++!S;+24++HCP;+25-27+total+points|mb|P|mb|5H|an|Cue+bid+--+1++!C;+1++!D;+4++!S;+no+!CA;+no+!DA;+!HA;+7-8+total+points;+forcing|mb|P|mb|6S|an|5-+!C;+5-+!D;+4++!H;+4++!S;+24++HCP;+25-27+total+points|mb|P|mb|P|mb|P|pc|HT|pc|H2|pc|H6|pc|HA|pc|S3|pc|S6|pc|SK|pc|S4|pc|SA|pc|S9|pc|S7|pc|S5|pc|DA|pc|D9|pc|D8|pc|D4|pc|DK|pc|SJ|pc|D2|pc|D6|pc|HK|pc|H4|pc|H9|pc|H3|pc|HQ|pc|H5|pc|C3|pc|H8|pc|C8|pc|C2|pc|CK|pc|CQ|pc|SQ|pc|S2|pc|C7|pc|S8|pc|DJ|pc|DQ|pc|HJ|pc|C4|pc|D7|pc|CA|pc|C6|pc|DT|pc|C5|pc|ST|pc|CJ|pc|C9|pc|D3|pc|CT|pc|H7|pc|D5|';
			var DEA4 = 'md|4SKT92HAQJ82DJ2CKJ,SAJ64HT7DA83CQ874,S75HK95DKQT94CA63,SQ83H643D765CT952|sv|E|ah|Board+6|mb|P|mb|1H|an|Major+suit+opening+--+5++!H;+11-21+HCP;+12-22+total+points|mb|D|an|Takeout+double+--+3-5+!C;+3-5+!D;+2-+!H;+3-4+!S;+12++total+points|mb|2N!|an|Truscott+(Jordan)+--+3++!H;+11++total+points|mb|P|mb|4H|an|5++!H;+13++HCP;+14-19+total+points|mb|P|mb|P|mb|P|pc|HT|pc|HK|pc|H4|pc|H2|pc|H9|pc|H6|pc|H8|pc|H7|pc|D4|pc|D5|pc|DJ|pc|D3|pc|D2|pc|DA|pc|D9|pc|D7|pc|D8|pc|DK|pc|D6|pc|S2|pc|H5|pc|H3|pc|HA|pc|C8|pc|CK|pc|C4|pc|C3|pc|CT|pc|CJ|pc|CQ|pc|CA|pc|C5|pc|DQ|pc|S3|pc|S9|pc|S6|pc|DT|pc|C9|pc|ST|pc|S4|pc|S5|pc|S8|pc|SK|pc|SA|pc|C7|pc|C6|pc|C2|pc|HJ|pc|HQ|pc|SJ|pc|S7|pc|SQ|';
			// var DEAL =
			// 'md|1SQ83H643D765CT952,SKT92HAQJ82DJ2CKJ,SAJ64HT7DA83CQ874,S75HK95DKQT94CA63|sv|E|ah|Board+6|mb|P|mb|1H|an|Major+suit+opening+--+5++!H;+11-21+HCP;+12-22+total+points|mb|D|an|Takeout+double+--+3-5+!C;+3-5+!D;+2-+!H;+3-4+!S;+12++total+points|mb|2N!|an|Truscott+(Jordan)+--+3++!H;+11++total+points|mb|P|mb|4H|an|5++!H;+13++HCP;+14-19+total+points|mb|P|mb|P|mb|P|pc|HT|pc|HK|pc|H4|pc|H2|pc|H9|pc|H6|pc|H8|pc|H7|pc|D4|pc|D5|pc|DJ|pc|D3|pc|D2|pc|DA|pc|D9|pc|D7|pc|D8|pc|DK|pc|D6|pc|S2|pc|H5|pc|H3|pc|HA|pc|C8|pc|CK|pc|C4|pc|C3|pc|CT|pc|CJ|pc|CQ|pc|CA|pc|C5|pc|DQ|pc|S3|pc|S9|pc|S6|pc|DT|pc|C9|pc|ST|pc|S4|pc|S5|pc|S8|pc|SK|pc|SA|pc|C7|pc|C6|pc|C2|pc|HJ|pc|HQ|pc|SJ|pc|S7|pc|SQ|';
			var DEAL;

			// =============================================

			// HTML Elements

			var hcpWestMin = $('#hcpWestMin');
			var hcpWestMax = $('#hcpWestMax');
			var hcpEastMin = $('#hcpEastMin');
			var hcpEastMax = $('#hcpEastMax');
			
			var divMsg = $('#msg');
			var divQuestion = $('#question');
			var divAnswerSuit = $('#answerSuit');
			var divAnswerRank = $('#answerRank');

			var divInfo = $('#info');
			var divBiddingBox = $('#biddingBox');
			var divAuction = $('#auction');

			var message = $('#message');
			var hint = $('#hint');

			var divContinue = $('#continue');

			var myhand = $('#myhand');
			var myhand = $('#myhand');

			var info = $('#info');

			var north = $('#north');
			var east = $('#east');
			var south = $('#south');
			var west = $('#west');
			var deck = $('#deck');

			var selectDifficulty = $('#selectDifficulty');

			var LEVEL;
			var POINTS = 0;

			function msg(s) {
				divMsg.text(s);
			}

			function msgAdd(s) {
				var txt = divMsg.text() + '\n' + s;
				msg(txt);
			}

			function msgAdd2(s) {
				var txt = divMsg.text() + '\n' + s;
				divMsg.text(txt);
			}

			// =============================================

			var messageCounter = -1;

			function userMessageTick() {
				if (messageCounter <= -200) {
					messageCounter = -(messageCounter) - 200;
					message.css('display', 'block');
					return;
				} else if (messageCounter <= -100) {
					message.css('display', 'none');
					messageCounter -= 100;
					return;
				} else if (messageCounter < 0) {
					return;
				}
				if (messageCounter == 0) {
					message.css('display', 'none');
				}
				messageCounter--;
			}

			function userMessage(txt, interval) {
				message.css('display', 'none');
				message.html('&nbsp;' + txt + '&nbsp;');
				if (interval) {
					messageCounter = -100 - interval;
				} else {
					messageCounter = -100 - 10;
				}
			}

			// =============================================

			var DEAL;

			function load(id) {
				if ('deal' === id) {
					return DEAL;
				}
				var json = localStorage.getItem(id);
				var obj = JSON.parse(json);
				return obj;
			}

			function loadNumber(id) {
				var json = localStorage.getItem(id);
				var obj = JSON.parse(json);
				return Number('' + obj);
			}

			function save(id, obj) {
				if ('deal' === id) {
					DEAL = obj;
					return;
				}
				if (obj) {
					var json = JSON.stringify(obj);
					localStorage.setItem(id, json);
				} else {
					localStorage.removeItem(id);
				}
			}

			save('VERSION', VERSION);

			// save('state', null);

			var CARD_WI = 35;
			var CARD_HE = 47;
			var AUCTION_WI = 99;

			var MID_X = 300;
			var MID_Y = 250;
			var EW_BACK_XD = 250;
			var EW_CARD_XD = 200;

			var EW_Y = MID_Y - CARD_HE;
			var EW_DUMMY_Y = EW_Y - 1.5 * CARD_HE;

			var WEST_BACK_X = MID_X - EW_BACK_XD - CARD_WI;
			var EAST_BACK_X = MID_X + EW_BACK_XD - CARD_WI;
			var NORTH_BACK_X = MID_X - CARD_HE;

			var WEST_CARD_X = MID_X - EW_CARD_XD - CARD_WI;
			var EAST_CARD_X = MID_X + EW_CARD_XD - CARD_WI;

			var WEST_X = MID_X - EW_CARD_XD;
			var EAST_X = MID_X + EW_CARD_XD;

			var NORTH_DUMMY_X = MID_X - 4.5 * CARD_WI;
			// var SOUTH_X = NORTH_DUMMY_X;

			var NS_Y_D = 150;

			// ===========================

			var NORTH_BACKSIDE_Y = MID_Y - NS_Y_D - CARD_HE;
			var WEST_BACKSIDE_X = WEST_BACK_X;
			var WEST_BACKSIDE_Y = EW_Y;
			var EAST_BACKSIDE_X = EAST_BACK_X;
			var EAST_BACKSIDE_Y = EW_Y;

			// var SOUTH_X = 100;
			var SOUTH_Y = MID_Y + NS_Y_D - CARD_HE;

			var WEST_X = WEST_BACKSIDE_X;
			var WEST_Y = WEST_BACKSIDE_Y;

			var NORTH_X = NORTH_BACK_X;
			var NORTH_Y = NORTH_BACKSIDE_Y;

			var EAST_X = EAST_BACKSIDE_X;
			var EAST_Y = EAST_BACKSIDE_Y;

			var HAND_X_D = 15;
			var HAND_Y_D = 30;

			var CONTINUE_X = MID_X + 1.5 * CARD_WI;
			var CONTINUE_Y = SOUTH_Y - 0.5 * CARD_HE;

			message.css('top', '' + (SOUTH_Y - 22) + 'px');
			message.css('left', '' + (NORTH_DUMMY_X + 10) + 'px');

			hint.css('top', '' + (SOUTH_Y) + 'px');
			hint.css('left', '' + (10) + 'px');

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

			SYM_SUIT['C'] = '&clubs;';
			SYM_SUIT['D'] = '&diams;';
			SYM_SUIT['H'] = '&hearts;';
			SYM_SUIT['S'] = '&spades;';
			SYM_SUIT['N'] = 'NT';

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

			var visible = {};

			var phase = PHASE_INIT;

			var card_html = "<span class='card' id='{id}'>&nbsp;</span>";
			var card_id = "C_{hand}_{suit}_{ix}";

			divAuction.css('left', (MID_X - AUCTION_WI) + 'px');
			divAuction.css('top', (NORTH_Y + 2 * CARD_HE) + 'px');
			divContinue.css('left', CONTINUE_X + 'px');
			divContinue.css('top', CONTINUE_Y + 'px');

			function randomInt(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			}

			function int(i) {
				return Math.floor(0.0000001 + i);
			}

			var CARDS = [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ];

			function backside(x, y, d) {

				var div = $($.parseHTML('<div />'));
				div.addClass('backside');
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
					var rr = 5 + (15 - r);
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

				divBiddingBox.append(bb);
			}

			var NS_X = MID_X - CARD_WI;
			// var EW_Y = ((NORTH_Y + 30 + SOUTH_Y - 100) / 2);
			var DX = 75;
			var DY = 50;
			var N_Y = EW_Y - DY;
			var S_Y = EW_Y + DY;
			var E_X = NS_X + DX;
			var W_X = NS_X - DX;

			var HAND_X = [ NORTH_DUMMY_X, EAST_X, NORTH_DUMMY_X, WEST_X ];
			var HAND_Y = [ NORTH_Y, EW_DUMMY_Y, SOUTH_Y, EW_DUMMY_Y ];
			var CARD_X = [ NS_X, E_X, NS_X, W_X ];
			var CARD_Y = [ N_Y, EW_Y, S_Y, EW_Y ];
			var MOVE_SUIT_Y = [ 0, 1, 0, 1 ];

			function displayCard(id, player) {
				var div = $('#' + id);
				div.css('left', CARD_X[player] + 'px');
				div.css('top', CARD_Y[player] + 'px');
				div.css('display', 'block');
			}

			function displayCards(hand, player) {
				hand = orderSHCD(hand);
				var y = 0;
				var x = 0;
				var last_suit = SPADES;
				// $('.card').css('display', 'none');
				for (var i = 0; i < hand.length; i++) {
					var s_r = hand[i].split('');
					var s = SUIT_CHARS.indexOf(s_r[0]);
					var r = RANK_CHARS.indexOf(s_r[1]);
					var card = CARDS[s][r];
					if (last_suit === s) {
					} else {
						x++;
						if (MOVE_SUIT_Y[player]) {
							y++;
							x = 0;
						}
					}
					var xx = HAND_X[player] + x * HAND_X_D;
					var yy = HAND_Y[player] + y * HAND_Y_D;
					card.css('left', xx + 'px');
					card.css('top', yy + 'px');
					card.css('display', 'block');
					x++;
					last_suit = s;
				}
			}

			var CORRECT_ANSWER = '';
			var ANSWER_SUIT = '';
			var ATTEMPT = 0;
			var MEMORY_POINTS = 0;

			function expectedBid(deal) {
				var ixBid = deal['ixBid'];
				var bids = deal['bids'];
				return bids[ixBid].replace('!', '');
			}

			function expectedCard(deal) {
				var ixPlay = deal['ixPlay'];
				var play = deal['play'];
				return play[ixPlay];
			}

			function showHint() {
				var deal = load('deal');
				if (!deal) {
					hint.css('display', 'none');
					return;
				}
				var turn = deal['turn'];
				if (SOUTH === turn || (NORTH === turn && SOUTH === deal['declarer'] && PHASE_PLAY === phase)) {
					hint.css('display', 'block');
					if (PHASE_BID === phase) {
						hint.html('&nbsp;Bid: ' + htmlBid(expectedBid(deal)) + '&nbsp;');
					} else if (PHASE_PLAY === phase) {
						hint.html('&nbsp;Play: ' + htmlCard(expectedCard(deal)) + '&nbsp;');
					} else {
						hint.css('display', 'none');
					}
				} else {
					hint.css('display', 'none');
				}
			}
            
            function allPass(bids) {
                for(var i = 0; i<bids.length; i++) {
                    if('P'!==bids[i]) { return false; }
                }
                return true;
            }
            
            var NOT_LEGAL = 'That bid is not legal here.\n\nTry another.';
            var COMPLETED = 'Bidding is completed.\n\nClick button: New Deal';
            var PROGRAM_BUD = 'Hmmm... there seems to be a bug in this webapp, sorry.\n\nPlease take a screendump of the auction and email to the site-administrator :)';
            
            function legalBid(bids, bid) {
            	var result;
                LOG('legalBid:');
                LOG(bids);
                LOG(bid);
                var len = bids.length;
                var _isAllPass = allPass(bids);
                if(len === 4 && _isAllPass) { 
                  alert(COMPLETED); return false; 
                }
                if(len >= 4 && allPass(bids.slice(len-3, len))) {
                  alert(COMPLETED); return false; 
                }
                LOG('bid: '+bid);
                if('P'===bid) { return true; }
                var _isContractBid    = isContractBid(bid);
                LOG('isContractBid: '+_isContractBid);
                var _lastContractBid  = lastContractBid(bids);
                var _lastContractSide = lastContractSide(bids);
                var _isDoubled = isDoubled(bids);
                var _isRedoubled = isRedoubled(bids);
                LOG('lastContractBid: '+_lastContractBid);
                LOG('lastContractSide: '+_lastContractSide);
                LOG('isDoubled: '+_isDoubled);
                LOG('isRedoubled: '+_isRedoubled);
                if(_isContractBid && _isAllPass) { return true; }
                if(_isContractBid){
                	result = (bid > _lastContractBid);
                	if(!result){
                		alert(NOT_LEGAL);
                	}
                	return result;
                }
                if('D'===bid){ 
                	result = ('they'===_lastContractSide && (!_isDoubled) && (!_isRedoubled));
                	if(!result){
                		alert(NOT_LEGAL);
                	}
                	return result;
                }
                if('R'===bid){
                	result = ('we'===_lastContractSide && _isDoubled && (!_isRedoubled));
                	if(!result){
                		alert(NOT_LEGAL);
                	}
                	return result;
                }
                alert(PROGRAM_BUG);
            }
            
            function isContractBid(bid){ return !isNaN(bid); }
            
            function lastContractBid(bids){
            	for(var i = bids.length-1; i>=0; i--){
            		var bid = bids[i];
            		if(isContractBid(bid)) {return bid;}
            	}
            	return '';
            }
            
            function isDoubled(bids){
            	for(var i = bids.length-1; i>=0; i--){
            		if('D'===bids[i]){return true;}
            		if(isContractBid(bids[i])){return false;}
            	}
            	return false;
            }
            
            function isRedoubled(bids){
            	for(var i = bids.length-1; i>=0; i--){
            		if('R'===bids[i]){return true;}
            		if(isContractBid(bids[i]) || 'D'===bids[i]){return false;}
            	}
            	return false;
            }
            
            function lastContractSide(bids){
            	var side = -1;
            	for(var i = bids.length-1; i>=0; i--){
            		var bid = bids[i];
            		if(isContractBid(bids[i])) {return (side>=1?'we':'they');}
            		side = (-side);
            	}
            	return 'none';
            }

			function bidClicked() {
				var id = $(this).attr('id');
				var tok = id.split('_');
				var level = tok[1];
				var denom = tok[2];
				var bid = ''+level+denom;
				bid = bid.replace('0XX', 'R').replace('0X', 'D').replace('0P', 'P');
				var DATA = load('DATA');
                var BIDS = load('BIDS');
                if(!legalBid(BIDS, bid)) {
                    return;
                }
				showBid(DATA.dealer, DATA.turn, DATA.ixBid, bid, '');
                BIDS.push(bid);
				DATA.turn++;
				DATA.ixBid++;
                // var oppBid = oppBid();
				showBid(DATA.dealer, DATA.turn, DATA.ixBid, 'P', '');
                BIDS.push('P');
				DATA.turn++;
				DATA.ixBid++;
				$('#whoBids').html(PLAYER_TEXT[DATA.turn%4]+"'s bid:");
				save('DATA', DATA);
				save('BIDS', BIDS);
			}

			var NAMES = [ 'Partner', 'RHO', 'me', 'LHO' ];

			var askedCards = [];

			function includesElement(ar, el) {
				for (var i = 0; i < ar.length; i++) {
					if (el === ar[i]) {
						return true;
					}
				}
				return false;
			}

			function qTrick(trickMax, level) {
				var trickMin = trickMax - level;
				if (trickMin < 0) {
					trickMin = 0;
				}
				var trick = randomInt(trickMin, trickMax + 1);
				return trick;
			}

			function setupQuestion(deal) {
				var ixPlay = deal['ixPlay'];
				var play = deal['play'];
				while (true) {
					var trickMax = int((ixPlay - 1) / 4);
					var trick = qTrick(trickMax, LEVEL);
					var r = randomInt(0, 4);
					var c = play[(4 * trick) + r];
					if (includesElement(askedCards, c)) {
						continue;
					}
					var player = locateCard(deal['cards'], c);
					var declarer = deal['declarer'];
					if (SOUTH === player || (NORTH === player && SOUTH === declarer)) {
						LOG('... re-try question ...');
						continue;
					}
					var name = NAMES[player];
					var question;
					if (trickMax === trick) {
						question = ' Which card did ' + name + ' just play? ';
					} else {
						question = ' Which card did ' + name + ' play to trick ' + (1 + trick) + '? ';
					}
					divQuestion.text(question);
					CORRECT_ANSWER = c;
					askedCards.push(c);
					ATTEMPT = 0;
					phase = PHASE_ASK;
					$('.answer').css('background-color', 'white');
					divAnswerRank.css('display', 'none');
					divAnswerSuit.css('display', 'block');
					divQuestion.css('display', 'block');
					return;
				}
			}

			var skipContinue = false;

			function markWinner(deal, ixPlay) {
				var winners = deal['winners'];
				var w = int((ixPlay - 1) / 4);
				var win = winners[w];
				if (win === 0 | win === 1) {
					var d = (win === 0 ? 'V' : 'H');
					var x = (NORTH_X + w * 18);
					var y = (SOUTH_Y + 3.5 * CARD_HE) + win * 10;
					backside(x, y, d);
				}
			}

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

			function parseDeal(url) {
				deal = readURL(url);
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
				for (var p = NORTH; p <= WEST; p++) {
					var hand = parseHand(hands[dealConvert[p]]);
					cards.push(hand);
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

			function tst() {
				for (var i = 0; i < 10; i++) {
					LOG('QTRICK: ' + qTrick(2, 99));
				}
				// var x = '5';
				// alert(typeof (x));
				// var y = JSON.stringify(x);
				// localStorage['valu'] = y;
				// var z = JSON.parse(localStorage['valu']);
				// alert(typeof (z));
				// alert('valu[' + z + ']');
			}

			function rotateRight(deal) {
				var dealer = deal['dealer'];
				var declarer = deal['declarer'];
				var dummy = deal['dummy'];
				var score = deal['score'];

				var ss = deal['cards'][SOUTH];
				deal['cards'][SOUTH] = deal['cards'][EAST];
				deal['cards'][EAST] = deal['cards'][NORTH];
				deal['cards'][NORTH] = deal['cards'][WEST];
				deal['cards'][WEST] = ss;

				dummy = ((dummy + 1) % 4)
				declarer = ((declarer + 1) % 4)
				dealer = ((dealer + 1) % 4)
				score = (-score);

				deal['dealer'] = dealer;
				deal['turn'] = dealer;
				deal['declarer'] = declarer;
				deal['dummy'] = dummy;
				deal['score'] = score;
			}

			function xloadNewDeal(url, score) {
				// tst();
				var deal = {}
				LOG('score: ' + score);
				divBiddingBox.css('display', 'block');
				divAuction.css('display', 'block');
				// var d = parseDeal(url);
				var hands = d['md'][0];
				var bids = d['mb'];
				var expl = d['an'];
				
				return;
				
				parseHands(deal, hands);
				deal['bids'] = bids;
				deal['expl'] = expl;
				deal['play'] = d['pc'];
				deal['ixBid'] = 0;
				deal['ixPlay'] = 0;
				deal['score'] = score;
				var firstLead = locateCard(deal['cards'], deal['play'][0]);
				var dummy = ((1 + firstLead) % 4);
				var declarer = ((3 + firstLead) % 4);
				deal['dummy'] = dummy;
				deal['declarer'] = declarer;
				// LOG('DUMMY: ' + dummy);
				if (score < 0) {
					LOG('ROTATE*1...');
					rotateRight(deal);
				}
				if (SOUTH === dummy) {
					LOG('ROTATE*2...');
					rotateRight(deal);
					rotateRight(deal);
				}
				// LOG(deal);
				LOG('new score: ' + deal['score']);
				var south = deal['cards'][SOUTH];
				displayCards(south, SOUTH);
				var dealer = deal['dealer'];
				var state = load('state');
				var dealNext = state['dealNext'];
				var dealSequence = state['dealSequence'];
				var dealId = dealSequence[dealNext];
				// boardNumber(dealNext, dealId, PLAYER_TEXT[dealer]);
				phase = PHASE_BID;
				var cards = deal['cards'];
				var winners = [];
				var sWinner = "";
				var play = deal['play'];
				for (var w = 1; w < 13; w++) {
					var wc = 4 * w;
					var p = locateCard(cards, play[wc]);
					sWinner = sWinner + (p % 2);
					winners.push(p % 2);
				}
				msgAdd2('WINNERS:' + sWinner);
				msgAdd2('WINNERS:' + JSON.stringify(winners));
				deal['winners'] = winners;
				return deal;
			}

			function tick() {
				showHint();
				uiController('tick');
			}

			function locateCard(cards, nextPlay) {
				if (nextPlay) {
					// continue;
				} else {
					return -1;
				}
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
				return (-1);
			}

			function switchBidToPlay() {
				msg('');
				phase = PHASE_PLAY;
				divBiddingBox.css('display', 'none');
				var top = divBiddingBox.css('top');
				var left = divBiddingBox.css('left');
				divAuction.css('top', top);
				divAuction.css('left', left);
				var deal = load('deal');
				var cards = deal['cards'];
				var play = deal['play'];
				var ixPlay = deal['ixPlay'];
				var nextPlay = play[ixPlay];
				var turn = locateCard(cards, nextPlay);
				deal['turn'] = turn;
				save('deal', deal);
			}

			function showDummy(hand, player) {
				displayCards(hand, player);
			}

			function divId(card) {
				var tok = card.split('');
				var s = tok[0];
				var r = tok[1];
				var id = 'C_' + s + '_' + r;
				// LOG('DIV_ID: ' + id);
				return id;
			}

			function showBid(dealer, turn, ixBid, bid, explText) {
				// LOG('showBid: ' + dealer + ' ' + turn + ' ' + ixBid + ' ' +
				// bid);
				var colDealer = (dealer + 1) % 4;
				var col = (turn + 1) % 4;
				var row = int(ixBid / 4);
				if (col < colDealer) {
					row++;
				}
				// LOG('R,C:' + row + ' ' + col);
				var table = $(divAuction.find('table'));
				var trList = $(table[0]).find('tr');
				// msgAdd('row: ' + row + ' tr: ' + trList.length);
				var tdList = $(trList[1 + row]).find('td');
				var td = $(tdList[col]);
				td.html(htmlBid(bid));
				if (explText.length > 3) {
					// alert(bid + ': ' + explText);
				}
			}

			function advanceGame() {
				var deal = load('deal');
				var turn = deal['turn'];
				if (PHASE_BID === phase) {
					var ixBid = deal['ixBid'];
					var bids = deal['bids'];
					var expl = deal['expl'];
					var bid = bids[ixBid];
					var explText = expl[ixBid];
					var dealer = deal['dealer'];
					// msgAdd('EXPL: ' + explText);
					showBid(dealer, turn, ixBid, bid, explText);
					ixBid++;
					deal['ixBid'] = ixBid;
					if (ixBid >= bids.length) {
						LOG('= AUCTION COMPLETED =');
						switchBidToPlay();
						return;
					}
					turn = ((1 + turn) % 4);
					deal['turn'] = turn;
				} else if (PHASE_PLAY === phase) {
					var cards = deal['cards'];
					var ixPlay = deal['ixPlay'];
					var play = deal['play'];
					if (ixPlay >= play.length) {
						phase = PHASE_END;
						var msg = 'You got: ' + MEMORY_POINTS + ' Memory Points :)<br />';
						msg += "&nbsp;Click 'Next' button above to continue...";
						userMessage(msg, 600);
						return;
					}
					var playCard = play[ixPlay];
					// msgAdd('PLAY: ' + playCard);
					visible[playCard] = true;
					var id = divId(playCard);
					$('#' + id).css('display', 'block');
					displayCard(id, turn);
					if (0 === (ixPlay + 1) % 4) {
						divContinue.css('display', 'block');
						phase = PHASE_CONTINUE;
					}
					ixPlay++;
					if (1 === ixPlay) {
						var dummy = deal['dummy'];
						showDummy(cards[dummy], dummy);
					}
					deal['ixPlay'] = ixPlay;
					// if (ixPlay >= play.length) {
					// phase = PHASE_END;
					// LOG('PHASE_END');
					// return;
					// }
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
				// msgAdd(player + ": " + bid + ' -- ' + expl);
				advanceGame();
			}

			function nextAutoPlay() {
				var deal = load('deal');
				var turn = deal['turn'];
				var player = PLAYER_CHARS[turn];
				var play = deal['play'];
				var ixPlay = deal['ixPlay'];
				var card = play[ixPlay];
				// msgAdd(player + ": " + card);
				advanceGame();
			}

			function initDealSequence() {
				var state = load('state');
				var dealNext;
				var dealMax;
				var dealSequence;
				var difficulty;
				if (state) {
					dealNext = state['dealNext'];
					dealMax = state['dealMax'];
					dealSequence = state['dealSequence'];
					dealSequence = state['dealSequence'];
					difficulty = state['difficulty'];

					LOG('LOADED:');
					LOG(dealNext);
					LOG(dealMax);
					// LOG(dealSequence);
					if (dealSequence) {
						// LOG('> seq OK');
						if (dealMax && (dealMax > 1)) {
							// LOG('> max OK');
							if ((0 === dealNext) || (dealNext && (dealNext >= 1) && (dealNext < dealMax))) {
								// LOG('> next OK');
								if (0 === difficulty || (difficulty && (difficulty >= 1))) {
									selectDifficulty.val('' + difficulty);
									// LOG('> difficulty OK' +
									// selectDifficulty.val());
									LEVEL = difficulty;
									return;
								}
							}
						}
					}
				}
				LOG('=re-Init=');
				dealNext = 0;
				dealMax = DEAL_MAX;
				difficulty = 1;
				LEVEL = difficulty;
				var dealSequence = [];
				for (var i = 0; i < dealMax; i++) {
					dealSequence.push(formatId(i));
				}
				for (var i = 0; i < dealMax; i++) {
					var r = randomInt(0, DEAL_MAX);
					var t = dealSequence[r];
					dealSequence[r] = dealSequence[i];
					dealSequence[i] = t;
				}
				LOG('=SAVING:=');
				state = {};
				state['dealMax'] = dealMax;
				state['dealNext'] = dealNext;
				state['dealSequence'] = dealSequence;
				state['difficulty'] = difficulty;
				selectDifficulty.val('' + difficulty);
				save('state', state);
				LOG(dealSequence);
			}

			function formatId(id) {
				var result = '' + id;
				while (result.length < 5) {
					result = '0' + result;
				}
				return result;
			}

			function boardNumber(dealNext, dealId, dealer) {
				info.css('font-weight', 'normal');
				info.html('Deal#' + (1 + dealNext) + ' (' + dealId + ')<br />Dealer: ' + dealer);
			}

			function difficultyChanged() {
				var state = load('state');
				state['difficulty'] = Number(selectDifficulty.val());
				save('state', state);
				reload();
			}

			function loadNewDealAsynch() {
				// LOG('=localStorage=');
				// LOG(localStorage);
				initDealSequence();
				LOG('LEVEL: ' + LEVEL);
				selectDifficulty.change(difficultyChanged);
				$.ajaxSetup({
					cache : false
				});
				var state = load('state');
				var dealSequence = state['dealSequence'];
				var dealNext = state['dealNext'];
				LOG('dealNext: ' + dealNext);
				var dealId = dealSequence[dealNext];
				// LOG('dealNext:');
				// LOG(dealNext);
				$.ajax({
					url : SERIES + '/deal_' + dealId + '.json',
					type : 'get',
					async : true,
					cache : false,
					dataType : 'text',
					success : function(js) {
						var json = JSON.parse(js);
						var url = json['hand'];
						var score = json['score'];
						var d = loadNewDeal(url, score);
						save('deal', d)
						phase = PHASE_BID;
					}
				});
			}

			function handleTick(p) {
				if (PHASE_INIT === phase) {
					loadNewDealAsynch();
					// var deal = loadNewDeal();
					// save('deal', deal);
					// phase = PHASE_BID;
					return;
				}
				if (PHASE_BID === phase) {
					nextAutoBid();
				}
				if (PHASE_PLAY === phase) {
					nextAutoPlay();
				}
			}

			function htmlBid(bid) {
				bid = bid.replace('!', '');
				if ('P' === bid) {
					return 'Pass';
				}
				if ('X' === bid || 'D' === bid) {
					return "<span class='red'>X</span>";
				}
				if ('R' === bid) {
					return 'XX';
				}
				var tok = bid.split('');
				var lvl = tok[0];
				var denom = tok[1];
				var result = '' + lvl + SYM_SUIT[denom];
				if ('H' === denom || 'D' === denom) {
					result = "<span class='red'>" + result + "</span>";
				}
				return result;
			}

			function htmlCard(bid) {
				var tok = bid.split('');
				var suit = tok[0];
				var rank = tok[1];
				var result = '' + SYM_SUIT[suit] + rank;
				if ('H' === suit || 'D' === suit) {
					result = "<span class='red'>" + result + "</span>";
				}
				return result;
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
				actualBid = actualBid.replace('0X', 'D').replace('0P', 'P').replace('0XX', 'R');
				// msgAdd(actualBid);
				var deal = load('deal');
				var bids = deal['bids'];
				var ixBid = deal['ixBid'];
				var expectedBid = deal['bids'][ixBid].replace('!', '');
				// LOG('EXPECTED: ' + expectedBid);
				if (expectedBid === actualBid) {
					advanceGame();
				} else {
					userMessage('Please bid: ' + htmlBid(expectedBid));
				}
			}

			function makePlay(tok) {
				var deal = load('deal');
				var play = deal['play'];
				var ixPlay = deal['ixPlay'];
				var expectedCard = play[ixPlay];
				var actualCard = tok[1] + tok[2];
				if (expectedCard === actualCard) {
					skipContinue = true;
					advanceGame();
				} else {
					userMessage('Please play: ' + htmlCard(expectedCard));
				}
			}

			function handleClick(p) {
				// LOG('CLICK: ' + p);
				var tok = p.split('_');
				var action = tok[0];
				if (PHASE_BID === phase && action === 'B') {
					makeBid(tok);
				} else if (PHASE_PLAY === phase && action === 'C') {
					makePlay(tok);
				} else {
					msg('');
					msgAdd('???');
				}
			}

			function uiController(t, p) {
				var tok = p.split('_');
				makeBid(tok);
				return;
// var deal = load('deal');
// if (!deal) {
// return;
// }
				var turn = deal['turn'];
				var declarer = deal['declarer'];
				var manualDummyPlay = (PHASE_PLAY === phase && turn === NORTH && declarer === SOUTH);
				if ('click' === t && (turn === SOUTH || manualDummyPlay)) {
					handleClick(p);
				} else if ('tick' === t && turn !== SOUTH && !manualDummyPlay) {
					handleTick(p);
				}
			}

			function dealStep(delta) {
				var state = load('state');
				var dealNext = state['dealNext'];
				var dealMax = state['dealMax'];
				var dealSequence = state['dealSequence'];
				dealNext = dealNext + delta;
				if (dealNext < 0) {
					dealNext = dealMax - 1;
				} else if (dealNext >= dealMax) {
					dealNext = 0;
				}
				state['dealNext'] = dealNext;
				save('state', state);
				reload();
			}

			function nextClicked() {
				dealStep(1);
			}

			function prevClicked() {
				dealStep(-1);
			}

			function reload() {
				location.reload(true);
			}
			
			function initDeal() {
				var d = [];
				for(var i = 0; i<52; i++) {
					d.push(i);
				}
				return d;
			}
			
			function getRandomInt(max) {
				  return Math.floor(Math.random() * Math.floor(max));
			}
				
			function shuffle() {
				var d;
				var DATA = load('DATA');
				if(DATA.deal){
					d = DATA.deal;
				}else{
					d = initDeal();
				}
				for(var i = 0; i<52; i++){
					var r = getRandomInt(52);
					var t = d[r];
					d[r] = d[i];
					d[i] = t;
				}
				DATA.deal = d;
				return d;
				save('DATA',DATA);
			}
			
			function toRank(r){
				return RANK_CHARS[2+r];
			}
			
			function hcp(deck, c0) {
				var result = 0;
				for(var i = c0; i<c0+13; i++){
					var rank = deck[i]%13;
					if(rank>=9) {result += rank-8;}
				}
				return result;
			}
			
			function cards(deck, h){
				var result = "";
				var suit = [];
				for(var i = 0; i<4; i++) {
					suit[i] = [];
				}
				for(var i = h; i<(h+13); i++) {
					var c = deck[i];
					var s = Math.floor(c/13);
					var r = c%13;
					suit[s].push(r);
				}
				for(var i=0; i<4; i++){
					suit[i].sort((a, b) => b - a);
				}
				for(var s = 0; s<4; s++){
					for(var r = 0; r<suit[s].length; r++){
						result += ""+toRank(suit[s][r])+"";
					}
					if(s<3) {
						result += " ";
					}
				}
				return result;
			}
			
			var SUIT_HTML = ["<span style='color:lightblue;'>&clubs;</span>","<span style='color:red;'>&diams;</span>","<span style='color:red;'>&hearts;</span>","<span style='color:lightblue;'>&spades;</span>"];
			
			function saveHcpParams(){
				var westMin = parseInt(hcpWestMin.val());
				var westMax = parseInt(hcpWestMax.val());
				var eastMin = parseInt(hcpEastMin.val());
				var eastMax = parseInt(hcpEastMax.val());
				if("number" === typeof(westMin) && 
						"number" === typeof(westMax) &&
						"number" === typeof(eastMin) &&
						"number" === typeof(eastMax) 
						){
					// OK
				}else{
					alert('Invalid hcp-range');
					return false;
				}
				if(isNaN(westMin) || 
						isNaN(westMax) ||
						isNaN(eastMin) ||
						isNaN(eastMax) 
						){
					alert('Invalid hcp-range');
					return false;
				}else{
					// OK
				}
				hcpWestMin.val(westMin);
				hcpWestMax.val(westMax);
				hcpEastMin.val(eastMin);
				hcpEastMax.val(eastMax);
				var DATA = load('DATA');
				DATA.westMin = westMin;
				DATA.westMax = westMax;
				DATA.eastMin = eastMin;
				DATA.eastMax = eastMax;
				save('DATA', DATA);
				return true;
			}
			
			function newDealClicked() {
				if(!saveHcpParams()) {return;}
				$('#btnNewDeal').prop('disabled', true);
				// initNewDeal();
				$('#btnNewDeal').prop('disabled', false);
				save('DECK', null);
				reload();
			}
			
			function undoBidsClicked() {
				reload();
			}
			
			function initNewDeal(){
				var westMin = parseInt(hcpWestMin.val());
				var westMax = parseInt(hcpWestMax.val());
				var eastMin = parseInt(hcpEastMin.val());
				var eastMax = parseInt(hcpEastMax.val());
				if("number" === typeof(westMin) && 
						"number" === typeof(westMax) &&
						"number" === typeof(eastMin) &&
						"number" === typeof(eastMax) 
						){
					// OK
				}else{
					alert('Invalid hcp-range');
					return;
				}
				if(isNaN(westMin) || 
						isNaN(westMax) ||
						isNaN(eastMin) ||
						isNaN(eastMax) 
						){
					alert('Invalid hcp-range');
					return;
				}else{
					// OK
				}
				hcpWestMin.val(westMin);
				hcpWestMax.val(westMax);
				hcpEastMin.val(eastMin);
				hcpEastMax.val(eastMax);
				LOG('hcp:');
				LOG(westMin);
				LOG(typeof(westMin));
				var deck = load('DECK');
				var done = false;
				var tries = 0;
				if(!deck){
					while(!done){
						deck = shuffle();
						var hcpWest = hcp(deck, 0);
						var hcpEast = hcp(deck, 26);
// LOG('hcpWest: '+hcpWest);
// LOG('hcpEast: '+hcpEast);
						if(hcpWest >= westMin && hcpWest<=westMax && hcpEast >= eastMin && hcpEast<=eastMax) {
							done = true;
						}
						tries++;
						if(tries>=200000){ 
							alert('Could not generate such hcp combination, sorry.\n\nTry wider hcp-intervals.\n\n('+tries+')'); 
							return; 
						}
					}
				}
				save('DECK', deck);
				var DATA = load('DATA');
				DATA.westMin = westMin;
				DATA.westMax = westMax;
				DATA.eastMin = eastMin;
				DATA.eastMax = eastMax;
				save('DATA', DATA);
				LOG('tries: ' + tries);
				var west = cards(deck, 0);
				var east = cards(deck, 26);
				DATA.deck = deck;
				DATA.dealer = WEST;
				DATA.turn = WEST;
				DATA.ixBid = 0;
				DATA.deck = deck;
				DATA.west = west;
				DATA.east = east;
				save('DATA', DATA);
				
// LOG(deck);
// var deal0 = deal(deck, 10,20, 10,20);
// var hands = deal0.split(';');
				deal = west+";"+east;
				var hands = deal.split(';');
				
				var h = [];
				h[0] = "";
				h[1] = "";
				
				for(var hh=0; hh<2; hh++) {
					for(var s = 3; s>=0; s--) {
						h[hh] += SUIT_HTML[s]+" ";
						h[hh] += hands[hh].split(' ')[s];
						if(s>0) {
							h[hh] += "<br />";
						}
					}
				}
				
				$('#west').html(h[0]);
				$('#east').html(h[1]);
				$('#whoBids').html(PLAYER_TEXT[DATA.turn%4]+"'s bid:");
				
				// loadNewDeal();
				
// $('#west').html('&diams; '+hands[0].split(' ').join('<br />&hearts; '));
// $('#east').html('&spades; '+hands[1].split(' ').join('<br />&clubs; '));
			}

			function setup() {
				LOG('setup');
				biddingBox();
				for (var s = CLUBS; s <= SPADES; s++) {
					for (var r = 2; r <= 14; r++) {
						var div = cardDiv(s, r);
						myhand.append(div);
						CARDS[s].push(div);
					}
				}
				$('.bid').click(bidClicked);
				$('.card').css('display', 'none');
				visible = {};
				for (var s = CLUBS; s <= SPADES; s++) {
					for (var r = 2; r <= 14; r++) {
						var s_r = '' + SUIT_CHARS[s] + RANK_CHARS[r];
						visible[s_r] = false;
					}
				}
				$('#btnNewDeal').click(newDealClicked);
				$('#btnUndoBids').click(undoBidsClicked);
				var DATA = load('DATA');
				if(DATA){
					// OK
				}else{
					DATA={};
				}
				if(DATA.westMin || 0===DATA.westMin){
					hcpWestMin.val(DATA.westMin);
					hcpWestMax.val(DATA.westMax);
					hcpEastMin.val(DATA.eastMin);
					hcpEastMax.val(DATA.eastMax);
				}
				save('DATA',DATA);
                var BIDS = new Array(0);
				save('BIDS',BIDS);
			}

			$(function() {
				info.text('');
				setup();
				initNewDeal();
			});
		}));
