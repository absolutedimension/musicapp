(function () {
  'use strict';

  angular
    .module('musictracks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Musictracks',
      state: 'musictracks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'musictracks', {
      title: 'List Musictracks',
      state: 'musictracks.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'musictracks', {
      title: 'Create Musictrack',
      state: 'musictracks.create',
      roles: ['user']
    });
  }
}());
