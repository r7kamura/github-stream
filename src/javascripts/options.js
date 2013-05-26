({
  init: function() {
    var self = this;
    $(function() {
      self.focusFirstInput();
      self.bindForm();
      self.setDefaultValue();
    });
  },

  /* private */

  focusFirstInput: function() {
    $(':input').focus();
  },

  bindForm: function() {
    var self = this;
    $('form').submit(function() {
      self.saveUrl($('#url').val());
      self.resetNotifications();
      close();
    });
  },

  saveUrl: function(url) {
    localStorage['host'] = this.canonicalizeUrl(url);
  },

  setDefaultValue: function() {
    $('#url').val(localStorage['host']);
  },

  canonicalizeUrl: function(url) {
    return url.replace(/\/$/, '');
  },

  resetNotifications: function() {
    chrome.extension.sendRequest({method: 'resetNotifications'});
  }
}).init();
