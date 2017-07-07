'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Musicgenres Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/v1/genres',
      permissions: '*'
    }, {
      resources: '/v1/genres/:musicgenreId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/v1/genres',
      permissions: ['get', 'post']
    }, {
      resources: '/v1/genres/:musicgenreId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/v1/genres',
      permissions: ['get']
    }, {
      resources: '/v1/genres/:musicgenreId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Musicgenres Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Musicgenre is being processed and the current user created it then allow any manipulation
  if (req.musicgenre && req.user && req.musicgenre.user && req.musicgenre.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
