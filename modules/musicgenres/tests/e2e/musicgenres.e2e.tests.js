'use strict';

describe('Musicgenres E2E Tests:', function () {
  describe('Test Musicgenres page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/musicgenres');
      expect(element.all(by.repeater('musicgenre in musicgenres')).count()).toEqual(0);
    });
  });
});
