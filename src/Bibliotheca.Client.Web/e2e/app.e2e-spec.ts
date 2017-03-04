import { Bibliotheca.ClientPage } from './app.po';

describe('bibliotheca.client App', () => {
  let page: Bibliotheca.ClientPage;

  beforeEach(() => {
    page = new Bibliotheca.ClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
