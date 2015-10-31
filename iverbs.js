
var iVerbServices = angular.module('iVerbServices', ['ngResource']).factory('IrregularVerbs', ['$resource', function($resource) {
    return $resource('data/verbs-:exerciseId.json', {}, { get: {isArray: true} });
}]);

var iVerbsApp = angular.module('iVerbsApp', ['ngRoute', 'iVerbServices']);

iVerbsApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/:exerciseId', {
        templateUrl: 'exercise.html',
        controller: 'IrregularVerbsExcerciseController'
    });
    
    $routeProvider.otherwise({
        redirectTo: '/1'
    });
}]);

iVerbsApp.controller('IrregularVerbsExcerciseController', ['$scope', '$location', '$routeParams', 'IrregularVerbs', function($scope, $location, $routeParams, IrregularVerbs) {
    $scope.allTest= [1, 2, 3, 4, 5, 6];
    $scope.mode = 'wait';
    $scope.exerciseId = $routeParams.exerciseId;
    $scope.verbs = [];

    IrregularVerbs.get({ exerciseId: $scope.exerciseId }, function(verbs) {
        angular.forEach(verbs, function(verb) {
            $scope.verbs.push({
                infinitive: verb.infinitive,
                simplePast: '',
                pastParticiple: '',
                correct: verb
            });
            
            $scope.mode = 'input';
        });
    });

    $scope.check = function() {
        angular.forEach($scope.verbs, function(verb) {
            verb.simplePastStatus = verb.correct.simplePast == verb.simplePast;
            verb.pastParticipleStatus = verb.correct.pastParticiple == verb.pastParticiple;
            verb.status = verb.simplePastStatus && verb.pastParticipleStatus;
        });

        $scope.mode = 'showResults';
    };

    $scope.repeat = function() {
        angular.forEach($scope.verbs, function(verb) {
            angular.copy({infinitive: verb.infinitive, correct: verb.correct}, verb);
            $scope.mode = 'input';
        });
    };
}]);
