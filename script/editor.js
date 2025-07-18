// Copyright (C) 2025 baltazarus. Kantanne is free.

var g_WordArray = new Array();
var g_ShowDeleteButton = new Boolean(false);
var g_CurrentCode = null;
var file_input = $("#id_upload_json_input");
var file_append = $("#id_append_json_input");
var g_SearchExecuted = new Boolean(false);
var g_WordSearchExecuted = new Boolean(false);
var g_DisplayInfo = new Boolean(true);
var g_CompressJSON = false;
var g_CompressionMethod = 1;
var jsonInitialInline = "{\n\t\"words\":\n\t[\n";
var jsonFinalInline = "\t]\n}";
var g_DragActive = false;
var g_JsonObjCounter = g_WordArray.length;
var g_LoadingProgress = 0;
var g_LoadEnabled = true;
var g_IsAnyChecked = false;

function WordObject(index, word, reading, romaji, meaning, jlpt_level = null, word_type = null, note = null, marked = false, pitch = 0, checked = false)
{
    this.index = index;
    this.word = word;
    this.reading = reading;
    this.romaji = romaji;
    this.meaning = meaning;
    this.jlpt_level = jlpt_level;
    this.word_type = word_type;
    this.note = note;
    this.marked = marked;
    this.pitch = pitch;

    // This option is independent and is only used in editor. It is not exported to JSON. It is mainly used for easing checking usage.
    this.checked = checked;
}

var checkExistingWord = () => {
    if(g_WordArray.length == 0)
    {
        g_SearchExecuted = false;
        return;
    }

    $("#id_word_found").css("display", "block");

    let bFound = false;

    for(let i = 0; i < g_WordArray.length; ++i)
    {
        if(g_WordArray[i] === $("#id_editor_field_word").val()) {
            bFound = true;
            $("#id_word_found").html("Word found.");
            $("#id_word_search_div").addClass("word_found_mod");
            return;
        }
    }
    
    if(!bFound)
    {    
        $("#id_word_found").html("&nbsp;");
        $("#id_word_search_div").removeClass("word_found_mod");
    }

    $("#id_word_search").css("display", "none");
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
    $("#id_search_message").css("display", "block");
    
    for(let i = 0; i < g_WordArray.length; ++i) {
        if(g_WordArray[i].word === $("#id_search_field").val())
        {
            bFound = true;
            $("#id_search_message").html("Word found!");
            $("#xbtnid_" + i)[0].scrollIntoView();
            return;
        }
        else if(g_WordArray[i].reading === $("#id_search_field").val())
        {
            bFound = true;
            $("#id_search_message").html("Word found!");
            $("#xbtnid_" + i)[0].scrollIntoView();
            return;
        }
        else if(g_WordArray[i].romaji === $("#id_search_field").val())
        {
            bFound = true;
            $("#id_search_message").html("Word found!");
            $("#xbtnid_" + i)[0].scrollIntoView();
            return;
        }
    }

    if(!bFound) {
        $("#id_search_message").html("&nbsp;");
    }

    $("#id_search_loading_icon").css("display", "none");
    g_WordSearchExecuted = false;
    return;
};

var updateLoadingCallback = () => {
    $("#id_loadprog").html(g_LoadingProgress);
}

function toggleOption(bDisp, opt1="block", opt2="none") {
    return (bDisp) ? opt1 : opt2;
}

function getPitch(p) {
    switch(p) {
        case 1: return '平';
        case 2: return '頭';
        case 3: return '中';
        case 4: return '尾高';
        default: return '';
    }
}

