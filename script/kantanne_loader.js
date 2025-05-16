function WordObject(index, word, reading, romaji, meaning, jlpt_level = null, word_type = null, note = null)
{
    this.index = index;
    this.word = word;
    this.reading = reading;
    this.romaji = romaji;
    this.meaning = meaning;
    this.jlpt_level = jlpt_level;
    this.word_type = word_type;
    this.note = note;
}

function kantanne_load(fn)
{
    var retobj = new Array();
    if(fn)
    {
        const file = new FileReader();
        file.onload = function() {
            const fcon = file.result;
            g_CurrentCode = new String(fcon);
            const data = JSON.parse(g_CurrentCode);
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

                let temp_obj = WordObject(
                    i,
                    data.words[i].word,
                    data.words[i].furigana,
                    data.words[i].romaji,
                    data.words[i].meaning,
                    jlpt_level,
                    word_type,
                    word_note
                );

                retobj.push(temp_obj);
            }
            console.log(retobj);
        };
        file.readAsText(fn);
        return retobj;
    }
    return null;
}