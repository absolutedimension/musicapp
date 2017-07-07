'use strict';

describe('Musictracks E2E Tests:', function () {
  describe('Test Musictracks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/musictracks');
      expect(element.all(by.repeater('musictrack in musictracks')).count()).toEqual(0);
    });
  });
});
