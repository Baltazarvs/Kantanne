// Copyright (C) 2025 baltazarus

var terminal = new String;
var attributive = new String;
var hypothetical = new String;
var potential = new String;
var imperative = new String;
var irrealis = new String;
var tentative = new String;
var conjunctive = new String;
var euphonic = new String;

var bFormalActive = new Boolean(false);
var bForceCustom = new Boolean(false);
var bInputSubmit = new Boolean(false);
var bIrregular = new Boolean(false);

//var godan_verbs_iru_eru = [
//    // iru
//    "脂ぎる", "油ぎる", "びびる", "千切る", "散る", "どじる", "愚痴る", "入る", "走る", "穿る", "迸る",
//    "いびる", "弄る", "煎る", "炒る", "熬る", "入る", "要る", "炒る", "熬る", "炒る", "限る", "噛る", "切る", "軋る",
//    "轢る", "輾る", "抉じる", "参る", "混じる", "滅入る", "漲る", "毟る", "挘る", "詰る", "ねじる", "握る", "罵る", "陥る", "せびる",
//    "知る", "譏る", "誹る", "謗る", "滾る", "激る", "魂消る", "やじる", "攀じる",
//    // eru
//    "焦る", "ふける", "老ける", "伏せる", "減る",
//    "捻る", "火照る", "帰る", "陰る", "翔る", "蹴る", "くねる", "覆る", "舐める", "嘗める", "甞める", "練る", "煉る", "寝る", "のめる",
//    "滑る", "阿る", "阿ねる", "競る", "糶る", "挵る", "喋る", "茂る", "繁る", "滋る", "湿気る", "滑る", "猛る", "照る", "詰める", 
//    "抓る", "畝る", "蘇る"
//];

var godan_verbs_iru_eru = [
    // iru
    "あぶらぎる", "あぶらぎる", "びびる", "ちぎる", "ちる", "どじる", "ぐちる", "はいる", "はしる", "ほじる", "ほとばしる",
    "いびる", "いじる", "いる", "いる", "いる", "はいる", "いる", "いる", "いる", "いる", "かぎる", "かじる", "きる", "きしる",
    "ひきる", "てんじる", "こじる", "まいる", "まじる", "めいる", "みなぎる", "むしる", "こじる", "なじる", "ねじる", "にぎる", "ののしる", "おちいる", "せびる",
    "しる", "そしる", "そしる", "そしる", "たぎる", "たぎる", "たまぎる", "やじる", "よじる",
    // eru
    "あせる", "ふける", "ふける", "ふせる", "へる",
    "ひねる", "ほてる", "かえる", "かげる", "かける", "ける", "くねる", "くつがえる", "なめる", "なめる", "なめる", "ねる", "ねる", "ねる", "のめる",
    "すべる", "おもねる", "おもねる", "せる", "せる", "こねる", "しゃべる", "しげる", "しげる", "しげる", "しける", "すべる", "たける", "てる", "つめる",
    "つねる", "うねる", "よみがえる"
];



function set_base_entry(entry, point_id)
{
    let point = "id_base_";
    point += entry;
    
    let elem = document.getElementById(point);
    if(elem == null)
    {
        alert("Invalid base entry. " + point);
        return;
    }
    elem.innerHTML = point_id;
    return point_id;
}