function loadFileChunked(finishCallback, updateCallback, pack = {chunkSize: 20, totalSize: 1, data: null}) {
    let i = 0;
    g_LoadEnabled = false;

    function chunkIt() {
        const final = Math.min(i + pack.chunkSize, pack.totalSize);
        for(; i < final; ++i) {
            let jlpt_level = null;
            let word_type = null;
            let word_note = null;
            let marked = false;
            let pitch_accent = 0;

            if('jlptlevel' in pack.data.words[i]) {
                jlpt_level = pack.data.words[i].jlptlevel;
            }
            if('type' in pack.data.words[i]) {
                word_type = pack.data.words[i].type;
            }
            if('pitch' in pack.data.words[i]) {
                pitch_accent = pack.data.words[i].pitch;
            }
            if('note' in pack.data.words[i]) {
                word_note = pack.data.words[i].note;
            }
            if('marked' in pack.data.words[i]) {
                marked = pack.data.words[i].marked;
            }

            let obj = new WordObject(
                g_JsonObjCounter, pack.data.words[i].word, pack.data.words[i].furigana, pack.data.words[i].romaji, pack.data.words[i].meaning, jlpt_level, word_type, word_note, marked, pitch_accent
            );
                    
            g_WordArray.push(obj);
            g_JsonObjCounter += 1; 
        }
        
        
        if(i < pack.totalSize) {
            setTimeout(chunkIt, 0);
            g_LoadingProgress = Math.floor((i/pack.data.words.length)*100);
            updateCallback();
        }
        else {
            finishCallback();
        }

    }
    chunkIt();
}

function Callback_EditorJSONLoad(fn, options = { discardable: true, update: true, singleFile: true, dropped: false }, pack = { chunkSize: 1, bFixed: true})
{
    if(!g_LoadEnabled) { return; }

    if(fn)
    {
        if(options.discardable) {
            g_JsonObjCounter = 0;
        }

        for(let i = 0; i < fn.length; ++i)
        {
            let file = new FileReader();
            file.onload = function() {
                const fcon = file.result;
                g_CurrentCode = new String(fcon);
                $("#id_textarea_json_code").html(g_CurrentCode);
                const data = JSON.parse(g_CurrentCode);
                
                if(options.discardable) { g_WordArray.splice(0, g_WordArray.length); }

                let chunkSizeDeter = 20;
                if(data.words <= 100) { chunkSizeDeter = 10; }
                else if(data.words.length > 100) { chunkSizeDeter = 30; }
                else if(data.words.length > 400) { chunkSizeDeter = 60; }
                else if(data.words.length > 700) { chunkSizeDeter = 90; }
                else if(data.words.length > 1100) { chunkSizeDeter = 110; }
                else { chunkSizeDeter = 200; }

                $("#id_loading_window").toggleClass("loading-window-anim");
                $("input[type=file].json_upload_old").prop("disabled", true);
                $(".json_upload_editor").toggleClass("json_upload_editor_disabled");
                
                loadFileChunked(
                    () => {
                        $("#id_loading_window").toggleClass("loading-window-anim");
                        $("input[type=file].json_upload_old").prop("disabled", false);
                        $(".json_upload_editor").toggleClass("json_upload_editor_disabled");
                        g_LoadEnabled = true;
                        updateTable();
                        updateCode();
                    }, 
                    updateLoadingCallback, 
                    {
                        chunkSize: ((pack.bFixed) ? ((pack.chunkSize > 0) ? pack.chunkSize : 1) : chunkSizeDeter),
                        totalSize: data.words.length,
                        data
                    }
                );

                g_LoadingProgress = 0;
            };
            file.readAsText(fn[i]);
            if(options.singleFile) break;
        }
    }
}

function Callback_JSONDropAction(files, options = { discardable: true, update: true, singleFile: true, dropped: false })
{
    if (files.length > 0) {
        Callback_EditorJSONLoad(files, options, { bFixed: false });
        $(".file_draggable").removeClass("animate_drag");
        g_DragActive = false;
    }
}

$("#id_upload_json_input").on("change", function() {
    let files = this.files;
    Callback_EditorJSONLoad(files, { discardable: true, update: true, singleFile: true, dropped: false }, { bFixed: false });
});

$("#id_append_json_input").on("change", function() {
    let files = this.files;
    Callback_EditorJSONLoad(files, { discardable: false, update: true, singleFile: false, dropped: false }, { bFixed: false });
});

