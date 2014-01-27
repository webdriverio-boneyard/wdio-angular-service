'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }])
  .controller('MyCtrl5', function($timeout) {
    $timeout(function() {
      document.title = 'HELLO MY FRIEND';
    }, 250);
  })
  .controller('MyCtrl6', function($timeout) {
    $timeout(function() {
      window.aglobal = 'a global variable';
    }, 250);
  });