function conjugate_kuru(formal = false)
{
    terminal = set_base_entry("terminal", "来る");
    attributive = set_base_entry("attributive", "来る");
    hypothetical = set_base_entry("hypothetical", "-");
    potential = set_base_entry("potential", "こ");
    imperative = set_base_entry("imperative", "こ");
    irrealis = set_base_entry("irrealis", "こ");
    tentative = set_base_entry("tentative", "こ");
    conjunctive = set_base_entry("conjunctive", "き");
    euphonic = set_base_entry("euphonic", "き");

    let ta_particle = span_it("た");
    let te_particle = span_it("て");
    
    let presumptive_particle = span_it((formal ? "ましょう" : "よう"));

    let negative_verb = span_it("ない");
    let positive_verb_suffix = span_it("る");
    let formal_darou = span_it("だろう");

    let saseru = "させる";
    let sareru = "される";
    let sasenai = "させない";
    let sarenai = "されない";

    if(formal)
    {
        negative_verb = span_it("ません");
        positive_verb_suffix = span_it("ます");
        formal_darou = span_it("でしょう");
        saseru = "させます";
        sareru = "されます";
        sasenai = "させません";
        sarenai = "されません";
    }

    saseru = span_it(saseru);
    sareru = span_it(sareru);
    sasenai = span_it(sasenai);
    sarenai = span_it(sarenai);

    let standard_pos = (formal ? conjunctive + positive_verb_suffix : terminal);
    let standard_neg = (formal ? conjunctive + negative_verb : "<ruby>来<rt>こ</rt></ruby>" + negative_verb);

    let perfective_pos = (formal ? conjunctive + span_it("ました") : "<ruby>来<rt>き</rt></ruby>" + ta_particle);
    let perfective_neg = (formal ? conjunctive +  span_it("ませんでした") : "<ruby>来<rt>こ</rt></ruby>" + span_it("なかった"));

    let presumptive_pos = (formal ? conjunctive + presumptive_particle : "<ruby>来<rt>こ</rt></ruby>" + presumptive_particle);
    let presumptive_neg = ("<ruby>来<rt>こ</rt></ruby>" + span_it("ない") + formal_darou);

    let imperative_pos = (formal ? "<ruby>来<rt>き</rt></ruby>" + te_particle + span_it("ください") : "<ruby>来<rt>こ</rt></ruby>い");
    let imperative_neg = (formal ? "<ruby>来<rt>こ</rt></ruby>" + span_it("ないで") + span_it("ください") : "<ruby>来<rt>く</rt></ruby>る" + span_it(" な"));

    set_conj_values(
        standard_pos, standard_neg,
        perfective_pos, perfective_neg,
        presumptive_pos, presumptive_neg,
        "<ruby>来<rt>き</rt></ruby>たら", "<ruby>来<rt>こ</rt></ruby>なかったら",
        "<ruby>来<rt>こ</rt></ruby>られる", "<ruby>来<rt>こ</rt></ruby>られない",
        "<ruby>来<rt>こ</rt></ruby>させる", "<ruby>来<rt>こ</rt></ruby>させない",
        "<ruby>来<rt>こ</rt></ruby>られる", "<ruby>来<rt>こ</rt></ruby>られない",
        imperative_pos, imperative_neg,
        "<ruby>来<rt>き</rt></ruby>" + te_particle, "Irregular Verb", true
    );
}

function conjugate_suru(formal = false)
{
    terminal = set_base_entry("terminal", "する");
    attributive = set_base_entry("attributive", "する");
    hypothetical = set_base_entry("hypothetical", "すれ");
    potential = set_base_entry("potential", "できる");
    imperative = set_base_entry("imperative", "しろ");
    irrealis = set_base_entry("irrealis", "し");
    tentative = set_base_entry("tentative", "し");
    conjunctive = set_base_entry("conjunctive", "し");
    euphonic = set_base_entry("euphonic", "し");

    let ta_particle = span_it("た");
    let te_particle = span_it("て");
    
    let presumptive_particle = span_it((formal ? "ましょう" : "よう"));

    let negative_verb = span_it("ない");
    let positive_verb_suffix = span_it("る");
    let formal_darou = span_it("だろう");

    let saseru = "させる";
    let sareru = "される";
    let sasenai = "させない";
    let sarenai = "されない";

    if(formal)
    {
        negative_verb = span_it("ません");
        positive_verb_suffix = span_it("ます");
        formal_darou = span_it("でしょう");
        saseru = "させます";
        sareru = "されます";
        sasenai = "させません";
        sarenai = "されません";
    }

    let standard_pos = (formal ? conjunctive + positive_verb_suffix : terminal);
    let standard_neg = (formal ? conjunctive + negative_verb : irrealis + negative_verb);

    let perfective_pos = (formal ? conjunctive + span_it("ました") : euphonic + ta_particle);
    let perfective_neg = (formal ? conjunctive +  span_it("ませんでした") : irrealis + span_it("なかった"));

    let presumptive_pos = (formal ? conjunctive + presumptive_particle : tentative + presumptive_particle);
    let presumptive_neg = (irrealis + span_it("ない") + formal_darou);

    let imperative_pos = (formal ? euphonic + te_particle + span_it("ください") : imperative);
    let imperative_neg = (formal ? irrealis + span_it("ないで") + span_it("ください") : terminal + span_it(" な"));

    set_conj_values(
        standard_pos, standard_neg,
        perfective_pos, perfective_neg,
        presumptive_pos, presumptive_neg,
        hypothetical + span_it("ば"), irrealis + span_it("なければ"),
        `<span class=\"h-darkblue c-white\" title=\"'be able to do = can'\">${potential}</span>`, "<span class=\"h-darkblue c-white\" title=\"'be able to do = can'\">できない</span>",
        saseru, sasenai,
        sareru, sarenai,
        imperative_pos, imperative_neg,
        euphonic + te_particle, "Irregular Verb"
    );
} 

