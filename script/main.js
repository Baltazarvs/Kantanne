jQuery.expr.filters.offscreen = function(elem) {
    let r = elem.getBoundingClientRect();
    return (
        (r.x + r.width) < 0 ||
        (r.y + r.height) < 0 ||
        (r.x > window.innerWidth ||
        r.y > window.innerHeight)
    );
}