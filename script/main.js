var kanjiLink = document.getElementById("kanji_redirect");
if(kanjiLink != null)
{
    kanjiLink.addEventListener("click", function() {
        window.location.href = "https://jisho.org/search/" + document.getElementById("kanji_redirect").innerHTML.toString();
    });
}