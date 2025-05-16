var jsonInitialInline = "{\n\t\"words\":\n\t[\n";
var jsonFinalInline = "\t]\n}";
var g_JsonObjCounter = 0;
var g_WordArray = new Array();
var g_SelectedWordIndexes = new Array();
var g_ShowDeleteButton = new Boolean(false);
var g_CurrentCode = null;
var file_input = document.getElementById("id_upload_json_input");
var g_SearchExecuted = new Boolean(false);
var g_WordSearchExecuted = new Boolean(false);
var g_DisplayInfo = new Boolean(true);

var checkExistingWord = () => {
    if(g_WordArray.length == 0)
    {
        g_SearchExecuted = false;
        return;
    }

    document.getElementById("id_word_found").style.display = "block";

    let bFound = false;

    for(let i = 0; i < g_WordArray.length; ++i)
    {
        if(g_WordArray[i].word === document.getElementById("id_editor_field_word").value)
        {
            bFound = true;
            document.getElementById("id_word_found").innerHTML = "Word found.";
            document.getElementById("id_word_search_div").classList.add("word_found_mod");
            break;
        }
    }
    
    if(!bFound)
    {    
        document.getElementById("id_word_found").innerHTML = "&nbsp;";
        document.getElementById("id_word_search_div").classList.remove("word_found_mod");
    }

    document.getElementById("id_word_search").style.display = "none";
    g_SearchExecuted = false;
    return;
};

var searchExistingWord = () => {
    if(g_WordArray.length == 0)
    {
        g_WordSearchExecuted = false;
        return;
    }

    let bFound = false;
    document.getElementById("id_search_message").style.display = "block";
    
    for(let i = 0; i < g_WordArray.length; i++)
    {
        if(g_WordArray[i].word === document.getElementById("id_search_field").value)
        {
            bFound = true;
            document.getElementById("id_search_message").innerHTML = "Word found!";
            document.getElementById("xbtnid_" + i).scrollIntoView();
            break;
        }
        else if(g_WordArray[i].reading === document.getElementById("id_search_field").value)
        {
            bFound = true;
            document.getElementById("id_search_message").innerHTML = "Word found!";
            document.getElementById("xbtnid_" + i).scrollIntoView();
            break;
        }
        else if(g_WordArray[i].romaji === document.getElementById("id_search_field").value)
        {
            bFound = true;
            document.getElementById("id_search_message").innerHTML = "Word found!";
            document.getElementById("xbtnid_" + i).scrollIntoView();
            break;
        }
    }

    if(!bFound)
    {
        document.getElementById("id_search_message").innerHTML = "&nbsp;";
    }

    document.getElementById("id_search_loading_icon").style.display = "none";
    g_WordSearchExecuted = false;
    return;
};

file_input.addEventListener("change", function() {
    const fn = file_input.files[0];
    if(fn)
    {
        const file = new FileReader();
        file.onload = function() {
            const fcon = file.result;
            g_CurrentCode = new String(fcon);
            document.getElementById("id_textarea_json_code").innerHTML = g_CurrentCode;
            const data = JSON.parse(g_CurrentCode);
            g_WordArray.splice(0, g_WordArray.length);
            for(let i = 0; i < data.words.length; ++i)
            {
                let jlpt_level = null;
                let word_type = null;
                let word_note = null;
                if('jlptlevel' in data.words[i]) {
                    jlpt_level = data.words[i].jlptlevel;
                }
                if('type' in data.words[i]) {
                    word_type = data.words[i].type;
                }
                if('note' in data.words[i]) {
                    word_note = data.words[i].note;
                }

                let obj = new WordObject(
                    i, data.words[i].word, data.words[i].furigana, data.words[i].romaji, data.words[i].meaning, jlpt_level, word_type, word_note
                );
                g_WordArray.push(obj);
            }
            updateCode();
            updateTable();
        };
        file.readAsText(fn);
    }
});

