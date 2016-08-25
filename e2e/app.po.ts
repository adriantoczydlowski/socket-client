export class SocketClientPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('socket-client-app h1')).getText();
  }
}
