$(function () {
    test();
});

function test(){

    var parentDiv = $('<div id="delmodgrid-table"></div>');
    parentDiv.addClass("ui-jqdialog ui-widget ui-widget-content ui-corner-all jqmID1");
    parentDiv.attr("style","width: 240px; height: auto; z-index: 1050; overflow: hidden; top: 233px; left: 214px; display: block;");
    parentDiv.innerText("44555555");
    alert(parentDiv);
}