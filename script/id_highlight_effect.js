function highlightEffect(id)
{
    $(id).addClass("highlight-effect");
    setTimeout(function() {
        $(id).removeClass("highlight-effect");
    }, 1000);
}