$(".file_draggable").bind("dragover", (e) => {
    e.preventDefault();
    g_DragActive = true;
    if(g_DragActive) {
        if(g_LoadEnabled) {
            $(".file_draggable").addClass("animate_drag");
        }
    } 
});

$(".file_draggable").bind("dragleave", function (e) {
    e.preventDefault();
    g_DragActive = false;
    $(".file_draggable").removeClass("animate_drag");
});

$(window).bind("drop", (e) => { e.preventDefault();});
$(window).bind("dragover", (e) => { e.preventDefault(); });

$("#id_lload").bind("drop", (e) => {
    const files = e.originalEvent.dataTransfer.files;
    Callback_JSONDropAction(files, { discardable: true, update: true, singleFile: true, dropped: true });
    $(".file_draggable").removeClass("animate_drag");
    g_DragActive = false;
});

$("#id_list_em").bind("drop", (e) => {
    const files = e.originalEvent.dataTransfer.files;
    Callback_JSONDropAction(files, { discardable: false, update: true, singleFile: false, dropped: true });
    $(".file_draggable").removeClass("animate_drag");
    g_DragActive = false;
});

$("#id_lappend").bind("drop", (e) => {
    const files = e.originalEvent.dataTransfer.files;
    if (files.length > 0) {
        Callback_EditorJSONLoad(files, { discardable: false, update: true, singleFile: false, dropped: true });
    }
    $(".file_draggable").removeClass("animate_drag");
    g_DragActive = false;
});

function jsonObjectInline(word, furigana, romaji, meaning, jlpt_level = 0, word_type = null, word_note = null, is_marked = false, pitch = 0, bFirst = false, bLast = false)
{
    var finalStr = new String();
    if((g_WordArray.length+1) > 1)
    {
        if(!bFirst) { finalStr += (g_CompressionMethod > 2) ? ',' : ',\n'; }
    }

    switch(g_CompressionMethod)
    {
        case 1:
        {
            finalStr += `\t\t{\n\t\t\t"word": "${word.replace(/"/g, '\\"')}",\n`;
            finalStr += `\t\t\t"furigana": "${furigana.replace(/"/g, '\\"')}",\n`;
            finalStr += `\t\t\t"romaji": "${romaji.replace(/"/g, '\\"')}",\n`;
            finalStr += `\t\t\t"meaning": "${meaning.replace(/"/g, '\\"')}"`;
            if(jlpt_level > 0) { finalStr += `,\n\t\t\t"jlptlevel": ${jlpt_level}`; }
            if(word_type && word_type !== "Unspecified") { finalStr += `,\n\t\t\t\"type": "${word_type}"`; }
            if(pitch > 0) { finalStr += `,\n\t\t\t"pitch": ${pitch}`; }
            if(word_note) { finalStr += `,\n\t\t\t"note": "${word_note.replace(/"/g, '\\"')}"`; }
            if(is_marked) { finalStr += `,\n\t\t\t"marked": ${is_marked}`; }
            finalStr += "\n\t\t}";
            g_CompressJSON = false;
            break;
        }
        case 2:
        {
            finalStr += `\t\t{"word":"${word.replace(/"/g, '\\"')}",`;
            finalStr += `"furigana":"${furigana.replace(/"/g, '\\"')}",`;
            finalStr += `"romaji":"${romaji.replace(/"/g, '\\"')}",`;
            finalStr += `"meaning":"${meaning.replace(/"/g, '\\"')}"`;
            if(jlpt_level > 0) { finalStr += `,"jlptlevel":${jlpt_level}`; }
            if(word_type && word_type !== "Unspecified") { finalStr += `,"type":"${word_type}"`; }
            if(pitch > 0) { finalStr += `,"pitch":${pitch}`; }
            if(word_note) { finalStr += `,"note":"${word_note.replace(/"/g, '\\"')}"`; }
            if(is_marked) { finalStr += `,"marked":${is_marked}`; }
            finalStr += "}";
            g_CompressJSON = true;
            break;
        }
        case 3:
        {
            finalStr += `{"word":"${word.replace(/"/g, '\\"')}",`;
            finalStr += `"furigana":"${furigana.replace(/"/g, '\\"')}",`;
            finalStr += `"romaji":"${romaji.replace(/"/g, '\\"')}",`;
            finalStr += `"meaning":"${meaning.replace(/"/g, '\\"')}"`;
            if(jlpt_level > 0) { finalStr += `,"jlptlevel":${jlpt_level}`; }
            if(word_type && word_type !== "Unspecified") { finalStr += `,"type":"${word_type}"`; }
            if(pitch > 0) { finalStr += `,"pitch":${pitch}`; }
            if(word_note) { finalStr += `,"note":"${word_note.replace(/"/g, '\\"')}"`; }
            if(is_marked) { finalStr += `,"marked":${is_marked}`; }
            finalStr += "}";
            g_CompressJSON = true;
            break;
        }
        default:
        {
            console.error(`Invalid compression method ${g_CompressionMethod}!`);
        }
    }

    return finalStr;
}

