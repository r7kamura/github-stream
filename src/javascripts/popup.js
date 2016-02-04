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
    $('#next-button').click(function(event) {
      var button = this;
      self.getOldestNotification(function(notification) {
        if (notification) {
          self.setDescriptions(notification);
          self.moveToUrl(notification.url, event.metaKey);
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

  moveToUrl: function(url, newTab) {
    chrome.tabs.getSelected(null, function(tab) {
      if (newTab) {
        chrome.tabs.create({url: url, index: tab.index + 1});
      } else {
        chrome.tabs.update(tab.id, {url: url});
      }
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
