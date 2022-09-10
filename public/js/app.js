var app = angular.module('myApp', ['ngRoute'])



app.config(function($routeProvider) {
    $routeProvider
    .when('/home', {
        templateUrl: '../views/home.html',
        controller: 'nameCtrl'
    })
    .when('/purpose', {
        templateUrl: '../views/purpose.html'
    })
    .when('/names', {
        templateUrl: '../views/names.html',
        controller: 'nameCtrl'
    })
    .when('/sign', {
        templateUrl: '../views/sign.html',
        controller: 'signCtrl'
    })
    .otherwise({
        templateUrl: '../views/sign.html',
        controller: 'signCtrl'
    })
})


    app.controller('buttonCtrl', function($scope, $location) {
        $scope.name = function () {
            $location.path('/names');
        }
        $scope.home = function () {
            $location.path('/home');
        }
        $scope.sign = function() {
            $location.path('/sign');
        }
        $scope.purpose = function() {
            $location.path('/purpose')
        }
    })


    app.controller('nameCtrl', function($scope, $http) {
        //get data from db/json
        $scope.user = {}
        $http.get('/users')
            .then(function(res) {
                let fname = res.data.fname;
                let job = res.data.job;
                $scope.fname = fname;
                $scope.job = job;
                let nameJob = {}
                for (let i = 0; i < fname.length; i++){
                    nameJob[fname[i]] = job[i]
                }
                $scope.nameJob = nameJob
            })
            .catch(function(err){
                console.log(err);
            })

        //add data to db/json
        $scope.addItem = function() {
            newUser = JSON.stringify($scope.user)
            //console.log(newUser)
            $http.post('/users', newUser)
            .then(function(res) {
                $scope.fname = res.data.fname
                $scope.pass = res.data.job
                $scope.job = res.data.job
            })
        }
    })

app.controller('signCtrl', function($scope, $http, $location) {
    $scope.navToggle = false

    var dict = {
        'fname':[],
        'pass':[],
        'job':[]
    }

    $scope.fname = ''
    $scope.pass = ''
    $http.get('/users')
        .then(function(res) {
            dict.fname.push(res.data.fname)
            dict.pass.push(res.data.pass)
            dict.job.push(res.data.job)
            //console.log(dict.fname[0])
        })
        .catch(function(err){
            console.log(err);
        })
    $scope.addItem = function() {
        let i = 0
        while (i < dict.fname[0].length) {
            if ($scope.fname == dict.fname[0][i] || $scope.pass == dict.pass[0][i]) {
                $scope.wrong = false
                $scope.navToggle = true
                console.log('navToggle set to true')
                $location.path('/home')
            } else {
                $scope.wrong = true
            }
            i+=1;
        }
    }
})


