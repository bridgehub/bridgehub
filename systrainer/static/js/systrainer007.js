(function(yourcode) {
	yourcode(window.jQuery, window, document);
}
		(function($, window, document) {

			if (!localStorage) {
				var txt = 'Hmmm... there seems to be a problem:<br /><br />';
				txt += 'This application requires the HTML5 localStorage feature.<br /><br />';
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

			function LOG2(s,t) {
				if (logEnabled) {
					if (console) {
						console.log(JSON.stringify(s)+', '+JSON.stringify(t));
					}
				}
			}

			var DEAL;

			// =============================================

			// HTML Elements

			var hcpWestMin = $('#iWestHcpMin');
			var hcpWestMax = $('#iWestHcpMax');
			var hcpEastMin = $('#iEastHcpMin');
			var hcpEastMax = $('#iEastHcpMax');
			
			var HAND = ['West','East','WE'];
			var PROP = ['Hcp','S','H','D','C','Major','Minor','Any'];
			var LIMIT = ['Min','Max'];
			var SHOW = {};
      SHOW['WE'] = 'West+East';
      SHOW['S'] = 'Spades';
      SHOW['H'] = 'Hearts';
      SHOW['D'] = 'Diamonds';
      SHOW['C'] = 'Clubs';
      SHOW['Any'] = 'Any Suit';
			
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

			var DEAL;

			function load(id) {
				if ('deal' === id) {
					return DEAL;
				}
				var json = localStorage.getItem(id);
				var obj = JSON.parse(json);
				return obj;
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

			var CORRECT_ANSWER = '';
			var ANSWER_SUIT = '';
			var ATTEMPT = 0;
			var MEMORY_POINTS = 0;

            function allPass(bids) {
                for(var i = 0; i<bids.length; i++) {
                    if('P'!==bids[i]) { return false; }
                }
                return true;
            }
            
            var NOT_LEGAL = 'That bid is not legal here.\n\nTry another.';
            var COMPLETED = 'Bidding is completed.\n\nClick button: New Deal';
            var PROGRAM_BUD = 'Hmmm... there seems to be a bug in this webapp, sorry.\n\nPlease take a screendump of the auction and email to the site-administrator :)';
            var INVALID_HCP = 'Invalid hcp-range.\n\nPlease correct hcp-parameters.';
            var EXTREME_HCP = 'Could not generate such hcp combination, sorry.\n\nTry wider hcp-intervals.';
            
            function legalBid(bids, bid, silent) {
            	var result;
                LOG('legalBid:');
                LOG(bids);
                LOG(bid);
                var len = bids.length;
                if(isCompleted(bids)) { 
                  alert(COMPLETED); return false; 
                }
                var _isAllPass = allPass(bids);
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
                	if(!result) {
                		if(1 !== silent) {
                			alert(NOT_LEGAL);
                		}
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
            
            function isCompleted(bids){
            	var len = bids.length;
            	return (len === 4 && allPass(bids)) || (len >= 4 && allPass(bids.slice(len-3, len)));
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
				if(isCompleted(BIDS)){
					$('#whoBids').html('Completed.&nbsp;');
				}else{
	                var oppBid = oppoBid(BIDS);
					showBid(DATA.dealer, DATA.turn, DATA.ixBid, oppBid, '');
	                BIDS.push(oppBid);
					DATA.turn++;
					DATA.ixBid++;
					$('#whoBids').html(PLAYER_TEXT[DATA.turn%4]+"'s bid:");
				}
				if(isCompleted(BIDS)){
					$('#whoBids').html('Completed.&nbsp;');
				}
				save('DATA', DATA);
				save('BIDS', BIDS);
			}
			
			function oppoBid(bids) {
				if(isCompleted(bids)) { return '';  }
				if('silent'===opposition()) { return 'P'; }
				if(bids.length===1) return northBid(bids);
				if(bids.length===3) return southBid(bids);
				return 'P';
			}
			
			function southBid(bids) {
				LOG2('southBid', bids);
				if('P'===bids[1]){return 'P';}
				var deck = load('DECK');
				var suitlen = checkSuitLen(deck,bids);
				LOG2('suitlen', suitlen);
				var ourLevel;
				var ourSuit;
				var ourLen;
				LOG2('bids[1]', bids[1]);
				if('D'===bids[1]) {
					var ourSuit = suitlen[0].suit;
					var ourLen = suitlen[0].len;
					LOG2('suitlen', suitlen);
					if(ourLen<=0){ return 'P'; }
					LOG2('ourSuit', ourSuit);
					LOG2('ourLen', ourLen);
					if(ourLen<=6) {return'P';}
					if(ourLen===7 && bids[2]!=='P') { return 'P'; }
					ourLevel = parseInt(bids[0].split("")[0]);
				} else {
					ourSuit  = parseInt(bids[1].split("")[1]);
					ourLevel = parseInt(bids[1].split("")[0]);
					LOG2('ourSuit',ourSuit);
					LOG2('ourLevel',ourLevel);
					var suitInfo = suitlen.filter(function(e){return ourSuit===e.suit;});
					ourLen   = (suitInfo.length>=1)?suitInfo[0].len:0;
					LOG2('ourLen',ourLen);
					if(ourLen<=7) { return 'P'; }
				}
				LOG2('ourLen', ourLen);
				LOG2('ourLevel.1', ourLevel);
				if(ourLen>=9  && ourLevel<=1) {ourLevel++;}
				LOG2('ourLevel.2', ourLevel);
				if(ourLen>=10 && ourLevel<=2) {ourLevel++;}
				LOG2('ourLevel.3', ourLevel);
				var bid = ''+(ourLevel+1)+''+ourSuit;
				var silent = 1;
				if(legalBid(bids, bid, silent)) { return bid; }
				var bid2 = ''+(ourLevel+2)+''+ourSuit;
				if(ourLen>=9 && legalBid(bids, bid2, silent)) { return bid2; }
				return 'P';
			}
			
			function northBid(bids) {
				if('P'===bids[0]){ return 'P'; }
				var oppo = opposition();
				if('takeout'===oppo)  { return 'D'; }
				if('overcall'!==oppo) { return 'P'; }
				var deck = load('DECK');
				var openlevel = parseInt(bids[0].split("")[0]);
				var opensuit  = parseInt(bids[0].split("")[1]);
				var suit = oppoSuit(deck, bids);
				if(suit<0){return 'P';}
				var level = (suit>opensuit)?(openlevel):(openlevel+1);
				return ''+level+''+suit;
			}
			
			function checkSuitLen(deck,bids) {
				var north = deck.slice(NORTH*13, 13+NORTH*13);
				var south = deck.slice(SOUTH*13, 13+SOUTH*13);
				var ns = north.concat(south);
				LOG2('ns',ns);
				var suitlen = [{},{},{},{}];
				for(var i=CLUBS; i<=SPADES; i++) { suitlen[i].suit=i; suitlen[i].len=0; }
				for (var i = 0; i<26; i++) {
					var c = ns[i];
					var s = Math.floor(c/13);
					suitlen[s].len += 1;
				}
				var opensuit = parseInt((bids[0].split(""))[1]);
				if(opensuit<=SPADES){suitlen[opensuit].len = 0;}
				if(0==getRandomInt(2)) { suitlen = suitlen.reverse(); }
				if(0==getRandomInt(2)) { suitlen = suitlen.reverse(); }
				LOG2('before.sort', suitlen);
				suitlen = suitlen.sort(function(a,b){return(b.len-a.len);});
				LOG2('after .sort', suitlen);
				return suitlen;
			}

			function oppoSuit(deck,bids) {
				var suitlen = checkSuitLen(deck,bids);
				LOG2('suitlen',suitlen);
				LOG2('suitlen.length-1',suitlen.length-1);
				LOG2('suitlen[suitlen.length-1].len',suitlen[suitlen.length-1].len);
				LOG2('cond',suitlen[suitlen.length-1].len<=6);
				while((suitlen.length>=1) && (suitlen[suitlen.length-1].len<=6)){LOG2('pop',suitlen.pop());}
				LOG2('suitlen',suitlen);
				if(suitlen.length<=0){ return (-1); }
				if(suitlen.length<=1){ return suitlen[0].suit; }
				if(suitlen[0].len>=suitlen[1].len+2){ return suitlen[0].suit; }
				if(0==getRandomInt(2)){ 
					return suitlen[1].suit; 
				} else {
					return suitlen[0].suit; 
				}
			}
			
			function opposition() {
				if($('#chkboxOvercall').prop('checked')){ return 'overcall'; }
				if($('#chkboxTakeout').prop('checked')) { return 'takeout'; }
				return 'silent';
			}

			var NAMES = [ 'Partner', 'RHO', 'me', 'LHO' ];

			var askedCards = [];

			var skipContinue = false;

			function readURL(url) {
				url = url.replace(new RegExp('\\+\\+', 'g'), '# ');
				url = url.replace(new RegExp('\\+', 'g'), ' ');
				url = url.replace(new RegExp('#', 'g'), '+');
				return url;
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

			function divId(card) {
				var tok = card.split('');
				var s = tok[0];
				var r = tok[1];
				var id = 'C_' + s + '_' + r;
				// LOG('DIV_ID: ' + id);
				return id;
			}

			function showBid(dealer, turn, ixBid, bid, explText) {
				var colDealer = (dealer + 1) % 4;
				var col = (turn + 1) % 4;
				var row = int(ixBid / 4);
				if (col < colDealer) {
					row++;
				}
				var table = $(divAuction.find('table'));
				var trList = $(table[0]).find('tr');
				var tdList = $(trList[1 + row]).find('td');
				var td = $(tdList[col]);
				td.html(htmlBid(bid));
				if (explText.length > 3) {
				}
			}

			function htmlBid(bid) {
				bid = bid.replace('!', '');
				if ('P' === bid) {
					return 'Pass';
				}
				if ('D' === bid) {
					return "<span class='red'>X</span>";
				}
				if ('R' === bid) {
					return "<span class='blue'>XX</span>";
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
            
            function sortOrder(a,b){return(b-a);}
			
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
					// suit[i].sort((a, b) => b - a);
					suit[i].sort(sortOrder);
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
			
      function restoreParams(params)
      {
        HAND.forEach(function(h) {
          PROP.forEach(function(p) {
            LIMIT.forEach(function(l) {
              var id = 'i' + h + p + l;
              $('#' + id).val(''+params[id]);
            });
          });
        });
        $('#cWestBal').prop('checked', params.cWestBal);
        $('#cWestSemibal').prop('checked', params.cWestSemibal);
        $('#cWestUnbal').prop('checked', params.cWestUnbal);
        $('#cEastBal').prop('checked', params.cEastBal);
        $('#cEastSemibal').prop('checked', params.cEastSemibal);
        $('#cEastUnbal').prop('checked', params.cEastUnbal);
      }
      
      function readParams()
      {
        var params = {};
        HAND.forEach(function(h) {
          PROP.forEach(function(p) {
            LIMIT.forEach(function(l) {
              var id = 'i' + h + p + l;
              var val = ''+$('#' + id).val().trim();
              params[id] = val;
            });
          });
        });
        params.cWestBal     = $('#cWestBal').prop('checked');
        params.cWestSemibal = $('#cWestSemibal').prop('checked');
        params.cWestUnbal   = $('#cWestUnbal').prop('checked');
        params.cEastBal     = $('#cEastBal').prop('checked');
        params.cEastSemibal = $('#cEastSemibal').prop('checked');
        params.cEastUnbal   = $('#cEastUnbal').prop('checked');
        // LOG2('params', params);
        return params;
      }
      
      function showId(s) {
        var result = SHOW[s];
        if(undefined===result) {result = s;}
        return result;
      }

      function validateParams(params)
      {
        var result = true;
        PROP.forEach(function(p) {
          HAND.forEach(function(h) {
            LIMIT.forEach(function(l) {
              if(!result){return;}
              var id = 'i' + h + p + l;
              var dId = showId(p) + '/'+ showId(h) +'/'+ showId(l);
              var dId2 = showId(p) + '/'+ showId(h);
              var sVal = params[id];
              var nVal = Number(''+sVal);
              if(isNaN(nVal)) {
                var msg = 'Invalid value:\n\n'+dId;
                alert(msg);
                result = false;
              }
              if('Hcp'===p && (nVal<0 || nVal>40)){
                var msg = 'Invalid value:\n\n'+dId;
                alert(msg);
                result = false;
              }
              if('Hcp'!==p && (nVal<0 || nVal>13)){
                var msg = 'Invalid value:\n\n'+dId;
                alert(msg);
                result = false;
              }
              if('Max'===l) {
                var idMin = 'i' + h + p + 'Min';
                var valMin = params[idMin];
                if(valMin>nVal) {
                  var msg = 'Inverted limits:\n\n'+dId2;
                  alert(msg);
                  result = false;
                }
              }
              params[id] = nVal;
            });
          });
        });
        return result;
      }

			function saveHcpParams(){
			  var params = readParams();
        LOG2('params(1): ', params);
			  var valid = validateParams(params);
        LOG2('params(2): ', params);
			  LOG2('valid: ', valid);
			  if(!valid){return false;}
				var DATA = load('DATA');
				DATA.params = params;
				DATA.overcall = $('#chkboxOvercall').prop('checked');
				DATA.takeout = $('#chkboxTakeout').prop('checked');
				save('DATA', DATA);
				return true;
			}
			
			function overcallClicked() {
				var val = $('#chkboxOvercall').prop('checked');
				if(val) { $('#chkboxTakeout').prop('checked', false); }
				LOG2('overcallClicked', val);
			}
			
			function takeoutClicked() {
				var val = $('#chkboxTakeout').prop('checked');
				if(val) { $('#chkboxOvercall').prop('checked', false); }
				LOG2('takeoutClicked', val);
			}
			
			function newDealClicked() {
				if(!saveHcpParams()) {return;}
				save('DECK', null);
				reload();
			}
			
			function resetSuitsClicked(){
        HAND.forEach(function(h) {
          PROP.forEach(function(p) {
            LIMIT.forEach(function(l) {
              if('Hcp'===p){return;}
              var id = 'i' + h + p + l;
              var val;
              if('Min'===l) {val=0;} else {val=13;}
              $('#'+id).val(''+val);
            });
          });
        });
        $('#cWestBal').prop('checked', true);
        $('#cWestSemibal').prop('checked', true);
        $('#cWestUnbal').prop('checked', true);
        $('#cEastBal').prop('checked', true);
        $('#cEastSemibal').prop('checked', true);
        $('#cEastUnbal').prop('checked', true);
			}
			
			function undoBidsClicked() {
				if(!saveHcpParams()) {return;}
				reload();
			}
			
			function criteriaClicked(){
				var criteria = $('#criteria');
				var cssCriteria = criteria.css('display');
				if('none' === cssCriteria) {
					criteria.css('display','');
				} else {
					criteria.css('display','none');
				}
			}
			
			function between(a,b,x){
			  return (a<=x && x<=b);
			}
			
			function handData(h) {
// LOG2('h',h);
			  var result = {};
        result.hcp = hcp(h,0);
        result.spades = 0;
        result.hearts = 0;
        result.diams  = 0;
        result.clubs  = 0;
        h.forEach(function(e){ 
// LOG2('e',e);
          var suit = Math.floor(e/13);
// LOG2('suit',suit);
          if(CLUBS ===suit){result.clubs++;  }else 
          if(DIAMS ===suit){result.diams++;  }else
          if(HEARTS===suit){result.hearts++; }else
          if(SPADES===suit){result.spades++; }
        });
        return result;
			}
			
			function addData(w,e) {
        var result = {};
        result.hcp = w.hcp+e.hcp;
        result.clubs  = w.clubs +e.clubs ;
        result.diams  = w.diams +e.diams ;
        result.hearts = w.hearts+e.hearts;
        result.spades = w.spades+e.spades;
        return result;
			}
			
      function isBal(h){
        var l = [h.spades, h.hearts, h.diams, h.clubs];
        l.sort();
        return (l[0]>=2 && l[1]>=3);
      }

      function isSemibal(h){
        var l = [h.spades, h.hearts, h.diams, h.clubs];
        l.sort();
        return (l[0]===2 && l[1]===2);
      }

      function isUnbal(h){
        var l = [h.spades, h.hearts, h.diams, h.clubs];
        l.sort();
        return (l[0]<=1);
      }

			function checkHands(deck, params) {
        var west = deck.slice(WEST*13, (WEST+1)*13);
        var east = deck.slice(EAST*13, (EAST+1)*13);
			  var w = handData(west);
			  var e = handData(east);
			  var we = addData(w,e);
			  
// LOG2('w', w);
// LOG2('e', e);
// LOG2('we', we);
			  
        if(!between(params.iWestHcpMin, params.iWestHcpMax, w.hcp        ))  {return false;}
        if(!between(params.iEastHcpMin, params.iEastHcpMax, e.hcp        ))  {return false;}
        if(!between(params.iWEHcpMin,   params.iWEHcpMax,   we.hcp       ))  {return false;}
        
        if(!params.cWestBal && isBal(w)) {return false;}
        if(!params.cEastBal && isBal(e)) {return false;}
        if(!params.cWestSemibal && isSemibal(w)) {return false;}
        if(!params.cEastSemibal && isSemibal(e)) {return false;}
        if(!params.cWestUnbal && isUnbal(w)) {return false;}
        if(!params.cEastUnbal && isUnbal(e)) {return false;}
        
        if(!between(params.iWestSMin,   params.iWestSMax,   w.spades     ))  {return false;}
        if(!between(params.iWestHMin,   params.iWestHMax,   w.hearts     ))  {return false;}
        if(!between(params.iWestDMin,   params.iWestDMax,   w.diams      ))  {return false;}
        if(!between(params.iWestCMin,   params.iWestCMax,   w.clubs      ))  {return false;}
        
        if(!between(params.iEastSMin,   params.iEastSMax,   e.spades     ))  {return false;}
        if(!between(params.iEastHMin,   params.iEastHMax,   e.hearts     ))  {return false;}
        if(!between(params.iEastDMin,   params.iEastDMax,   e.diams      ))  {return false;}
        if(!between(params.iEastCMin,   params.iEastCMax,   e.clubs      ))  {return false;}
        
        if(!between(params.iWESMin,     params.iWESMax,     we.spades)) {return false;}
        if(!between(params.iWEHMin,     params.iWEHMax,     we.hearts)) {return false;}
        if(!between(params.iWEDMin,     params.iWEDMax,     we.diams )) {return false;}
        if(!between(params.iWECMin,     params.iWECMax,     we.clubs )) {return false;}
        
        if(!between(params.iWestMajorMin,   params.iWestMajorMax,   w.spades ) && !between(params.iWestMajorMin,   params.iWestMajorMax,   w.hearts ))  {return false;}
        if(!between(params.iEastMajorMin,   params.iEastMajorMax,   e.spades ) && !between(params.iEastMajorMin,   params.iEastMajorMax,   e.hearts ))  {return false;}
        if(!between(params.iWEMajorMin,     params.iWEMajorMax,     we.spades) && !between(params.iWEMajorMin,     params.iWEMajorMax,     we.hearts))  {return false;}
        
        if(!between(params.iWestMinorMin,   params.iWestMinorMax,   w.diams ) && !between(params.iWestMinorMin,   params.iWestMinorMax,   w.clubs ))  {return false;}
        if(!between(params.iEastMinorMin,   params.iEastMinorMax,   e.diams ) && !between(params.iEastMinorMin,   params.iEastMinorMax,   e.clubs ))  {return false;}
        if(!between(params.iWEMinorMin,     params.iWEMinorMax,     we.diams) && !between(params.iWEMinorMin,     params.iWEMinorMax,     we.clubs))  {return false;}
        
        if(!between(params.iWestAnyMin,   params.iWestAnyMax,  w.spades) && 
            !between(params.iWestAnyMin,  params.iWestAnyMax,  w.hearts) &&
            !between(params.iWestAnyMin,  params.iWestAnyMax,  w.diams) &&
            !between(params.iWestAnyMin,  params.iWestAnyMax,  w.clubs)
            )  {return false;}
         
        if(!between(params.iEastAnyMin,   params.iEastAnyMax,  e.spades) && 
            !between(params.iEastAnyMin,  params.iEastAnyMax,  e.hearts) &&
            !between(params.iEastAnyMin,  params.iEastAnyMax,  e.diams) &&
            !between(params.iEastAnyMin,  params.iEastAnyMax,  e.clubs)
             )  {return false;}
          
        if(!between(params.iWEAnyMin,   params.iWEAnyMax,  we.spades) && 
            !between(params.iWEAnyMin,  params.iWEAnyMax,  we.hearts) &&
            !between(params.iWEAnyMin,  params.iWEAnyMax,  we.diams) &&
            !between(params.iWEAnyMin,  params.iWEAnyMax,  we.clubs)
             )  {return false;}
          
        return true;
			}
			
      function patternWestClicked(){
        var p = readParams();
        if(p.cWestBal || p.cWestSemibal || p.cWestUnbal) {
          // OK
        } else {
          $('.btnPatternWest').prop('checked', true);
        }
      }
      
      function patternEastClicked(){
        var p = readParams();
        if(p.cEastBal || p.cEastSemibal || p.cEastUnbal) {
          // OK
        } else {
          $('.btnPatternEast').prop('checked', true);
        }
      }
			
			function initNewDeal(){
// var westMin = parseInt(hcpWestMin.val());
// var westMax = parseInt(hcpWestMax.val());
// var eastMin = parseInt(hcpEastMin.val());
// var eastMax = parseInt(hcpEastMax.val());
// if("number" === typeof(westMin) &&
// "number" === typeof(westMax) &&
// "number" === typeof(eastMin) &&
// "number" === typeof(eastMax)
// ){
// // OK
// }else{
// alert(INVALID_HCP);
// return;
// }
// if(isNaN(westMin) ||
// isNaN(westMax) ||
// isNaN(eastMin) ||
// isNaN(eastMax)
// ){
// alert(INVALID_HCP);
// return;
// }else{
// // OK
// }
// hcpWestMin.val(westMin);
// hcpWestMax.val(westMax);
// hcpEastMin.val(eastMin);
// hcpEastMax.val(eastMax);
// LOG('hcp:');
// LOG(westMin);
// LOG(typeof(westMin));
				var deck = load('DECK');
				var done = false;
				var tries = 0;
				var params = readParams();
				if(!deck){
					while(!done){
            if(tries>=100000){ 
              alert('Could not generate hands to satisfy your hcp/suits criteria, sorry.\n\nYou can try \'New Deal\' again,\n  or relax your criteria.\n\n('+tries+')'); 
              return; 
            }
						deck = shuffle();
						done = checkHands(deck, params);
// var hcpWest = hcp(deck, WEST*13);
// var hcpEast = hcp(deck, EAST*13);
// if(hcpWest >= westMin && hcpWest<=westMax && hcpEast >= eastMin &&
// hcpEast<=eastMax) {
// done = true;
// }
						tries++;
					}
				}
				save('DECK', deck);
				var DATA = load('DATA');
// DATA.westMin = westMin;
// DATA.westMax = westMax;
// DATA.eastMin = eastMin;
// DATA.eastMax = eastMax;
				save('DATA', DATA);
				LOG('tries: ' + tries);
				var west = cards(deck, WEST*13);
				var east = cards(deck, EAST*13);
// DATA.deck = deck;
				DATA.dealer = WEST;
				DATA.turn = WEST;
				DATA.ixBid = 0;
// DATA.deck = deck;
				DATA.west = west;
				DATA.east = east;
				save('DATA', DATA);
				
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
			}

			function setup() {
				LOG('setup');
				biddingBox();
				for (var s = CLUBS; s <= SPADES; s++) {
					for (var r = 2; r <= 14; r++) {
// var div = cardDiv(s, r);
// myhand.append(div);
// CARDS[s].push(div);
					}
				}
				$('.bid').click(bidClicked);
				$('.card').css('display', 'none');
				visible = {};
				for (var s = CLUBS; s <= SPADES; s++) {
					for (var r = 2; r <= 14; r++) {
// var s_r = '' + SUIT_CHARS[s] + RANK_CHARS[r];
// visible[s_r] = false;
					}
				}
        $('.btnNewDeal').click(newDealClicked);
        $('#btnResetSuits').click(resetSuitsClicked);
				$('#btnUndoBids').click(undoBidsClicked);
				$('#chkboxOvercall').click(overcallClicked);
				$('#chkboxTakeout').click(takeoutClicked);
        $('#btnCriteria').click(criteriaClicked);
        $('.btnPatternWest').click(patternWestClicked);
        $('.btnPatternEast').click(patternEastClicked);
				var DATA = load('DATA');
				if(DATA){
					// OK
				}else{
					DATA={};
				}
// if(DATA.westMin || 0===DATA.westMin){
// hcpWestMin.val(DATA.westMin);
// hcpWestMax.val(DATA.westMax);
// hcpEastMin.val(DATA.eastMin);
// hcpEastMax.val(DATA.eastMax);
// }
				if(DATA.params) {
				  restoreParams(DATA.params); 
				} else {
				  DATA.params = readParams();
				}
        $('#chkboxOvercall').prop('checked', DATA.overcall);
        $('#chkboxTakeout').prop('checked', DATA.takeout);
        save('DATA',DATA);
        var BIDS = new Array(0);
				save('BIDS',BIDS);
			}

			$(function() {
				setup();
// readParams();
				initNewDeal();
			});
		}));