function conjugate_ichidan(verb, formal)
{
    terminal = set_base_entry("terminal", verb);
    attributive = set_base_entry("attributive", verb);
    hypothetical = set_base_entry("hypothetical", replace_slb(verb, "れ"));
    potential = set_base_entry("potential", replace_slb(verb, "れ"));
    imperative = set_base_entry("imperative", replace_slb(verb, "ろ"));
    irrealis = set_base_entry("irrealis", replace_slb(verb, ""));
    tentative = set_base_entry("tentative", replace_slb(verb, ""));
    conjunctive = set_base_entry("conjunctive", replace_slb(verb, ""));
    euphonic = set_base_entry("euphonic", replace_slb(verb, ""));

    let ta_particle = span_it("た");
    let te_particle = span_it("て");
    
    let presumptive_particle = span_it((formal ? "ましょう" : "よう"));

    let negative_verb = span_it("ない");
    let positive_verb_suffix = span_it("る");
    let formal_darou = span_it("だろう");

    let saseru = "させる";
    let sareru = "される";
    let sasenai = "させない";
    let sarenai = "されない";

    if(formal)
    {
        negative_verb = span_it("ません");
        positive_verb_suffix = span_it("ます");
        formal_darou = span_it("でしょう");
        saseru = "させます";
        sareru = "されます";
        sasenai = "させません";
        sarenai = "されません";
    }

    saseru = span_it(saseru);
    sareru = span_it(sareru);
    sasenai = span_it(sasenai);
    sarenai = span_it(sarenai);

    let standard_pos = (formal ? conjunctive + positive_verb_suffix : terminal);
    let standard_neg = (formal ? conjunctive + negative_verb : irrealis + negative_verb);

    let perfective_pos = (formal ? conjunctive + span_it("ました") : euphonic + ta_particle);
    let perfective_neg = (formal ? conjunctive +  span_it("ませんでした") : irrealis + span_it("なかった"));

    let presumptive_pos = (formal ? conjunctive + presumptive_particle : tentative + presumptive_particle);
    let presumptive_neg = (irrealis + span_it("ない") + formal_darou);

    let imperative_pos = (formal ? euphonic + te_particle + span_it("ください") : imperative);
    let imperative_neg = (formal ? irrealis + span_it("ないで") + span_it("ください") : terminal + span_it(" な"));

    set_conj_values(
        standard_pos, standard_neg,
        perfective_pos, perfective_neg,
        presumptive_pos, presumptive_neg,
        hypothetical + span_it("ば"), irrealis + span_it("なければ"),
        potential + positive_verb_suffix, potential + negative_verb,
        irrealis + saseru, irrealis + sasenai,
        irrealis + sareru, irrealis + sarenai,
        imperative_pos, imperative_neg,
        euphonic + te_particle, "Ichidan 一段"
    );
}

function span_it_styled(word, style)
{
    let strval = new String(style);
    let str = "<span class='inflection_highlight_custom' style='" + strval + "'>" + word + "</span>";
    return str;
}

