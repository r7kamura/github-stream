({
  baseUrl: 'https://github.cookpad.com/',
  badgeColor: [255, 160, 80, 255],
  interval: 1000 * 60 * 10,

  init: function() {
    this.setBadgeColor(this.badgeColor);

    var self = this;
    setInterval(function() { self.updateUnreadCount() }, this.interval);
    this.updateUnreadCount();
  },

  /* private */

  updateUnreadCount: function() {
    var self = this;
    this.getUnreadCount(function(unreadCount) {
      self.setBadgeText(unreadCount);
    });
  },

  getUnreadCount: function(callback) {
    $.get(this.baseUrl, function(data) {
      var unreadCount = $(data).find('#user-links .unread_count').text();
      callback(unreadCount);
    });
  },

  setBadgeText: function(text) {
    chrome.browserAction.setBadgeText({
      text: String(text)
    });
  },

  setBadgeColor: function(color) {
    chrome.browserAction.setBadgeBackgroundColor({
      color: color
    });
  }
}).init();
