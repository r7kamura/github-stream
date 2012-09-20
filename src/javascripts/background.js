({
  baseUrl: 'https://github.com',
  badgeColor: [255, 160, 80, 255],
  interval: 1000 * 60 * 10,
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
    this.crawlNotifications();
  },

  crawlNotifications: function() {
    var self = this;
    $.get(this.notificationUrl(), function(data) {
      $(data).find('#notification-center .notifications .unread').each(function() {
        var $this = $(this);

        var title = $this.find('.js-notification-target').text();
        var url   = $this.find('.js-notification-target').attr('href');
        var icon  = $this.find('.from-avatar:last-child').attr('src');

        self.notifications.push({
          title: title,
          url: url,
          icon: icon
        });
      });

      self.updateUnreadCount();
    });
  },

  notificationUrl: function() {
    return this.host() + '/notifications';
  },

  host: function() {
    return localStorage['host'] || this.baseUrl;
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
