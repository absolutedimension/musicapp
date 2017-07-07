(function () {
  'use strict';

  angular
    .module('musicgenres')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Musicgenres',
      state: 'musicgenres',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'musicgenres', {
      title: 'List Musicgenres',
      state: 'musicgenres.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'musicgenres', {
      title: 'Create Musicgenre',
      state: 'musicgenres.create',
      roles: ['user']
    });
  }
}());
