({
  baseUrl: 'https://github.cookpad.com/',
  notificationUrl: 'https://github.cookpad.com/inbox/notifications',
  badgeColor: [255, 160, 80, 255],
  interval: 1000 * 60 * 10,
  pageLimit: 10,
  notifications: [],

  init: function() {
    this.setBadgeColor(this.badgeColor);

    var self = this;
    setInterval(function() {
      self.updateUnreadCount()
      self.updateNotifications();
    }, this.interval);
    this.updateUnreadCount();
    this.updateUnreadNotifications();

    this.bindRequest();
  },

  /* private */

  updateUnreadCount: function() {
    var self = this;
    this.getUnreadCount(function(unreadCount) {
      if (unreadCount > 0)
        self.setBadgeText(unreadCount);
    });
  },

  getUnreadCount: function(callback) {
    $.get(this.baseUrl, function(data) {
      var unreadCount = $(data).find('#user-links .unread_count').text();
      callback(unreadCount);
    });
  },

  updateUnreadNotifications: function() {
    this.notifications = [];
    this.crawlNotifications(1);
  },

  crawlNotifications: function(page) {
    if (page > this.pageLimit) return;

    var self = this;
    $.get(this.notificationUrl, function(data) {
      $(data).find('#inbox .item.unread').each(function() {
        var url = $(this).find('.subject').attr('href');
        self.notifications.push(url);
      });

      self.crawlNotifications(page + 1);
    });
  },

  bindRequest: function() {
    var self = this;
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
      sendResponse(self.notifications.pop());
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