function jsonObjectInline(word, furigana, romaji, meaning, jlpt_level = 0, word_type = null, word_note = null, bFirst = false)
{
    var finalStr = new String();
    g_JsonObjCounter += 1;
    if(g_JsonObjCounter > 1)
    {
        if(!bFirst) { finalStr += ",\n"; }
    }
    finalStr += `\t\t{\n\t\t\t\"word\": "${word.replace(/"/g, '\\"')}",\n`;
    finalStr += `\t\t\t\"furigana\": "${furigana.replace(/"/g, '\\"')}",\n`;
    finalStr += `\t\t\t\"romaji": "${romaji.replace(/"/g, '\\"')}",\n`;
    finalStr += `\t\t\t\"meaning": "${meaning.replace(/"/g, '\\"')}"`;
    if(jlpt_level > 0) { finalStr += `,\n\t\t\t\"jlptlevel": "${jlpt_level}"`; }
    if(word_type && word_type !== "Unspecified") { finalStr += `,\n\t\t\t\"type": "${word_type}"`; }
    if(word_note) { finalStr += `,\n\t\t\t\"note": "${word_note.replace(/"/g, '\\"')}"`; }
    finalStr += "\n\t\t}";

    return finalStr;
}

function updateCode()
{
    let txtaText = document.getElementById("id_textarea_json_code");
    txtaText.innerHTML = "";
    txtaText.innerHTML += jsonInitialInline;
    for(let i = 0; i < g_WordArray.length; ++i)
    {
        let tempStr = jsonObjectInline(
            g_WordArray[i].word,
            g_WordArray[i].reading,
            g_WordArray[i].romaji,
            g_WordArray[i].meaning,
            g_WordArray[i].jlpt_level,
            g_WordArray[i].word_type,
            g_WordArray[i].note,
            (i == 0) ? true : false
        );
        txtaText.innerHTML += tempStr;
    }
    txtaText.innerHTML += "\n" + jsonFinalInline;
}

function updateTable()
{
    let divopen_temp = "<div class=\"editor_list_item item_non_terminal nn\">";
    let divopen = "<div class=\"editor_list_item item_non_terminal nn\">";
    let divclose = "</div>";
    let list = document.getElementById("id_list_em");
    list.innerHTML = "";

    for(let i = 0; i < g_JsonObjCounter; ++i)
    {
        if(g_WordArray[i].jlpt_level != null) {
            divopen = "<div class=\"editor_list_item item_non_terminal n" + g_WordArray[i].jlpt_level + "\">";
        } else {
            divopen = divopen_temp;
        }

        let embedhtml = divopen;
        embedhtml += `<div class="editor_list_item_cell xitmbtn" style="width: 2%;" id="xbtnid_${i}" onclick="emitSelected(${i});">X</div>`;
        embedhtml += `<div class="editor_list_item_cell" style="width: 5%;"><span>${i+1}.</span></div>`;
        embedhtml += `<div class="editor_list_item_cell"><h4 class="no-margin no-padding" title="${((!g_WordArray[i].jlpt_level) ? "Unspecified level" : "N" + g_WordArray[i].jlpt_level)} word">${g_WordArray[i].word}</h4></div>`;
        embedhtml += `<div class="editor_list_item_cell"><p class="no-margin no-padding">${g_WordArray[i].reading}</p></div>`;
        embedhtml += `<div class="editor_list_item_cell"><p class="no-margin no-padding">${g_WordArray[i].meaning}</p></div>`;
        embedhtml += `<div class="editor_list_item_cell"><p class="no-margin no-padding color-gray"><i>${((g_WordArray[i].word_type != null) ? g_WordArray[i].word_type : "Unspecified")}</i></p></div>`;
        if(g_WordArray[i].note != null) {
            embedhtml += `<div class="editor_list_item_cell" style="padding: 0;"><button class="info_button" onmouseenter="displayInfo();" onmouseleave="hideInfo();" onmouseover="textInfo(this);" value="${g_WordArray[i].note}" disabled>note</button></div>`;
        }
        embedhtml += divclose;
        list.innerHTML += embedhtml;
    }
}

function restartIDs()
{
    let parentDiv = document.getElementById("id_list_em");
    let items = parentDiv.getElementsByTagName("div");
    for(let i = 0; i < items.length; ++i)
    {
        items[i].id = "xbtnid_" + toString(i);
    }
}

function textInfo(obj)
{
    document.getElementById("id_note_text").innerHTML = String(obj.value);
}

function deleteItem(index)
{
    g_WordArray.splice(index, 1);
    g_JsonObjCounter -= 1;
    restartIDs();
}

function emitSelected(index)
{
    deleteItem(index);
    updateTable();
}

