function displayWindow(id)
{
    let wnd = document.getElementById(id);
    let dim = document.getElementById("id_popup_window_dim");
    wnd.style.display = "flex";
    dim.style.display = "block";
}

function closeWindow(id)
{
    let wnd = document.getElementById(id);
    let dim = document.getElementById("id_popup_window_dim");
    wnd.style.display = "none";
    dim.style.display = "none";
}