function conjugate_godan(verb, formal)
{
    set_base_entry("terminal", verb);
    set_base_entry("attributive", verb);

    let suffix = verb[verb.length-1];
    
    
    // Conjugate for euphonic base...
    let eutog = euphonic_toggle(suffix);

    if(!eutog.valid)
    {
        alert("Invalid Suffix.");
        return;
    }

    terminal = set_base_entry("terminal", verb);
    attributive = set_base_entry("attributive", verb);
    hypothetical = set_base_entry("hypothetical", replace_slb(verb, alter_suffix_e(suffix)));
    potential = set_base_entry("potential", replace_slb(verb, alter_suffix_e(suffix)));
    imperative = set_base_entry("imperative", replace_slb(verb, alter_suffix_e(suffix)));
    irrealis = set_base_entry("irrealis", replace_slb(verb, alter_suffix_a(suffix)));
    tentative = set_base_entry("tentative", replace_slb(verb, alter_suffix_o(suffix)));
    conjunctive = set_base_entry("conjunctive", replace_slb(verb, alter_suffix_i(suffix)));
    euphonic = set_base_entry("euphonic", replace_slb(verb, span_it_styled(eutog.suffix_ret, "color: green;")));

    let ta_particle = span_it((eutog.dakuten ? "だ" : "た"));
    let te_particle = span_it((eutog.dakuten ? "で" : "て"));
    
    let presumptive_particle = span_it((formal ? "ましょう" : "う"));

    let negative_verb = span_it("ない");
    let positive_verb_suffix = span_it("る");
    let formal_darou = span_it("だろう");

    let seru = "せる";
    let reru = "れる";
    let senai = "せない";
    let renai = "れない";

    if(formal)
    {
        negative_verb = span_it("ません");
        positive_verb_suffix = span_it("ます");
        formal_darou = span_it("でしょう");
        seru = "せます";
        reru = "れます";
        senai = "せません";
        renai = "れません";
    }

    seru = span_it(seru);
    reru = span_it(reru);
    senai = span_it(senai);
    renai = span_it(renai);

    let saseru = span_it("さ") + seru;
    let rareru = span_it("ら") + reru;
        
    let standard_pos = (formal ? conjunctive + positive_verb_suffix : terminal);
    let standard_neg = (formal ? conjunctive + negative_verb : irrealis + negative_verb);

    let perfective_pos = (formal ? conjunctive + span_it("ました") : euphonic + ta_particle);
    let perfective_neg = (formal ? conjunctive +  span_it("ませんでした") : irrealis + span_it("なかった"));

    let presumptive_pos = (formal ? conjunctive + presumptive_particle : tentative + presumptive_particle);
    let presumptive_neg = (irrealis + span_it("ない") + formal_darou);

    let imperative_pos = (formal ? euphonic + te_particle + span_it("ください") : imperative);
    let imperative_neg = (formal ? irrealis + span_it("ないで") + span_it("ください") : terminal + span_it(" な"));
    
    set_conj_values(
        standard_pos, standard_neg,
        perfective_pos, perfective_neg,
        presumptive_pos, presumptive_neg,
        hypothetical + span_it("ば"), irrealis + span_it("なければ"),
        potential + positive_verb_suffix, potential + negative_verb,
        irrealis + seru, irrealis + senai,
        irrealis + reru, irrealis + renai,
        imperative_pos, imperative_neg,
        euphonic + te_particle, "Godan 五段"
    );
}

function replace_slb(verb, suffix)
{
    let index = (verb.length-1);
    let result = verb.slice(0, -1) + suffix;
    return result;
}

function inline_romaji(result)
{
    return result + "<br>" + wanakana.toRomaji(result);
}

function alter_suffix_a(suffix)
{
    switch(suffix)
    {
        case "う": return "わ";
        case "く": return "か";
        case "ぐ": return "が";
        case "す": return "さ"; 
        case "つ": return "た";
        case "ぬ": return "な";
        case "む": return "ま";
        case "ぶ": return "ば";
        case "る": return "ら";
    }
}

function alter_suffix_i(suffix)
{
    switch(suffix)
    {
        case "う": return "い";
        case "く": return "き";
        case "ぐ": return "ぎ";
        case "す": return "し"; 
        case "つ": return "ち";
        case "ぬ": return "に";
        case "む": return "み";
        case "ぶ": return "び";
        case "る": return "り";
    }
}

