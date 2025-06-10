var bWentOffscreen = false;

function toggleTranslations(cbx)
{
    if($(`#${cbx}`).is(":checked")) {
        $(".translate-togglable").css("display", "none");
    } else {
        $(".translate-togglable").css("display", "block");
    }
}

function toggleFurigana(cbx)
{
    if($(`#${cbx}`).is(":checked")) {
        $("rt").css("display", "none");
    } else {
        $("rt").css("display", "ruby-text");
    }
}

function showCloudInfo(arrayptr, index)
{
    $("#id_cloud_info").html(arrayptr[parseInt(index, 10)]);
}

$(".info-cloud-able").bind("mousemove", (e) => {
    let cursorPosX = e.originalEvent.clientX;
    let cursorPosY = e.originalEvent.clientY;
    $("#id_cloud_info")
        .css("display", "block")
        .css("left", `${cursorPosX+2}px`)
        .css("top", `${cursorPosY+2}px`)
    ;
});

$(".info-cloud-able").bind("mouseleave", function (e) {
    $("#id_cloud_info").css("display", "none");
});

$(window).bind("scroll", function() {
    if(!$("div.menu-mod").is(":offscreen")) {
        if(bWentOffscreen) {
            bWentOffscreen = false;
            $("div.menu-mod-bottom")
                .toggleClass("animate-bottom-menu")
                .addClass("animate-bottom-menu-off")
            ;
            }
        } else {
        if(!bWentOffscreen) {
            bWentOffscreen = true;
            $("div.menu-mod-bottom")
                .toggleClass("animate-bottom-menu")
                .removeClass("animate-bottom-menu-off")
            ;
        }
    }
});