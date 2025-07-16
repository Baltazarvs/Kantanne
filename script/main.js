jQuery.expr.filters.offscreen = function(elem) {
    let r = elem.getBoundingClientRect();
    return (
        (r.x + r.width) < 0 ||
        (r.y + r.height) < 0 ||
        (r.x > window.innerWidth ||
        r.y > window.innerHeight)
    );
}

$(window).on("load", function() {
	$("div.cell-example-sign.setsumei").prop("title", "This is useful info or explaination that often appears after certain example or paragraph.");
	$("table.simple-table table .irregular").prop("title", "Red color in this case indicates irregular reading of the counter and should be memorized.");
});