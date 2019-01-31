(function(window, angular) {
  'use strict';

  angular.module('mdFormConfirm', ['ng']).directive('form', ['$transitions', '$mdDialog', '$q', function($transitions, $mdDialog, $q) {

  'ngInject';

  return {
    restrict: 'E',
    scope: {
      name: '@name',
      ctrl: '@ctrl',
      obj: '@obj',
      nativeConfirm: '=nativeConfirm',
      formControl: '=formControl',
      formConfirmReject: '=formConfirmReject'
    },
    link: function($scope, elmt, attr) {

      var $this = {
        backup: undefined,

        /**
         * Direct module inicializer
         */
        main: function() {
          if (attr.ctrl && attr.obj) {
            $this.addEventListener();
          }
        },

        /**
         * Adds event listeners
         */
        addEventListener: function() {
          $transitions.onStart({}, $this.eventPrevent.bind($this));
          $scope.$watch('formControl', $this.featureSwitch.bind($this));
          $scope.$on('$destroy', $this.clearEventListener.bind($this));
        },

        /**
         * CLears event listeners and disable feature
         */
        clearEventListener: function() {
          window.removeEventListener('beforeunload', $this.showNativeAlertConfirm.bind($this));
          $this.enable = false;
        },

        /**
         * Toggles confirm form on or off
         * @param  {boolean} status
         * @return 
         */
        featureSwitch: function(status) {
          if (status) {
            $this.setBackup();
            $this.enable = true;
            window.addEventListener('beforeunload', $this.showNativeAlertConfirm.bind($this));
            return;
          }
          $this.clearEventListener();
        },

        /**
         * Get form model being observed
         * @return {object|Array<any>} [description]
         */
        getData: function() {
          var sampleData = angular.copy(elmt.scope()[attr.ctrl][attr.obj]);

          return angular.forEach(sampleData, function(value) {
            if (value.$$hashKey) {
              delete value.$$hashKey;
            }
            return value;
          });
        },

        /**
         * Sets backup data for comparison
         */
        setBackup: function() {
          $this.backup = $this.getData();
        },

        /**
         * Tells if the form model got modified from the backup
         * @return {boolean}
         */
        isModified: function() {
          if ($this.enable) {
            return !angular.equals($this.getData(), $this.backup);
          }
        },

        /**
         * Tells if a native confirmation should be displayed or not
         * @return {boolean}
         */
        showNativeAlertConfirm: function(event) {
          if ($scope.nativeConfirm && $this.isModified()) {
            event.preventDefault();
            event.returnValue = 'Modified';
            return true;
          }
          return false;
        },

        /**
         * Shows popup within application for confirmation on changes discard
         * @return {Promise}
         */
        showPopupConfirm: function() {
          var deferred = $q.defer();

          $mdDialog.show(
            $mdDialog
              .confirm()
              .title('Save changes')
              .htmlContent('There are unsaved changes, would you like to continue?')
              .cancel('CANCEL')
              .ok('OK')
          ).then(function(d) {
            deferred.resolve(d);
          }).catch(function(e) {
            deferred.reject(e);
            $scope.formConfirmReject && $scope.formConfirmReject();
          });

          return deferred.promise;
        },

        /**
         * Tells if the event should be prevented from happening based on modificated data
         * @return {Function}
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
