 "use strict";
    
    angular.module("spoilerApp", ['ngRoute', 'ngSanitize'])
        .config(function ($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        })
        .config(['$routeProvider', function ($routeProvider, $httpProvider) {
            $routeProvider.
                when('/exercise', {
                    templateUrl: '/templates/site/exercise.html',
                    controller: 'ExerciseController'
                }).
                when('/student-profile', {
                    templateUrl: '/templates/site/student-profile.html',
                    controller: 'StudentProfileController'
                }).
                otherwise({
                    redirectTo: '/exercise'
                });
        }])
        .controller('QuestionController', ['$scope', function ($scope) {
        $scope.questions = [
            {
                'questionNumber': 1,
                'module': 'Genética - Módulo 1',
                'lecture': 'Biologia',
                'name': 'As baleias orcas são:',
                'answers': [
                    {
                        'id': '1',
                        'name': 'Mamíferos'
                    },
                    {
                        'id': '2',
                        'name': 'Peixes'
                    },
                    {
                        'id': '3',
                        'name': 'Flipper'
                    },
                    {
                        'id': '4',
                        'name': 'GO WILY'
                    }
                ]
            },
            {
                'questionNumber': 2,
                'module': 'Genética - Módulo 1',
                'lecture': 'Biologia',
                'name': 'Os morcegos são:',
                'answers': [
                    {
                        'id': '1',
                        'name': 'Mamíferos'
                    },
                    {
                        'id': '2',
                        'name': 'Aves'
                    },
                    {
                        'id': '3',
                        'name': 'Vampiros'
                    },
                    {
                        'id': '4',
                        'name': 'nanananananananananana BATMAN'
                    }
                ]
            }
        ];
    }]);