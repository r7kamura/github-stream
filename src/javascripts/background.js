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
        var $this = $(this);

        var title   = $this.find('.title').text();
        var subject = $this.find('.message p:nth-child(1)').text();
        var body    = $this.find('.message p:nth-child(2)').text();
        var path    = $this.find('.subject').attr('href');
        if (!path.match(/^http/)) path = self.host() + path;

        self.notifications.push({
          title: title,
          subject: subject,
          body: body,
          url: path
        });
      });

      self.updateUnreadCount();
      self.crawlNotifications(page + 1);
    });
  },

  notificationUrl: function() {
    return this.host() + '/inbox/notifications';
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
