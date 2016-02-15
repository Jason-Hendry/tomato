'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$sce', function ($scope, $sce) {
        $scope.list = [];
        $scope.newLabel = '';

        $scope.timerInterval = null;
        $scope.timerStart = null;
        $scope.timerElapsed = null;
        $scope.timerDisplay = '00:00';
        $scope.timerLabel = 'Ready To Go?';
        $scope.timerLimit = 25 * 60;
        $scope.timerItem = null;

        $scope.alert = false;

        $scope.myFirebaseRef = null;

        $scope.harvest = function (item) {
            return $sce.trustAsHtml('<div class="harvest-timer"  ' +
                'data-item=\'{"id":1,"name":"' + item.label + '"}\'>' +
                '</div>');
        }

        $scope.completed = function (item) {
            item.style = item.completed ? 'completed' : '';
            $scope.save();
        };
        $scope.create = function () {
            var item = {
                label: $scope.newLabel,
                completed: false,
                style: '',
                repeat: [],
                timer: '00:00:00'
            };
            item.harvest = $scope.harvest(item);
            $scope.list.push(item);
            $scope.newLabel = '';
            $scope.save();
        };
        $scope.load = function () {
            var l = localStorage.getItem('list');
            if (l) {
                var old = $scope.list;
                try {
                    $scope.list = JSON.parse(l);
                } catch (e) {
                    $scope.list = old;
                }
            }
        };
        $scope.repeat = function (item) {
            if (item.repeat == undefined) {
                item.repeat = [];
            }
            item.repeat.push(1);
        };
        $scope.removeRepeat = function (item) {
            item.repeat.shift();
        };
        $scope.save = function () {
            localStorage.setItem('list', JSON.stringify($scope.list));
        };
        $scope.paddThaim = function (num) {
            return num < 10 ? '0'+num : num;
         }
        $scope.displayTime = function (sec, colour, hoursFloat) {
            var seconds = $scope.paddThaim(Math.floor(sec % 60));
            var minutes = $scope.paddThaim(Math.floor(sec/60 % 60));
            var hours = Math.floor(sec/3600);
            var hr = hoursFloat === true ? ' ('+(Math.round(sec / 3600 * 100) / 100)+')' : '';
            return '<span style="color: ' + colour + ';">' + hours + ':'  + minutes + ':' + seconds + hr + '</span>';
        }
        $scope.tock = function () {
            var now = new Date();
            // Seconds
            $scope.timerElapsed = (now.getTime() - $scope.timerStart.getTime()) / 1000;

            if ($scope.timerElapsed > $scope.timerLimit) {
                $scope.timerDisplay = $scope.displayTime($scope.timerElapsed, 'red');
                $("link[rel='icon']").attr("href","favicon/favicon-16x16-0.png");
                if ($scope.alert == false) {
                    $scope.notice($scope.timerLabel + ': Times Up');
                    $scope.alert = true;
                }
            } else {
                var display = $scope.timerLimit - $scope.timerElapsed;
                var min = Math.ceil(display / 60);
                $("link[rel='icon']").attr("href","favicon/favicon-16x16-"+min+".png");
                $scope.timerDisplay = $scope.displayTime(display, display < 5 * 60 ? 'orange' : 'black');
            }
            $scope.$apply();
        };
        $scope.startTimer = function (item) {
            $scope.alert = false;
            item.started = true;
            $scope.timerStart = new Date();
            $scope.timerLimit = 25 * 60;
            $scope.timerLabel = item.label;
            $scope.timerInterval = setInterval(function () {
                $scope.tock()
            }, 1000)
            $scope.timerDisplay = '0:25:00';
            $scope.timerItem = item;
        };
        $scope.stopTimer = function () {
            $scope.timerItem.started = false;
            $scope.timerInterval = null;
            if ($scope.timerItem.totalTime == undefined) {
                $scope.timerItem.totalTime = 0;
            }
            $scope.timerItem.totalTime += $scope.timerElapsed;
            $scope.timerItem.timer = $scope.displayTime($scope.timerItem.totalTime, 'black', true);
            $scope.save();

            $scope.alert = false;
            $scope.timerStart = new Date();
            $scope.timerLimit = 5 * 60;
            $scope.timerLabel = 'Break';
            $scope.timerInterval = setInterval(function () {
                $scope.tock()
            }, 1000)
            $scope.timerDisplay = '0:05:00';

            $scope.timerItem.harvest = $scope.harvest($scope.timerItem);
            $("#harvest-messaging").trigger({
                type: "harvest-event:timers:add",
                element: $(".timetracker")
            });
        };
        $scope.clearTimes = function() {
            for (var i = 0;i<$scope.list.length; i++) {
                $scope.list[i].totalTime = 0;
                $scope.list[i].timer = '00:00:00';
            }
            //$("link[rel='shortcut icon']").attr("href","favicon.ico");
        }
        $scope.notice = function (msg) {
            if (!Notification) {
                return;
            }

            if (Notification.permission !== "granted") {
                // Notification.requestPermission();
            } else {
                var notification = new Notification('Work Timer', {
                    icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Tomato-Torrent-Icon.png',
                    body: msg
                });
            }
        };
        $scope.init = function () {
            $scope.load();

            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
            $scope.myFirebaseRef = new Firebase("https://blinding-inferno-4916.firebaseio.com/");



        };
        $scope.break = function () {

        };
        $scope.remove = function (item) {
            if (confirm('Remove ' + item.label + ' from list?')) {
                $scope.list.splice($scope.list.indexOf(item), 1);
            }
            $scope.save();
        };
        $scope.test = function () {
            //    setInterval(function() {
            //        $scope.notice('Test Notification');
            //    }, 2000);
        };
        $scope.activeTimer = function () {
            return $scope.timerStart !== null && $scope.timerLabel !== 'Break';
        };
        $scope.init();
    }]);