import { SocketClientPage } from './app.po';

describe('socket-client App', function() {
  let page: SocketClientPage;

  beforeEach(() => {
    page = new SocketClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('socket-client works!');
  });
});
