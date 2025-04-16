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

var bFormalActive = false;

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

function conjugate_kuru()
{
    terminal = set_base_entry("terminal", "来る");
    attributive = set_base_entry("attributive", "来る");
    hypothetical = set_base_entry("hypothetical", "来れば");
    potential = set_base_entry("potential", "来（こ）");
    imperative = set_base_entry("imperative", "来（こ）");
    irrealis = set_base_entry("irrealis", "来（こ）");
    tentative = set_base_entry("tentative", "来（こ）");
    conjunctive = set_base_entry("conjunctive", "来（き）");
    euphonic = set_base_entry("euphonic", "来（き）");
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
    euphonic = set_base_entry("euphonic", replace_slb(verb, eutog.suffix_ret));

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

    let imperative_pos = (formal ? euphonic + te_particle + span_it("下さい") : imperative);
    let imperative_neg = (formal ? irrealis + span_it("ないで") + span_it("下さい") : terminal + span_it(" な"));
    
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

function alter_suffix_a(suffix)
{
    switch(suffix)
    {
        case "う": return "わ";
        case "く": return "か";
        case "ぐ": return "が";
        case "す": return "さ"; 
        case "つ": return "た";
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
    ca,cd,te,cat
)
{
    document.getElementById("id_conj_standard_positive").innerHTML = aa;
    document.getElementById("id_conj_standard_negative").innerHTML = ab;
    
    document.getElementById("id_conj_perfective_positive").innerHTML = ac;
    document.getElementById("id_conj_perfective_negative").innerHTML = ad;
    
    document.getElementById("id_conj_presumptive_positive").innerHTML = ae;
    document.getElementById("id_conj_presumptive_negative").innerHTML = af;
    
    document.getElementById("id_conj_conditional_positive").innerHTML = ag;
    document.getElementById("id_conj_conditional_negative").innerHTML = ba;
    
    document.getElementById("id_conj_potential_positive").innerHTML = bb;
    document.getElementById("id_conj_potential_negative").innerHTML = bc;
    
    document.getElementById("id_conj_causative_positive").innerHTML = bd;
    document.getElementById("id_conj_causative_negative").innerHTML = be;

    document.getElementById("id_conj_passive_positive").innerHTML = bf;
    document.getElementById("id_conj_passive_negative").innerHTML = bg;

    document.getElementById("id_conj_imperative_positive").innerHTML = ca;
    document.getElementById("id_conj_imperative_negative").innerHTML = cd;

    document.getElementById("id_conj_te").innerHTML = te;
    document.getElementById("id_conj_category").innerHTML = cat;
}

function hiraganaKanjiCheck(char)
{
    const code = char.charCodeAt(0);
    const isHiragana = code >= 0x3040 && code <= 0x309F;
    const isKanji = code >= 0x4E00 && code <= 0x9FBF;
    return !(isHiragana || isKanji);
}

function conjugate_verb(verb, formal = false)
{
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
            if(hiraganaKanjiCheck(strval[i]))
            {
                alert("Invalid verb specification.");
                return;
            }
        }
        if(verb === "くる" || verb === "来る")
        {
            conjugate_kuru();
            return;
        }

        bFormalActive = formal;
        conjugate_godan(verb, bFormalActive);

        // Conjugate here.
    }
}