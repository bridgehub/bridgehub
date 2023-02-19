(function(yourcode) {
  yourcode(window.jQuery, window, document);
}
  ( function($, window, document) {
//    alert('hello');
      var btnChannels = $("#btnChannels");
      var divChannels = $("#channels");
      var viewChannels = true;

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

    function btnChannelsClicked(){
        viewChannels = !viewChannels;
        if(viewChannels) { divChannels.show(); } 
        else             { divChannels.hide(); }
    }
	
	function channelClicked() {
		var chBox = $(this);
		var id = chBox.attr('id');
		var chName = id.split('_')[1];
		var checked = chBox.prop('checked');
		// alert(chName+':'+checked);
		if(checked){
			$(".item_"+chName).show();
			save(id,'1');
		} else {
			$(".item_"+chName).hide();
			save(id,'0');
		}
	}
    
    function init(){
		// alert('init');
		var chList = $(".channel_checkbox");
		chList.forEach
		for(const ch of chList) {
			var id = $(ch).attr('id');
			var chName = id.split('_')[1];
			var val = load(id);
			val = (val==='0') ? '0' : '1';
			save(id,val);
			// alert(id+':'+val);
			if(val==='0'){
				$(".item_"+chName).hide();
				$("#check_"+chName).prop('checked',false);
			} else {
				$("#check_"+chName).prop('checked',true);
				$(".item_"+chName).show();
			}
			// alert('chName:'+chName);
		}
		$(".channel_checkbox").click(channelClicked);
	}

    init();

    btnChannels.click(btnChannelsClicked);
    btnChannelsClicked();
  }));
