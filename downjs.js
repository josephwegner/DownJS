var downjs;
var downjs_pending_operations = [];

(function() {

	downjs = function(scripts, callback, options) {
		
		if(typeof(callback) === "object") {
			options = callback;
			callback = function() { };
		}

		//Test to see if scripts is an array
		if(scripts.length && typeof(scripts) == "object") {

			for(var i=0, max=scripts.length; i<max; i++) {
				var scriptIndex = downjs_pending_operations.length;
 
				var jsonp = document.createElement('script');
				jsonp.type= "text/javascript";
				jsonp.id = escape(scripts[i]);
				jsonp.src = "http://script.downjs.com:%PORT%/?script=" + escape(scripts[i]) + "&id=" + scriptIndex;

				jsonp.onload = function() { loadScripts(scriptIndex, callback); }
				jsonp.onreadystatechange = function() {
					if(this.readyState == "complete") loadScripts(scriptIndex, callback);
				};

				document.getElementsByTagName("head")[0].appendChild(jsonp);
			}
		}

	};


	var loadScripts = function(index, callback) {
		var jsonp_Response = downjs_pending_operations[index];
		var resp;

		try {
			resp = eval("(" + jsonp_Response + ")");					
		} catch(e) {
			return false;
		}

		if(resp.error) {
			return false;
		}

		var oldScript = document.getElementById(resp.oldScript);
		oldScript.parentNode.removeChild(oldScript);

		var scripts = resp.scripts;
		var head = document.getElementsByTagName("head")[0];

		var sentinel = 0;

		for(var i=0,max=scripts.length; i<max; i++) {
			var script = document.createElement('script');
			script.type = "text/javascript";
			script.src = scripts[i];
		
			script.onload = function() {
				sentinel++;	

				if(sentinel >= max && typeof(callback) === "function") {
					callback();		
				}
			};
			script.onreadystatechange = function() {
				if(this.readyState == 'complete') sentinel++;

				if(sentinel >= max && typeof(callback) === "function") {
					callback();		
				}
				
			}
		
			head.appendChild(script);
		}
	}

})();