function updateCode()
{
    if(g_CompressionMethod < 1 || g_CompressionMethod > 3) { g_CompressionMethod = 1; }
    
    if(g_CompressionMethod < 3)
    {
        jsonInitialInline = "{\n\t\"words\":\n\t[\n";
        jsonFinalInline = "\t]\n}";
    }
    else
    {
        jsonInitialInline = "{\"words\":[";
        jsonFinalInline = "]}";
    }

    let txtaText = $("#id_textarea_json_code");
    txtaText.html("");
    txtaText.html(txtaText.html() + jsonInitialInline);

    g_WordArray.forEach(elem => {
        let tempStr = jsonObjectInline(
            elem.word,
            elem.reading,
            elem.romaji,
            elem.meaning,
            elem.jlpt_level,
            elem.word_type,
            elem.note,
            elem.marked,
            elem.pitch,
            (elem.index == 0) ? true : false,
            (elem.index == (g_WordArray.length-1)) ? true : false
        );
        txtaText.html(txtaText.html() + tempStr);
    });

    txtaText.html(txtaText.html() + ((g_CompressionMethod < 3) ? "\n" : "") + jsonFinalInline);
}

function updateTable()
{
    let divopen_temp = "<div class=\"editor_list_item item_non_terminal nn\">";
    let divopen = "<div class=\"editor_list_item item_non_terminal nn\">";
    let divclose = "</div>";
    let list = $("#id_list_em");
    list.html("");

    for(let i = 0; i < g_JsonObjCounter; ++i)
    {
        if(g_WordArray[i].jlpt_level != null) {
            divopen = `<div class=\"editor_list_item item_non_terminal n${g_WordArray[i].jlpt_level}">`;
        } else {
            divopen = divopen_temp;
        }
        
        let embedhtml = divopen;
        embedhtml += `<div class="editor_list_item_cell actionbtn xitmbtn" style="width: 2%;" id="xbtnid_${i}" onclick="emitSelected(${i});">X</div>`;
        embedhtml += `<div class="editor_list_item_cell actionbtn edititmbtn" style="width: 2%;" id="editbtnid_${i}" onclick="editItem(${i});">...</div>`;
        embedhtml += `<div class="editor_list_item_cell" style="width: 2%;overflow: hidden;"><input class="cbxbtn" type="checkbox" id="cbxid_${i}" onclick="emitChecked(${i},$(this).is(':checked'));" ${((g_WordArray[i].checked) ? "checked" : "")}/></div>`;
        embedhtml += `<div class="editor_list_item_cell no-sel ${g_WordArray[i].marked ? "mod-important-cell" : "" }" ${ g_WordArray[i].marked ? "title=\"This word is marked.\"" : ""} style="width: 5%;"><span>${i+1}.</span></div>`;
        embedhtml += `<div class="editor_list_item_cell no-sel" style="width: 2%;overflow: hidden; font-size: 12px;">${getPitch(g_WordArray[i].pitch)}</div>`;
        embedhtml += `<div class="editor_list_item_cell"><h4 class="no-margin no-padding" title="${((!g_WordArray[i].jlpt_level) ? "Unspecified level" : "N" + g_WordArray[i].jlpt_level)} word">${g_WordArray[i].word}</h4></div>`;
        embedhtml += `<div class="editor_list_item_cell"><p class="no-margin no-padding">${g_WordArray[i].reading}</p></div>`;
        embedhtml += `<div class="editor_list_item_cell"><p class="no-margin no-padding">${g_WordArray[i].romaji}</p></div>`;
        embedhtml += `<div class="editor_list_item_cell"><p class="no-margin no-padding">${g_WordArray[i].meaning}</p></div>`;
        embedhtml += `<div class="editor_list_item_cell no-sel"><p class="no-margin no-padding color-gray"><i>${((g_WordArray[i].word_type != null) ? g_WordArray[i].word_type : "Unspecified")}</i></p></div>`;
        if(g_WordArray[i].note != null) {
            embedhtml += `<div class="editor_list_item_cell" style="padding: 0;"><button class="info_button" onmouseenter="displayInfo();" onmouseleave="hideInfo();" onmouseover="textInfo(this);" value="${g_WordArray[i].note}" disabled>note</button></div>`;
        }
        embedhtml += divclose;
        list.html(list.html() + embedhtml);
    }
}

