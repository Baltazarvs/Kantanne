function toggleTranslations(cbx)
{
    if($(`#${cbx}`).is(":checked")) {
        $(".translate-togglable").css("display", "none");
    } else {
        $(".translate-togglable").css("display", "block");
    }
}