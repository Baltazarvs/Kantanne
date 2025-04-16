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
}

function conjugate_kuru()
{
    set_base_entry("terminal", "来る");
    set_base_entry("attributive", "来る");
    set_base_entry("hypothetical", "来れば");
    set_base_entry("potential", "来（こ）");
    set_base_entry("imperative", "来（こ）");
    set_base_entry("irrealis", "来（こ）");
    set_base_entry("tentative", "来（こ）");
    set_base_entry("conjunctive", "来（き）");
    set_base_entry("euphonic", "来（き）");
}

function conjugate_godan(verb)
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

    let index = (verb.length-1);
    let result = verb.slice(0, -1) + eutog.suffix_ret;

    set_base_entry("euphonic", result);
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

function conjugate_verb(verb)
{
    let strval = String(verb); 
    if(strval.length <= 1)
    {
        alert("Invalid verb. Use kanji and hiragana.");
        return;
    }
    else
    {
        if(verb === "くる" || verb === "来る")
        {
            conjugate_kuru();
            return;
        }

        conjugate_godan(verb);

        // Conjugate here.
    }
}