function checkIfAnyChecked()
{
    for(let i = 0; i < g_WordArray.length; ++i) {
        if(g_WordArray[i].checked) {
            return true;
        }
    }
    return false;
}

function restartIDs()
{
    let xbtns = $("#id_list_em.xitmbtn");
    let editBtns = $("#id_list_em.edititmbtn");
    let cbxbtns = $("#id_list_em.cbxbtn");

    for(let i = 0; i < xbtns.length; ++i)
    {
        xbtns[i].id = `xbtnid_${i}`;
        editBtns[i].id = `editbtnid_${i}`;
        cbxbtns[i].id = `cbxid_${i}`;
    }
}

function textInfo(obj)
{
    $("#id_note_text").html(String($(obj).val()));
}

function deleteItem(index)
{
    g_WordArray.splice(index, 1);
    
    for(let i = 0; i < g_WordArray.length; ++i) {
        g_WordArray[i].index = i;
    }

    g_JsonObjCounter -= 1;
    restartIDs();
}

function emitSelected(index)
{
    deleteItem(index);
    updateTable();
    updateCheckStatus();
    $("#id_div_show_save_selection").css("display", toggleOption((g_IsAnyChecked), "flex", "none"));
}

function updateCheckStatus()
{
    g_IsAnyChecked = false;
    g_WordArray.forEach(elem => {
        if(elem.checked) { g_IsAnyChecked = true; }
    });
}

function emitChecked(index, bState)
{
    g_WordArray[index].checked = bState;
    g_IsAnyChecked = false;

    g_WordArray.forEach(elem => {
        if(elem.checked) { g_IsAnyChecked = true; }
    });

    $("#id_div_show_save_selection").css("display", toggleOption((g_IsAnyChecked), "flex", "none"));
    $("#id_clear_marks").css("display", toggleOption(g_IsAnyChecked, "flex", "none"));
}

function markTheWord()
{
    g_WordArray.forEach(elem => {
        if(elem.checked) {
            elem.marked = true;
        }
    });

    updateTable();
    updateCode();
}

function toggleSelMarks()
{
    g_WordArray.forEach(elem => {
        if(elem.checked) {
            elem.marked = !(elem.marked);
        }
    });
    updateTable();
}

function inverseSelection()
{
    g_WordArray.forEach(element => {
        element.checked = !(element.checked);
        $(`#cbxid_${element.index}`).prop("checked", toggleOption(element.checked, "checked", ""));
    });
}

