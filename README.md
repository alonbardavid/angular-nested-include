#angular-nested-include

`angular-nested-include` is an [angular.js](https://angularjs.org/) module that decorates `ng-include` to allow 
running an expression after all nested `ng-include` finished loading.


## installation

**Get angular-nested-include**:

 - download the [release](http://illniyar.github.io/angular-nested-include/release/angular-nested-include.js) (or [angular-nested-include](http://illniyar.github.io/visor/release/angular-nested-include.min.js))
 - via **[Bower](http://bower.io/)**: by running `$ bower install angular-nested-include` from your console

**Add `angularNestedInclude` dependency to your app**.

## Usage

```

    --------- app.js ---------
    angular.module("myApp",['angularNestedInclude'])
        .controller("myCtrl",function(scope){
            scope.callAfterLoad= function(){
                //innerDiv should be visible in this function
            }
        })
    
    --------- index.html -------------
    <html ng-app="myApp">
    <script type="text/ng-template" id="/outerTemplate.html">
      <div ng-include="'/innerTpl.html'"></div>
    </script>
    <script type="text/ng-template" id="/innerTemplate.html">
          <div id="innerDiv"></div>
    </script>
    <body ng-controller="myCtrl">
        <div ng-include="'/outerTemplate.html'" on-nested-load="callAfterLoad()"></div>
    </body>
    </html>
    
```

## disclaimer:

angular-nested-include decorates all ng-include directives.  
This can cause unexpected slowdowns and might not interact well with other modules that modify or depend on `ng-cinlude`.  