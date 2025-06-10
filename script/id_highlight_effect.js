/*
 * id - id of link that is being clicked. Id of section that is being scrolled to and that needs to be highlighted
 * must be prefixed with '_effect' in order to be linked through this function. Id of link that leads to section
 * must be same as id of section but without '_effect'.
 * 
 * Link ID: id_test_link
 * Section ID: id_test_link_effect
 */

function highlightEffect(id)
{
    $(`${id}_effect`).addClass("highlight-effect");
    setTimeout(function() {
        $(`${id}_effect`).removeClass("highlight-effect");
    }, 1000);
}