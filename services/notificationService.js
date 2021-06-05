const { Notification } = require('electron');

const notificationService = {
  notify: (text) => {
    const notification = {
      title: 'Hotline Parser',
      body: text,
    };
    new Notification(notification).show();
  },
};

module.exports = {
  notificationService,
}
