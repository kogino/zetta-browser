angular.module('zetta').directive('sparkline', ['$compile', function($compile){

  function link(scope, element, attrs) {
      
     //console.log('sparkline el: ', element);
     scope.$watchCollection('stream', function() {
          stream = scope.stream.map(function(item){
            return {'x': parseInt(item[0].getTime()), 'y': item[1]};
          }); 
          
          var x = d3.time.scale().range([0, element.parent()[0].clientWidth]);
          var y = d3.scale.linear().range([scope.height, 0]);
      
          x.domain(d3.extent(stream, function(d) {return d.x}));
          y.domain(d3.extent(stream, function(d) {return d.y}));

          scope.line = d3.svg.line()
              .x(function(d) {return x(d.x);})
              .y(function(d) {return y(d.y);});
       
         var d = scope.line(stream);

         if (d) {
           element.find('path').attr({"d": d});
         }
    }); 

  }
  return {
    restrict: 'E',
    scope: {
      stream: '=',
      width: '=',
      height: '='
    },
    templateUrl: 'partials/sparkline.html',
    link: link
  };
}])
