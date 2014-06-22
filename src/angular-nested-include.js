(function(){
  "use strict";
  /**
   * @ngdoc object
   * @name angularNestedInclude
   * @description
   *
   * # angularNestedInclude
   *
   * angular-nested-include allows adding a `on-nested-load` attribute to `ng-include` elements that
   * will fire only after all nested `ng-include` finished loading.
   *
   * <div class="alert alert-warn">
   * **Warning**: angular-nested-include decorates all ng-include directives.
   * This can cause unexpected slowdowns and might not interact well with other modules that modify or depend on `ng-cinlude`;
   * </div>
   */
  angular.module("angularNestedInclude",[])

    .config(["$provide", function ($provide) {


      $provide.decorator("ngIncludeDirective", ["$delegate",function($delegate){
        /**
         * ng-include compiles nested ng-include directive inside it's link function.
         * So the order of events in a nested include is like this:
         *    parent compile func
         *    parent link func
         *      child compile func
         *    child link func
         *
         * what angularNestedInclude does is keep track of the child compile func
         * and wraps the parent link func, so that after link finishes, we know if
         * a child's compile happened.
         * If not compile happens, we call ng-nested-load, otherwise once the child's link
         * function finishes, we call the parent's ng-nested-load.
         */
        var prevCompile = $delegate[1].compile;
        var args = Array.prototype.slice.call(arguments,0);
        //contains how many dependencies each ng-include has
        // as well as the parent of the ng-include if needed
        var depTree = [];
        var currentParent = null;

        //wrap the child's compile function
        $delegate[1].compile = function(elem,tAttr){
          var link = prevCompile.apply($delegate,args);
          //currentParent is set by the link function of the parent's
          // if it's a child, it's bound to have the current parent
          // since compiling is synchornious and linear
          if (currentParent) {
            depTree[currentParent.__id][0]++;
          }
          //wrap the parent's link function
          return function(scope,$element,$attr,ctrl){
            var parentCtrl = $element.parent().inheritedData("$ngIncludeController");

            function finished(){
              depTree[ctrl.__id] = []; //remove references to allow GC if ng-include is destroyed
              if (parentCtrl){
                depTree[parentCtrl.__id][0]--;
              }
              callOnNestedLoad();
              scope.$emit("__innerNgInclude");
            }
            function callOnNestedLoad(){
              if ($attr.onNestedLoad) {
                scope.$eval($attr.onNestedLoad);
              }
            }

            function addIdToCtrl(){
              var id = depTree.length;
              depTree.push([0,parentCtrl]);
              Object.defineProperty(ctrl,"__id",{
                get: function(){ return id; },
                enumerable:false
              });
            }

            addIdToCtrl();

            //call the link function, we add currentParent so that
            //the child's compile will know what ng-include called it
            currentParent = ctrl;
            var result = link.apply(link,Array.prototype.slice.call(arguments,0));
            currentParent = null;

            if (depTree[ctrl.__id][0] == 0) {
              //the content of this ng-include does not contain any nested ng-include
              finished();
            } else {
              //there are nested ng-include. We listen to events that those children
              //ng-include send so that we can be notified when all children completed loading
              var unregister = scope.$on("__innerNgInclude",function(e){
                if (depTree[ctrl.__id][0] ==0) {
                  finished();
                  unregister();
                  //also we notify the parent because propogation did not stop
                } else {
                  //we stop propogation, so no parent will check dependencies
                  e.stopPropagation();
                }
              });
            }
            return result;
          }
        };
        return $delegate;
      }]);
    }]);
})();