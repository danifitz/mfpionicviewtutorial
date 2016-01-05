'use strict';

var controllers = angular.module('security-lab.controllers', []);

controllers.controller('PeopleController', function($scope, $state, MFPClientPromise) {

  $scope.people = [];

  MFPClientPromise.then(function() {
    var personRequest = new WLResourceRequest(
      'adapters/PeopleAdapter/getPeople',
      WLResourceRequest.GET
    );

    personRequest.setQueryParameter("params", "[]");

    personRequest.send().then(
      onSuccess,
      onFailure
    );

    function onSuccess(data) {
      console.log(data.responseJSON.results);
      $scope.people = data.responseJSON.results;
      $scope.$apply();
    }

    function onFailure(err) {
      console.log(err);
    }
  });

  $scope.formatName = function(person) {
    return person.name.title + ' ' + person.name.first + ' ' + person.name.last;
  };

  $scope.evaluateGender = function(gender) {
    if (gender === 'male') {
      return 'ion-male';
    } else {
      return 'ion-female';
    }
  };

  $scope.logout = function() {
    console.log('logging out');
    WL.Client.logout('AuthRealm');
    $state.go('app.login');
  };

});

controllers.controller('LoginController', function($scope, $state) {

  $scope.login = function(username, password) {

    var AuthRealmChallengeHandler = WL.Client.createChallengeHandler("AuthRealm");

    AuthRealmChallengeHandler.isCustomResponse = function(response) {
      if (!response || !response.responseJSON || response.responseText === null) {
        return false;
      }
      if (typeof(response.responseJSON.authRequired) !== 'undefined') {
        return true;
      } else {
        return false;
      }
    };

    AuthRealmChallengeHandler.handleChallenge = function(response) {
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

    var invocationData = {
      adapter: "PeopleAdapter",
      procedure: "submitAuthentication",
      parameters: [username, password]
    };

    AuthRealmChallengeHandler.submitAdapterAuthentication(invocationData, {});
  };
});
