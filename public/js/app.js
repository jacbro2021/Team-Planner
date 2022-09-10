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
        templateUrl: '../views/home.html'
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
    $scope.user = {'user':'Jacob'}
    $http.get('/users')
        .then(function(res) {
            let fname = res.data.fname;
            $scope.fname = fname;
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
        })
    }
})

app.controller('signCtrl', function($scope, $http, $location) {
    var dict = {'fname':[]}
    $scope.name = ''
    $http.get('/users')
        .then(function(res) {
            dict.fname.push(res.data.fname)
        })
        .catch(function(err){
            console.log(err);
        })
    $scope.addItem = function() {
        let i = 1
        while (i < dict.fname[0].length) {
            if ($scope.name == dict.fname[0][i]) {
                $scope.wrong = false
                $location.path('/home')
            } else {
                app.controller('errCtrl', function($scope) {
                    $scope.message = 'That name was not detected in our database. Please try again.'
                })
                $scope.wrong = true
            }
            i+=1;
        }
    }
})
