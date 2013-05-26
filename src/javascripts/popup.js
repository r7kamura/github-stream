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
      var button = this;
      self.getOldestNotification(function(notification) {
        if (notification) {
          self.setDescriptions(notification);
          self.moveToUrl(notification.url);
        } else {
          self.setNoUnreadDescriptions();
        }
        $(button).toggleClass('disable', !notification);
      });
      return false;
    }).trigger('click');
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
  },

  setDescriptions: function(notification) {
    $('#title').text(notification.title);
    $('#icon').attr('src', notification.icon);
  },

  setNoUnreadDescriptions: function() {
    $('#title').text('No unread notifications.');
    $('#icon').attr('src', '../images/icon19.png');
    $("#next-button").remove();
  }
}).init();