function alter_suffix_e(suffix)
{
    switch(suffix)
    {
        case "う": return "え";
        case "く": return "け";
        case "ぐ": return "げ";
        case "す": return "せ"; 
        case "つ": return "て";
        case "ぬ": return "ね";
        case "む": return "め";
        case "ぶ": return "べ";
        case "る": return "れ";
    }
}

function alter_suffix_o(suffix)
{
    switch(suffix)
    {
        case "う": return "お";
        case "く": return "ご";
        case "ぐ": return "ご";
        case "す": return "そ"; 
        case "つ": return "と";
        case "ぬ": return "の";
        case "む": return "も";
        case "ぶ": return "ぼ";
        case "る": return "ろ";
    }
}
function euphonic_toggle(suffix)
{
    switch(suffix)
    {
        case "う": return { valid: true, dakuten: false, suffix_ret: "っ"} ;
        case "く": return { valid: true, dakuten: false, suffix_ret: "い"} ;
        case "ぐ": return { valid: true, dakuten: true, suffix_ret: "い"} ; 
        case "す": return { valid: true, dakuten: false, suffix_ret: "し"} ; 
        case "つ": return { valid: true, dakuten: false, suffix_ret: "っ"} ;
        case "ぬ": return { valid: true, dakuten: true, suffix_ret: "ん"} ;
        case "む": return { valid: true, dakuten: true, suffix_ret: "ん"} ;
        case "ぶ": return { valid: true, dakuten: true, suffix_ret: "ん"} ;
        case "る": return { valid: true, dakuten: false, suffix_ret: "っ"} ;
        default: return { valid: false };
    }
}

function span_it(word)
{
    let str = "<span class='inflection_highlight'>" + word + "</span>";
    return str;
}

function set_conj_values(
    aa,ab,ac,ad,ae,af,ag,
    ba,bb,bc,bd,be,bf,bg,
    ca,cd,te,cat,
    bCustom = false
)
{
    if(bForceCustom)
        bCustom = true;

    document.getElementById("id_conj_standard_positive").innerHTML = bCustom ? aa : inline_romaji(aa);
    document.getElementById("id_conj_standard_negative").innerHTML = bCustom ? ab : inline_romaji(ab);
    
    document.getElementById("id_conj_perfective_positive").innerHTML = bCustom ? ac : inline_romaji(ac);
    document.getElementById("id_conj_perfective_negative").innerHTML = bCustom ? ad : inline_romaji(ad);
    
    document.getElementById("id_conj_presumptive_positive").innerHTML = bCustom ? ae : inline_romaji(ae);
    document.getElementById("id_conj_presumptive_negative").innerHTML = bCustom ? af : inline_romaji(af);
    
    document.getElementById("id_conj_conditional_positive").innerHTML = bCustom ? ag : inline_romaji(ag);
    document.getElementById("id_conj_conditional_negative").innerHTML = bCustom ? ba : inline_romaji(ba);
    
    document.getElementById("id_conj_potential_positive").innerHTML = bCustom ? bb : inline_romaji(bb);
    document.getElementById("id_conj_potential_negative").innerHTML = bCustom ? bc : inline_romaji(bc);
    
    document.getElementById("id_conj_causative_positive").innerHTML = bCustom ? bd : inline_romaji(bd);
    document.getElementById("id_conj_causative_negative").innerHTML = bCustom ? be : inline_romaji(be);

    document.getElementById("id_conj_passive_positive").innerHTML = bCustom ? bf : inline_romaji(bf);
    document.getElementById("id_conj_passive_negative").innerHTML = bCustom ? bg : inline_romaji(bg);

    document.getElementById("id_conj_imperative_positive").innerHTML = bCustom ? ca : inline_romaji(ca);
    document.getElementById("id_conj_imperative_negative").innerHTML = bCustom ? cd : inline_romaji(cd);

    document.getElementById("id_conj_te").innerHTML = bCustom ? te : inline_romaji(te);
    document.getElementById("id_conj_category").innerHTML = cat;
}

function hiraganaKanjiCheck(char)
{
    const code = char.charCodeAt(0);
    const isHiragana = code >= 0x3040 && code <= 0x309F;
    const isKanji = code >= 0x4E00 && code <= 0x9FBF;
    return !(isHiragana || isKanji);
}

