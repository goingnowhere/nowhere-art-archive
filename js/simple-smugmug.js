var SmugMug = function() {
    this.APIKey = 'iEpVFhNzjg73MakKjW2qgamzVqtI5mvF';
    this.sessionId = null;

    this.call = function(method, args, callback) {
      var url = 'http://api.smugmug.com/services/api/json/1.2.2/?APIKey=' + this.APIKey + '&method=smugmug.' + method;
      for (var arg in args) {
	url += "&" + arg + "=" + args[arg];
      }
      if (this.sessionId) url += "&SessionId=" + this.sessionId;

      $.ajax( { url: url, dataType: 'jsonp', jsonp: 'Callback', type: 'get', success: function(response) {
	  var ok = (response.stat && response.stat == "ok");
	  if (ok && response.Login && response.Login.Session) this.sessionId = response.Login.Session.id;
	  callback(response, ok);
      }});
  }
}