function exportSelection()
{
    if(g_CompressionMethod < 1 || g_CompressionMethod > 3) { g_CompressionMethod = 1; }
    
    if(g_CompressionMethod < 3)
    {
        jsonInitialInline = "{\n\t\"words\":\n\t[\n";
        jsonFinalInline = "\t]\n}";
    }
    else
    {
        jsonInitialInline = "{\"words\":[";
        jsonFinalInline = "]}";
    }

    let finalCode = jsonInitialInline;

    g_WordArray.forEach(elem => {
        if(elem.checked) {
            finalCode += jsonObjectInline(
                elem.word,
                elem.reading,
                elem.romaji,
                elem.meaning,
                elem.jlpt_level,
                elem.word_type,
                elem.note,
                elem.marked,
                elem.pitch,
                (elem.index == 0) ? true : false,
                (elem.index == (g_WordArray.length-1)) ? true : false
            );
        }
    });

    finalCode += (((g_CompressionMethod < 3) ? "\n" : "") + jsonFinalInline);

    const text = finalCode;
    const blob = new Blob([text], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'kantanne_flashcard.json';
    link.click();
    URL.revokeObjectURL(link.href);
}

function pushWord(bEdited = false, index = 0, a = null, b = null, c = null, d = null, e = 0, f = null, g = null, h = false, i = 0)
{
    let word = $("#id_editor_field_word");
    let furigana = $("#id_editor_field_reading");
    let romaji = $("#id_editor_field_romaji");
    let meaning = $("#id_editor_field_meaning");
    let jlptlevel = $("#id_jlpt_level");
    let pitch_accent = $("#id_pitch_voice");
    let word_type = $("#id_word_type");
    let note_field = $("#id_note_field");

    if(!word.val().length || !meaning.val().length)
    {
        alert("Enter required values.");
        return;
    }

    let note_val = null;
    if(note_field.val().length > 0) {
        note_val = note_field.val();
    }

    if(bEdited)
    {
        if(!h) { h = g_WordArray[index].marked; }

        g_WordArray[index] = new WordObject(
            index+1,
            (a == null) ? word.val() : a,
            (b == null) ? furigana.val() : b,
            (c == null) ? romaji.val() : c,
            (d == null) ? meaning.val() : d,
            (e == 0) ? jlptlevel.val() : e,
            (f == null || f == "Unspecified") ? word_type.val() : f,
            (g == null) ? note_val : g,
            h,
            (i == 0) ? pitch_accent.val() : i
        );
    }
    else
    {
        for(let i = 0; i < g_WordArray.length; ++i)
        {
            if(g_WordArray[i].word === word.val() || g_WordArray[i].word === a)
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
                (a == null) ? word.val() : a,
                (b == null) ? furigana.val() : b,
                (c == null) ? romaji.val() : c,
                (d == null) ? meaning.val() : d,
                (e == 0) ? jlptlevel.val() : e,
                (f == null || f == "Unspecified") ? word_type.val() : f,
                (g == null) ? note_val : g,
                h,
                (i == 0) ? pitch_accent.val() : i
            )
        );
    }


    word.val(""); furigana.val(""); romaji.val(""); meaning.val(""); note_field.val("");
    updateTable();
}

