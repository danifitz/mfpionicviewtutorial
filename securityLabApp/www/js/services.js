var services = angular.module('security-lab.services', []);

services.factory('AuthService', function() {
  var service = {};

  service.AuthRealmChallengeHandler = WL.Client.createChallengeHandler("AuthRealm");

  service.AuthRealmChallengeHandler.isCustomResponse = function(response) {
    if (!response || !response.responseJSON || response.responseText === null) {
      return false;
    }
    if (typeof(response.responseJSON.authRequired) !== 'undefined') {
      return true;
    } else {
      return false;
    }
  };

  service.AuthRealmChallengeHandler.handleChallenge = function(response) {
    var authRequired = response.responseJSON.authRequired;

    if (authRequired == true) {
      console.log('authRequired ', authRequired);

      if (response.responseJSON.errorMessage) {
        console.log('Auth error ', response.responseJSON.errorMessage);
        $scope.displayError = true;
        $scope.errorMessage = response.responseJSON.errorMessage;
        $scope.$apply();
      }
    } else if (authRequired == false) {
      console.log('authRequired ', authRequired);
      AuthRealmChallengeHandler.submitSuccess();
      $scope.displayError = false;
      $state.go('app.people');
    }
  };

  service.login = function() {
    var invocationData = {
      adapter: "PeopleAdapter",
      procedure: "submitAuthentication",
      parameters: [username, password]
    };

    AuthRealmChallengeHandler.submitAdapterAuthentication(invocationData, {});
  }

  service.logout = function() {
    WL.Client.logout('AuthRealm');
  }

  return service;
});
