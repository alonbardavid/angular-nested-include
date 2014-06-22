describe("angular-nested-include",function(){
  beforeEach(module("angularNestedInclude"));

  it("should call onNestedLoad after nested includes finishes",inject(function($rootScope,$compile,$templateCache){
    $templateCache.put("inc1","<div id='inside1'><div ng-include='\"inc1_1\"'  id='inc1_1' on-nested-load='check(\"inc1_1\")'></div><div ng-include='\"inc1_2\"' id='inc1_2' on-nested-load='check(\"inc1_2\")'></div></div>");
    $templateCache.put("inc2","<div id='inside2'><div ng-include='\"inc2_1\"' id='inc2_1' on-nested-load='check(\"inc2_1\")'></div><div ng-include='\"inc2_2\"' id='inc2_2' on-nested-load='check(\"inc2_2\")'></div></div>");
    $templateCache.put("inc1_1","<div id='inside1_1'><div ng-include='\"inc1_1_1\"' id='inc1_1_1' on-nested-load='check(\"inc1_1_1\")'></div></div>");
    $templateCache.put("inc1_1_1","<div id='inside1_1_1'></div>");
    $templateCache.put("inc1_2","<div id='inside1_2'></div>");
    $templateCache.put("inc2_1","<div id='inside2_1'></div>");
    $templateCache.put("inc2_2","<div id='inside2_2'></div>");
    var scope = $rootScope.$new();
    var snapshots = {};
    var root = $compile("<div id='root'><div id='inc1' ng-include='\"inc1\"' on-nested-load='check(\"inc1\")'></div><div id='inc2' ng-include='\"inc2\"' on-nested-load='check(\"inc2\")'></div></div></div>")(scope);
    scope.check = function(cause){
      snapshots[cause] = root[0].querySelector("#" + cause).innerHTML;
    };
    $rootScope.$apply();

    expect(snapshots["inc1"]).toContain("inside1");
    expect(snapshots["inc1"]).toContain("inside1_1");
    expect(snapshots["inc1"]).toContain("inside1_1_1");
    expect(snapshots["inc1"]).toContain("inside1_2");

    expect(snapshots["inc1_1"]).toContain("inside1_1");
    expect(snapshots["inc1_1"]).toContain("inside1_1_1");

    expect(snapshots["inc1_1_1"]).toContain("inside1_1_1");

    expect(snapshots["inc1_2"]).toContain("inside1_2");

    expect(snapshots["inc2"]).toContain("inside2");
    expect(snapshots["inc2"]).toContain("inside2_1");
    expect(snapshots["inc2"]).toContain("inside2_2");

    expect(snapshots["inc2_1"]).toContain("inside2_1");

    expect(snapshots["inc2_2"]).toContain("inside2_2");

  }));
});