function pushWord(a = null, b = null, c = null, d = null, e = 0, f = null, g = null)
{
    let word = document.getElementById("id_editor_field_word");
    let furigana = document.getElementById("id_editor_field_reading");
    let romaji = document.getElementById("id_editor_field_romaji");
    let meaning = document.getElementById("id_editor_field_meaning");
    let jlptlevel = document.getElementById("id_jlpt_level");
    let word_type = document.getElementById("id_word_type");
    let note_field = document.getElementById("id_note_field"); // TODO

    if(!word.value.length || !meaning.value.length)
    {
        alert("Enter required values.");
        return;
    }

    let note_val = null;
    if(note_field.value.length > 0) {
        note_val = note_field.value;
    }

    for(let i = 0; i < g_WordArray.length; ++i)
    {
        if(g_WordArray[i].word === word.value || g_WordArray[i].word === a)
        {
            let conf = confirm("The world already exists in collection. Do you wish to proceed?");
            if(!conf)
                return;
            break;
        }
    }

    g_JsonObjCounter += 1;
    g_WordArray.push(
        new WordObject(
            g_JsonObjCounter, 
            (a == null) ? word.value : a,
            (b == null) ? furigana.value : b,
            (c == null) ? romaji.value : c,
            (d == null) ? meaning.value : d,
            (e == null) ? jlptlevel.value : e,
            (f == null || f == "Unspecified") ? word_type.value : f,
            (g == null) ? note_val : g
        )
    );

    word.value = ""; furigana.value = ""; romaji.value = ""; meaning.value = "";
    g_SelectedWordIndexes.splice(0, g_SelectedWordIndexes.length);
    updateTable();
}

function saveJson()
{
    updateCode();
    const text = document.getElementById("id_textarea_json_code").value;
    const blob = new Blob([text], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'kantanne_flashcard.json';
    link.click();
    URL.revokeObjectURL(link.href);
}

function toggleShowHideHTML()
{
    let showHide = document.getElementById("id_show_hide_html");
    let htmlBox = document.getElementById("id_html");

    if(htmlBox.style.display === "block")
    {
        htmlBox.style.display = "none";
        showHide.innerHTML = "show";
    }
    else
    {
        htmlBox.style.display = "block";
        showHide.innerHTML = "hide";
    }
}

function displayInfo()
{
    document.getElementById("id_popup_info").style.display = "block";
    g_DisplayInfo = true;
}

function hideInfo()
{
    document.getElementById("id_popup_info").style.display = "none";
    g_DisplayInfo = false;
}

function updateStyleCode(obj = null)
{
    let txtarea = document.getElementById("id_txt_code");
    let wordVal = null;

    if(obj) {
        wordVal = obj.value;
    } else {
        wordVal = document.getElementById("id_editor_field_word").value;
    }

    let queryVal = document.querySelector('input[type="radio"][name="highlight_color"]:checked');
    if(!queryVal) { return; }

    let h_val = queryVal.value;
    let h_val_added = "";

    for(let i = 0; i < 5; ++i)
    {
        let retrobj = document.getElementById(`id_cbx_style_${i}`);
        if(retrobj.checked) {
            h_val_added += ` ${retrobj.value}`;
        }
    }

    h_val += h_val_added;

    let full_span = `<span class="${h_val}">${wordVal}</span>`;
    txtarea.value = full_span;
}

function applyStyles()
{
    let applyCode = document.getElementById("id_txt_code").value;
    document.getElementById("id_editor_field_word").value = applyCode;
}

document.getElementById("id_editor_field_word").addEventListener("input", () => {
    if(!g_SearchExecuted.valueOf())
    {
        document.getElementById("id_word_found").style.display = "none";
        document.getElementById("id_word_search").style.display = "block";
        document.getElementById("id_word_search_div").classList.remove("word_found_mod");

        setTimeout(
            () => {
                checkExistingWord();
            }, 1000
        );
        g_SearchExecuted = true;
    }
});

document.getElementById("id_search_field").addEventListener("input", () => {
    if(!g_WordSearchExecuted.valueOf())
    {
        document.getElementById("id_search_message").style.display = "none";
        document.getElementById("id_search_loading_icon").style.display = "block";
        
        setTimeout(
            () => {
                searchExistingWord();
            }, 1000
        );

        g_WordSearchExecuted = true;
    }
});

document.addEventListener("mousemove", (e) => {
    if(g_DisplayInfo)
    {
        const info_elem = document.getElementById("id_popup_info");
        info_elem.style.left = `${e.clientX+1}px`;
        info_elem.style.top = `${e.clientY+1}px`;
    }
});


document.getElementById("id_style_options").addEventListener("change", (e) => {
    updateStyleCode(document.getElementById("id_style_word"));
});