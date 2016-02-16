'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope', '$location', function ($scope, $location) {

        $scope.message = '';

        $scope.init = function () {
            $scope.myFirebaseRef = new Firebase("https://blinding-inferno-4916.firebaseio.com/");
            $scope.myFirebaseRef.onAuth($scope.authCallback);
        };

        $scope.login = function () {
            $scope.myFirebaseRef.authWithOAuthPopup("google", function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {

                    console.log("Authenticated successfully with payload:", authData);
                }
            });
        }

        $scope.checkTimerIsUnused = function(data) {

        }

        $scope.authCallback = function (authData) {
            if (authData) {
                console.log("User: " , authData);
                var usersRef = $scope.myFirebaseRef.child('users/' + authData.uid);
                usersRef.once('value', function (dataSnapshot) {
                    var data = dataSnapshot.val();
                    if (data.timer != undefined) {
                        console.log("Go to (Existing): "+'/timer/' + data.timer);
                        $location.path('/timer/' + data.timer);
                        $scope.$apply();
                    } else {
                        var id = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                        for (var i = 0; i < 10; i++) {
                            id += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        var timerRef = $scope.myFirebaseRef.child('timers/' + id);
                        timerRef.once('value', function (dataSnapshot) {
                            var data = dataSnapshot.val();
                            if (data.uid != undefined) {
                                $scope.message = 'Timer id conflict, try again';
                                return false;
                            }
                            usersRef.set({timer:id});
                            timerRef.set({uid:authData.uid});

                            console.log("Go to (New): "+'/timer/' + id);

                            $location.path('/timer/' + id);
                            $scope.$apply();

                        }, function () {
                            $scope.message = 'Failed timer lookup';
                        });
                    }

                }, function () {
                    $scope.message = 'failed user lookup';
                })
                //$location.path('/timer/'+authData.uid);
            } else {
                console.log("User is logged out");
            }
        }

        $scope.init();
    }]);

