({
  init: function() {
    var self = this;
    $(function() {
      self.bindClick();
    });
  },

  /* private */

  bindClick: function() {
    var self = this;
    $('#next-button').click(function() {
      self.getOldestNotification(function(notification) {
        if (!notification) return;
        self.moveToUrl(notification);
      });
    });
  },

  getOldestNotification: function(callback) {
    chrome.extension.sendRequest({method: 'popNotification'}, function(res) {
      callback(res);
    });
  },

  moveToUrl: function(url) {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.update(tab.id, {url: url});
    });
  }
}).init();
