
function shuffle(sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
        var k = n + Math.floor(Math.random() * (sourceArray.length - n));

        var temp = sourceArray[k];
        sourceArray[k] = sourceArray[n];
        sourceArray[n] = temp;
    }
}

var PAGE_SIZE = 15;

var iVerbServices = angular.module('iVerbServices', ['ngResource']).factory('IrregularVerbs', ['$http', function($http) {
    var verbs = null;

    var promise = $http.get('data/verbs.json').success(function(data) {
        verbs = data;
        shuffle(verbs);

        var modes = ['infinitive', 'simplePast', 'pastParticiple'];

        angular.forEach(verbs, function(verb) {
            verb.mode = modes[Math.floor(Math.random() * modes.length)];
        });
    });

    return {
        promise: promise,
        allPages: function() {
            var pages = [];

            for (var i = 1; i <= verbs.length / PAGE_SIZE; ++i ) {
                pages.push(i);
            }
            
            return pages;
        },
        getVerbs: function(page) {
            return verbs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        }
    };
}]);


var iVerbsApp = angular.module('iVerbsApp', ['ngRoute', 'iVerbServices']);

iVerbsApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/:exerciseId', {
        templateUrl: 'exercise.html',
        controller: 'IrregularVerbsExcerciseController',
        resolve: {
            'irregularVerbs': function(IrregularVerbs) {
                return IrregularVerbs.promise;
            }
        }
    });
    
    $routeProvider.otherwise({
        redirectTo: '/1'
    });
}]);

iVerbsApp.controller('IrregularVerbsExcerciseController', ['$scope', '$location', '$routeParams', 'IrregularVerbs', function($scope, $location, $routeParams, irregularVerbs) {
    $scope.mode = 'input';
    $scope.exerciseId = $routeParams.exerciseId;
    $scope.allTest= irregularVerbs.allPages();
    $scope.verbs = [];

    angular.forEach(irregularVerbs.getVerbs($scope.exerciseId), function(verb) {
        $scope.verbs.push({correct: verb});
    });

    $scope.check = function() {
        angular.forEach($scope.verbs, function(verb) {
            verb.infinitiveStatus = verb.correct.infinitive == verb.infinitive;
            verb.simplePastStatus = verb.correct.simplePast == verb.simplePast;
            verb.pastParticipleStatus = verb.correct.pastParticiple == verb.pastParticiple;
            verb.status = verb.infinitiveStatus && verb.simplePastStatus && verb.pastParticipleStatus;
        });

        $scope.mode = 'showResults';
    };

    $scope.repeat = function() {
        angular.forEach($scope.verbs, function(verb) {
            angular.copy({mode: verb.correct.mode, correct: verb.correct}, verb);
            verb[verb.mode] = verb.correct[verb.mode];
        });
        $scope.mode = 'input';
    };

    $scope.repeat();
}]);
