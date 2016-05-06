'use strict';

angular.module('myApp.timer', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/timer/:id', {
            templateUrl: 'timer/timer.html',
            controller: 'TimerCtrl'
        });
    }])

    .controller('TimerCtrl', ['$scope', '$sce', '$routeParams', '$location', function ($scope, $sce, $routeParams, $location) {
        $scope.userId = $routeParams.id;
        $scope.userFirstName = '';
        $scope.profilePic = '';

        $scope.itemCounter = 0;
        $scope.list = [];
        $scope.newLabel = '';

        $scope.timerInterval = null;
        $scope.timerStart = null;
        $scope.timerElapsed = null;
        $scope.timerDisplay = '00:00';
        $scope.timerLabel = 'Ready To Go?';
        $scope.timerLimit = 25 * 60;
        $scope.timerItem = null;

        $scope.dailyTotal = '00:00:00';

        $scope.alert = false;

        $scope.myFirebaseRef = null;

        $scope.harvest = function (item) {
            return $sce.trustAsHtml('<div class="harvest-timer"  ' +
                'data-item=\'{"id":1,"name":"' + item.label + '"}\'>' +
                '</div>');
        }
        $scope.create = function () {
            var item = {
                label: $scope.newLabel,
                completed: false,
                style: '',
                repeat: [],
                totalTime: 0,
                timer: '00:00:00',
                id: $scope.itemCounter++,
                work: []
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
            var c = localStorage.getItem('counter');
            $scope.itemCounter = c ? c : 0;
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

        $scope.totalTime = function() {
            var total = 0;
            for(var i=0;i<$scope.list.length; i++) {
                if($scope.list[i].totalTime != undefined) {
                    total += $scope.list[i].totalTime;
                }
            }
            $scope.dailyTotal = $scope.displayTime(total, 'black', true);
        }

        $scope.save = function () {
            $scope.totalTime();

            localStorage.setItem('list', JSON.stringify($scope.list));
            localStorage.setItem('counter', $scope.itemCounter);
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
        };
        $scope.addMinutes = function(item) {
            var min = parseInt(prompt('Add Minutes:'))
            if(!isNaN(min)) {
                item.totalTime += min*60; // Convert Min - Sec
            }
            item.timer = $scope.displayTime(item.totalTime, 'black', true);
        };
        $scope.subMinutes = function(item) {
            var minStr = prompt('Subtract Minutes (75) = 1h15m or Stop Time (6:05pm): ');
            var timeOfDay = minStr.match(/^([0-9]+):0*([0-9]+)(am|pm)$/);
            var min = 0;
            if(timeOfDay) {
                var n = new Date();
                n.setTime(n - 86400000);
                n.setHours(timeOfDay[3].toLowerCase()=='am' ? parseInt(timeOfDay[1]) : parseInt(timeOfDay[1]) + 12)
                n.setMinutes(timeOfDay[2])
                min = Date.now() - n.getTime() / 60000;
            } else {
                min = parseInt(minStr);
            }
            if(!isNaN(min)) {
                item.totalTime -= min*60; // Convert Min - Sec
            }
            item.timer = $scope.displayTime(item.totalTime, 'black', true);
        };
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
            item.work.push({s:$scope.timerStart});
        };
        $scope.stopTimer = function () {
            var item = $scope.timerItem;
            item.started = false;
            $scope.timerInterval = null;
            if (item.totalTime == undefined) {
                item.totalTime = 0;
            }
            item.totalTime += $scope.timerElapsed;
            item.timer = $scope.displayTime(item.totalTime, 'black', true);
            item.work.push({t:new Date()});
            $scope.save();

            $scope.alert = false;
            $scope.timerStart = new Date();
            $scope.timerLimit = 5 * 60;
            $scope.timerLabel = 'Break';
            $scope.timerInterval = setInterval(function () {
                $scope.tock()
            }, 1000)
            $scope.timerDisplay = '0:05:00';

            //
            //item.harvest = $scope.harvest(item);
            //$("#harvest-messaging").trigger({
            //    type: "harvest-event:timers:add",
            //    element: $(".timetracker")
            //});
        };
        $scope.completeTask = function() {
            var item = $scope.timerItem;
            item.completed = true;
            $scope.stopTimer();
        }
        $scope.submitTime = function(item) {
            if(item.id == undefined) {
                item.id = $scope.itemCounter++;
            }
            $scope.save();
            HarvestPlatform.openIframe({
                'service':document.location.href,
                'item': {
                    id:item.id,
                    name:item.label.replace(/^.*:\s*/,'')
                }
            });
        }

        $scope.clearTime = function(item) {
            item.totalTime = 0;
            item.timer = '00:00:00';
        }
        $scope.clearTimes = function() {
            for (var i = 0;i<$scope.list.length; i++) {
                $scope.clearTime($scope.list[i]);
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
            //$scope.updateData();
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
            $scope.myFirebaseRef = new Firebase("https://blinding-inferno-4916.firebaseio.com/");
            $scope.myFirebaseRef.onAuth($scope.authCallback);

            window.addEventListener("beforeunload", function (event) {
                event.returnValue = "Don't leave stuff will break";
            });
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

        $scope.authCallback = function(authData) {
            if (authData) {
                $scope.userFirstName = authData.google.cachedUserProfile.given_name;
                $scope.profilePic = authData.google.cachedUserProfile.picture;

                //$scope.$apply();
                console.log("User ", $scope.userFirstName, $scope.profilePic);
            } else {
                $location.path('/login');
                //$scope.$apply();
            }
        }

        $scope.init();
    }]);