function kanjiCheck(char)
{
    const code = char.charCodeAt(0);
    const isKanji = (code >= 0x4E00 && code <= 0x9FBF);
    return !isKanji;
}

function conjugate_verb(verb, formal = false)
{
    bFormalActive = formal;
    let strval = String(verb); 
    if(strval.length <= 1)
    {
        alert("Invalid verb. Use kanji and hiragana.");
        return;
    }
    else
    {
        for(let i = 0; i < strval.length; ++i)
        {
            if(!wanakana.isKanji(strval[i]) && !wanakana.isHiragana(strval[i]))
            {
                alert("Invalid verb specification.");
                return;
            }
            else
            {
                if(wanakana.isKanji(strval[i]))
                    bForceCustom = true;
            }
        }

        bInputSubmit = true;
        bIrregular = false;

        // Here conjugate irregular verbs...
        if(verb === "くる" || verb === "来る")
        {
            bIrregular = true;
            conjugate_kuru(bFormalActive);
        }
        
        if(verb === "する" || verb === "為る")
        {
            bIrregular = true;
            conjugate_suru(bFormalActive);
        }

        if(bIrregular)
        {
            if(bIrregular.valueOf()) { $("#id_irregular_sign").css("display", "contents"); }
            return;
        }

        $("#id_irregular_sign").css("display", "none");
        
        // Here conjugate other verb types...
        if(strval[strval.length-1] == "る")
        {
            let determining_vocal = strval[strval.length-2];
            for(let i = 0; i < godan_verbs_iru_eru.length; ++i)
            {
                if(strval !== godan_verbs_iru_eru[i])
                {
                    if(
                        (determining_vocal !== 'え') &&
                        (determining_vocal !== 'け') &&
                        (determining_vocal !== 'せ') &&
                        (determining_vocal !== 'て') &&
                        (determining_vocal !== 'ね') &&
                        (determining_vocal !== 'へ') &&
                        (determining_vocal !== 'め') &&
                        (determining_vocal !== 'れ') &&
                        (determining_vocal !== 'い') &&
                        (determining_vocal !== 'き') &&
                        (determining_vocal !== 'し') &&
                        (determining_vocal !== 'ち') &&
                        (determining_vocal !== 'に') &&
                        (determining_vocal !== 'ひ') &&
                        (determining_vocal !== 'み') &&
                        (determining_vocal !== 'り')
                    ) return;

                    conjugate_ichidan(verb, bFormalActive);
                    return;
                }
            }
        }
        conjugate_godan(verb, bFormalActive);
    }
}

var btn_normal = document.getElementById("id_tab_normal");
var btn_formal = document.getElementById("id_tab_formal");

document.getElementById("conj_text_button").addEventListener("click", function() {
    let verb = document.getElementById("conj_text_input").value;
    conjugate_verb(verb, bFormalActive); // bFormalActive is global in conjugator.js
});

function conj_normal()
{
    bFormalActive = false;
    let verb = document.getElementById("conj_text_input").value;
    btn_normal.classList.add("cls_conj_tab_active");
    btn_formal.classList.remove("cls_conj_tab_active");
    conjugate_verb(verb, false);
}

function conj_formal()
{
    bFormalActive = true;
    let verb = document.getElementById("conj_text_input").value;
    btn_formal.classList.add("cls_conj_tab_active");
    btn_normal.classList.remove("cls_conj_tab_active");
    conjugate_verb(verb, true);
}

window.addEventListener("load", function() {
    bFormalActive = false;
    //document.getElementById("id_tab_normal").disabled = true;
    //document.getElementById("id_tab_formal").disabled = true;
});

document.getElementById("conj_text_input").addEventListener("input", function() {
    let tab_normal = document.getElementById("id_tab_normal");
    let tab_formal = document.getElementById("id_tab_formal");
    let state = (this.value.length < 2);
    if(!bInputSubmit)
    {
        tab_normal.disabled = state;
        tab_formal.disabled = state;
    }
});

wanakana.bind(document.getElementById("conj_text_input"));