function saveJson()
{
    updateCode();
    const text = $("#id_textarea_json_code").val();
    const blob = new Blob([text], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'kantanne_flashcard.json';
    link.click();
    URL.revokeObjectURL(link.href);
}

function toggleShowHideHTML()
{
    let showHide = $("#id_show_hide_html");
    let htmlBox = $("#id_html");

    if(htmlBox.css("display") === "block")
    {
        htmlBox.css("display", "none");
        showHide.html("show");
    }
    else
    {
        htmlBox.css("display", "block");
        showHide.html("hide");
    }
}

function displayInfo()
{
    $("#id_popup_info").css("display", "block");
    g_DisplayInfo = true;
}

function hideInfo()
{
    $("#id_popup_info").css("display", "none");
    g_DisplayInfo = false;
}

function updateStyleCode(obj = null)
{
    let txtarea = $("#id_txt_code");
    let wordVal = null;

    if(obj) {
        wordVal = obj.val();
    } else {
        wordVal = $("#id_editor_field_word").val();
    }

    let queryVal = $('input[type="radio"][name="highlight_color"]:checked');
    if(!queryVal) { return; }

    let h_val = queryVal.val();
    let h_val_added = "";

    for(let i = 0; i < 5; ++i)
    {
        let retrobj = $(`#id_cbx_style_${i}`);
        if(retrobj.is(":checked")) {
            h_val_added += ` ${retrobj.val()}`;
        }
    }

    h_val += h_val_added;

    let full_span = `<span class="${h_val}">${wordVal}</span>`;
    txtarea.val(full_span);
}

function applyStyles()
{
    let applyCode = $("#id_txt_code").val();
    $("#id_editor_field_word").val(applyCode);
}

function editItem(index)
{
    $("#id_editor_field_word").val(g_WordArray[index].word);
    $("#id_editor_field_reading").val(g_WordArray[index].reading);
    $("#id_editor_field_romaji").val(g_WordArray[index].romaji);
    $("#id_editor_field_meaning").val(g_WordArray[index].meaning);
    $("#id_jlpt_level").val((g_WordArray[index].jlpt_level) ? g_WordArray[index].jlpt_level : "0");
    $("#id_pitch_voice").val((g_WordArray[index].pitch_accent) ? g_WordArray[index].pitch_accent : "0");
    $("#id_word_type").val((g_WordArray[index].type) ? g_WordArray[index].type : "Unspecified");
    $("#id_note_field").val((g_WordArray[index].note) ? g_WordArray[index].note : "");
    $("#id_edit_button").css("display", "block");
    $("#id_add_button").css("display", "none");
    
    $("div.actionbtn")
        .addClass("disable_action_button")
        .css("pointerEvents", "none")
    ;

    $(".disable-control-mod").prop("disabled", true);
    $(".label-mod-controls").toggleClass("bg-gray");
    g_LoadEnabled = false;
    $("#id_edit_button").val(index);
}

function applyChanges(e)
{
    $("#id_edit_button").css("display", "none");
    $("#id_add_button").css("display", "block");

    let index = $(e).val();
    pushWord(true, index);

    $("div.actionbtn")
        .remove("disable_action_button")
        .css("pointerEvents", "auto")
    ;

    $(".disable-control-mod").prop("disabled", false);
    $(".label-mod-controls").toggleClass("bg-gray");
    g_LoadEnabled = true;
}

function uncheckAll()
{
    g_WordArray.forEach(element => {
        $(`#cbxid_${element.index}`).prop("checked", "");
        element.checked = false;
    });

    g_IsAnyChecked = false;

    $("#id_edit_button").css("display", "none");
    $("#id_add_button").css("display", "block");
    $("#id_div_show_save_selection").css("display", "none");
    $("#id_clear_marks").css("display", "none");
}

function addStyleEvent()
{
    displayWindow('id_popup_window_styles');
    $("#id_style_word").val($("#id_editor_field_word").val());
}

function clearAllMarks()
{
    g_WordArray.forEach(element => {
        element.marked = false;
    });
    updateTable();
}

$("#id_editor_field_word").bind("input", () => {
    if(!g_SearchExecuted.valueOf())
    {
        $("#id_word_found").css("display", "none");
        $("#id_word_search").css("display", "block");
        $("#id_word_search_div").removeClass("word_found_mod");

        setTimeout(
            () => {
                checkExistingWord();
            }, 1000
        );
        g_SearchExecuted = true;
    }
});

$("#id_search_field").bind("input", () => {
    if(!g_WordSearchExecuted.valueOf())
    {
        $("#id_search_message").css("display", "none");
        $("#id_search_loading_icon").css("display", "block");
        
        setTimeout(
            () => {
                searchExistingWord();
            }, 1000
        );

        g_WordSearchExecuted = true;
    }
});

$(document).bind("mousemove", (e) => {
    if(g_DisplayInfo)
    {
        const info_elem = $("#id_popup_info");
        info_elem.css("left", `${e.clientX+1}px`);
        info_elem.css("top", `${e.clientY+1}px`);
    }
});


$("#id_style_options").bind("change", (e) => {
    updateStyleCode($("#id_style_word"));
});