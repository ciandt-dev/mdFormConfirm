(function(window, angular) {
  'use strict';

  angular.module('mdFormConfirm', ['ng']).directive('form', ['$timeout', '$transitions', '$mdDialog', function($timeout, $transitions, $mdDialog) {

  'ngInject';

  return {
    restrict: 'E',
    scope: {
      name: '@name',
      ctrl: '@ctrl',
      obj: '@obj',
      nativeConfirm: '@nativeConfirm'
    },
    link: function($scope, elmt, attr) {

      var $this = {
        enable: true,
        backup: undefined,

        /**
         * [description]
         * @return {[type]} [description]
         */
        main: function() {
          if (attr.ctrl && attr.obj) {
            $this.addEventListener();
          }
        },

        /**
         * [description]
         * @return {[type]} [description]
         */
        addEventListener: function() {
          $timeout($this.setBackup.bind($this), 700);
          $transitions.onStart({}, $this.eventPrevent.bind($this));
          $scope.$on('$destroy', $this.clearEventListener.bind($this));
          elmt.scope()[attr.name].$isChanged = $this.isModified.bind($this);
          elmt.scope()[attr.name].$updateChanged = $this.setBackup.bind($this);
          if (attr.nativeConfirm && $this.enable) {
            window.onbeforeunload = $this.showNativeAlertConfirm.bind($this);
          }
        },

        clearEventListener: function() {
          $this.enable = false;
          window.onbeforeunload = undefined;
        },

        /**
         * [description]
         * @return {[type]} [description]
         */
        getData: function() {
          return elmt.scope()[attr.ctrl][attr.obj];
        },

        /**
         * [description]
         * @return {[type]} [description]
         */
        setBackup: function() {
          $this.backup = angular.copy($this.getData());
        },

        /**
         * [description]
         * @return {[type]} [description]
         */
        isModified: function() {
          if ($this.enable) {
            return !angular.equals($this.getData(), $this.backup);
          }
        },

        /**
         * [description]
         * @return {[type]} [description]
         */
        showNativeAlertConfirm: function() {
          return $this.isModified();
        },

        /**
         * [description]
         * @return {[type]} [description]
         */
        showPopupConfirm: function() {
          return $mdDialog
            .show(
              $mdDialog
                .confirm()
                .title('Save changes')
                .htmlContent('There are unsaved changes, would you like to continue?')
                .cancel('CANCEL')
                .ok('OK')
            );
        },

        /**
         * [description]
         * @param  {[type]}   event   [description]
         * @param  {Function} next    [description]
         * @param  {[type]}   current [description]
         * @return {[type]}           [description]
         */
        eventPrevent: function() {
          if ($this.isModified()) {
            return $this.showPopupConfirm(arguments);
          }
        }
      };

      $this.main();
    }
  };
}]);
})(window, window.angular);
