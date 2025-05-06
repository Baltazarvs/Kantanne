var g_QuizLength = 10;

window.addEventListener("load", () => {
    g_QuizLength = 10;
    document.getElementById("id_index_max_span").innerHTML = g_QuizLength.toString();
});

function changeQuestion(sign = 1)
{
    // Change index at the top of quiz.
    let spanelem = document.getElementById("id_index_span");
    let currentIndex = parseInt(spanelem.innerHTML, "10")-1;

    if(sign < 0 && currentIndex <= 0)
        return;

    if(sign > 0 && currentIndex == (g_QuizLength-1))
        return;

    currentIndex += sign;
    spanelem.innerHTML = (currentIndex+1).toString();
    return currentIndex;
}