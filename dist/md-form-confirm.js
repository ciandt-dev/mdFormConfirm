!function(f,u){"use strict";u.module("mdFormConfirm",["ng"]).directive("form",["$timeout","$transitions","$mdDialog","$q",function(o,r,a,c){"ngInject";return{restrict:"E",scope:{name:"@name",ctrl:"@ctrl",obj:"@obj",nativeConfirm:"@nativeConfirm",formInit:"=formInit",formConfirmReject:"=formConfirmReject"},link:function(t,n,e){var i={enable:!0,backup:void 0,main:function(){e.ctrl&&e.obj&&i.addEventListener()},addEventListener:function(){o(i.setBackup.bind(i),700),r.onStart({},i.eventPrevent.bind(i)),t.$on("$destroy",i.clearEventListener.bind(i)),n.scope()[e.name].$isChanged=i.isModified.bind(i),n.scope()[e.name].$updateChanged=i.setBackup.bind(i),e.nativeConfirm&&i.enable&&(f.onbeforeunload=i.showNativeAlertConfirm.bind(i))},clearEventListener:function(){i.enable=!1,f.onbeforeunload=void 0},getData:function(){return n.scope()[e.ctrl][e.obj]},setBackup:function(){i.backup=u.copy(i.getData())},isModified:function(){if(i.enable)return!u.equals(i.getData(),i.backup)},showNativeAlertConfirm:function(){return i.isModified()},showPopupConfirm:function(){var e=c.defer();return a.show(a.confirm().title("Save changes").htmlContent("There are unsaved changes, would you like to continue?").cancel("CANCEL").ok("OK")).then(function(n){e.resolve(n)}).catch(function(n){e.reject(n),t.formConfirmReject&&t.formConfirmReject()}),e.promise},eventPrevent:function(){if(i.isModified())return i.showPopupConfirm(arguments)}};t.formInit?t.formInit=i.main.bind(i):i.main()}}}])}(window,window.angular);