angular
  .module('elroy', ['siren', 'ui.state', 'ui.bootstrap', 'ngAnimate', 'nvd3ChartDirectives', 'wu.masonry', 'luegg.directives'])
  .config(['classRouterProvider', '$stateProvider',
      function(classRouterProvider, $stateProvider) {

    // Route Siren entity classes to UI states.
    classRouterProvider
      .when(['app'], 'app')
      .otherwise('entity');

    // Configure UI states for app.
    $stateProvider
      .state('index', {
        url: '',
        templateUrl: 'partials/start.html',
        controller: 'MainCtrl'
      })
      .state('app', {
        url: '/app?url',
        templateUrl: 'partials/app.html',
        controller: 'AppCtrl'
      })
      .state('entity', {
        url: '/entity?url',
        templateUrl: 'partials/entity.html',
        controller: 'EntityCtrl'
      });
  }])
  .controller('MainCtrl',
      ['$scope', '$state', 'navigator', 'appState', MainCtrl])
  .controller('AppCtrl',
      ['$scope', '$sce', '$state', '$http', '$location', 'navigator', AppCtrl])
  .controller('EntityCtrl',
      ['$scope', '$sce', '$state', '$http', '$location', 'navigator', EntityCtrl])
  .factory('appState', function() {
    return { url: '', collection: '', query: '' };
  })
  .filter('encodeURIComponent', function() {
    return window.encodeURIComponent;
  })
  .filter('prettify', function() {
    return function(obj) {
      return JSON.stringify(obj, function(key, val) {
        return (key === '$$hashKey') ? undefined : val;
      }, 2);
    };
  })
  .filter('abc123', function(){
    return function(obj){
      //this doesn't really make things alphanumeric only, but it'll turn a non-urlencoded url into a valid js ID attribute :)
      return obj.replace(/\//g, "").replace(/:/g, "");
    }
  })
  .filter('pluralize', function() {
    return function(ordinal, noun) {
      if (ordinal == 1) {
        return ordinal + ' ' + noun;
      } else {
        var plural = noun;
        if (noun.substr(noun.length - 2) == 'us') {
          plural = plural.substr(0, plural.length - 2) + 'i';
        } else if (noun.substr(noun.length - 2) == 'ch' || noun.charAt(noun.length - 1) == 'x' || noun.charAt(noun.length - 1) == 's') {
          plural += 'es';
        } else if (noun.charAt(noun.length - 1) == 'y' && ['a','e','i','o','u'].indexOf(noun.charAt(noun.length - 2)) == -1) {
          plural = plural.substr(0, plural.length - 1) + 'ies';
        } else if (noun.substr(noun.length - 2) == 'is') {
          plural = plural.substr(0, plural.length - 2) + 'es';
        } else {
          plural += 's';
        }
        return ordinal + ' ' + plural;
      }
    };
  })
  .directive('selectOnClick', function() {
    return function(scope, element, attrs) {
      element.bind('click', function() {
        element[0].select();
      });
    };
  })
  .directive('srnAction', ['$compile', 'navigator', function($compile, navigator) {
    function link(scope, element, attrs) {
      if (!scope.action) {
        return;
      }

      var container = $('<div>');
      var visible = false;

      for(var i = 0; i < scope.action.fields.length; i++) {
        var field = scope.action.fields[i];

        var label = $('<label>')
          .addClass('control-label')
          .attr('for', scope.action.name + field.name)
          .text(field.title || field.name);

        var controls = $('<div>').addClass('controls');

        var input = $('<input>')
          .attr('name', field.name)
          .attr('id', scope.action.name + field.name)
          .attr('type', field.type || 'text')
          .attr('ng-model', 'action.fields[' + i + '].value')
          .val(field.value);


        $compile(input)(scope);

        controls.append(input);

        if (field.type !== 'hidden') {
          visible = true;
          container.append(label);
        }

        container.append(controls);
      };

      if (!visible) {
        container.append($('<em>').text('No fields available.'));
      }

      element.replaceWith(container);
    }

    return {
      restrict: 'E',
      scope: {
        action: '=value'
      },
      link: link
    };
  }]);
