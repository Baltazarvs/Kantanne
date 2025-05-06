var g_QuestionIndex = 0;

function activateTab(obj)
{
    let items = document.querySelectorAll("#id_tabs_in_editor > div");
    items.forEach(div => {
        div.classList.remove("active");
    });
    obj.classList.add("active");
}

function changeTab()
{
    
}