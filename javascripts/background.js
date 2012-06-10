({
  baseUrl: 'https://github.com',
  badgeColor: [255, 160, 80, 255],
  interval: 1000 * 60 * 10,
  pageLimit: 10,
  notifications: [],

  init: function() {
    this.setBadgeColor(this.badgeColor);
    this.startPolling();
    this.bindRequestToPopNotification();
    this.bindRequestToResetNotifications();
  },

  /* private */

  startPolling: function() {
    var self = this;
    setInterval(function() {
      self.updateUnreadNotifications();
    }, this.interval);
    this.updateUnreadNotifications();
  },

  updateUnreadCount: function() {
    if (this.notifications.length > 0) {
      this.setBadgeText(this.notifications.length);
    } else {
      this.setBadgeText('');
    }
  },

  updateUnreadNotifications: function() {
    this.notifications = [];
    this.crawlNotifications(1);
  },

  crawlNotifications: function(page) {
    if (page > this.pageLimit) return;

    var self = this;
    $.get(this.notificationUrl() + '?page=' + page, function(data) {
      $(data).find('#inbox .item.unread').each(function() {
        self.notifications.push($(this).find('.subject').attr('href'))
      });

      self.updateUnreadCount();
      self.crawlNotifications(page + 1);
    });
  },

  notificationUrl: function() {
    return (localStorage['host'] || this.baseUrl) + '/inbox/notifications';
  },

  bindRequestToPopNotification: function() {
    var self = this;
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
      if (request.method != 'popNotification') return;
      sendResponse(self.notifications.pop());
      self.updateUnreadCount();
    });
  },

  bindRequestToResetNotifications: function() {
    var self = this;
    chrome.extension.onRequest.addListener(function(request) {
      if (request.method != 'resetNotifications') return;
      self.updateUnreadNotifications();
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
