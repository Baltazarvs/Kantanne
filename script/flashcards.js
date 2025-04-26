function WordObjectFC(word, reading, romaji, meaning)
{
    this.word = word;
    this.reading = reading;
    this.romaji = romaji;
    this.meaning = meaning;
    this.bUsed = false;
}

var g_WordArray = new Array();
var g_Flipped = new Boolean(false);

var g_HideFurigana = new Boolean(false);
var g_CurrentIndex = 0;
var g_SwapWordMeaning = new Boolean(false);

var g_ShowAll = new Boolean(false);
var g_DisplayPN = new Boolean(false);

var g_ReuseCards = new Boolean(true);
var g_ReusedCounter = 0;

var file_input = document.getElementById("id_file_input");

file_input.addEventListener("change", function() {
    const fn = file_input.files[0];
    if(fn)
    {
        const file = new FileReader();
        file.onload = function() {
            const fcon = file.result;
            const data = JSON.parse(fcon);
            g_WordArray.splice(0, g_WordArray.length);
            for(let i = 0; i < data.words.length; ++i)
            {
                let obj = new WordObjectFC(
                    data.words[i].word, data.words[i].furigana, data.words[i].romaji, data.words[i].meaning
                );
                g_WordArray.push(obj);
            }
            newFlashcard();
            document.getElementById("id_start_again").style.display = "inline-block";
            startFC();
        };
        file.readAsText(fn);
    }
});

function startFC()
{
    document.getElementById("id_mp").style.display = "none";
    document.getElementById("id_fc").style.display = "flex";
    document.getElementById("id_controls_span").style.display = "block";
    
    if(g_DisplayPN)
    {
        document.getElementById("prev_next_id").style.display = "none";
    }
    else
    {
        document.getElementById("prev_next_id").style.display = "block"
    }
    
    newFlashcard();
}

function stopFC()
{
    g_ReusedCounter = 0;
    g_WordArray.forEach(element => {
        element.bUsed = false;
    });
    
    document.getElementById("id_mp").style.display = "flex";
    document.getElementById("id_fc").style.display = "none";   
    document.getElementById("id_controls_span").style.display = "none";
    document.getElementById("prev_next_id").style.display = "none";
}

function newFlashcard(index = -1)
{
    while(true)
    {
        let randIndex = (index == -1) ? Math.floor(Math.random() * g_WordArray.length) : index;
        let newObj = g_WordArray[randIndex];
        g_CurrentIndex = randIndex;

        if(newObj.bUsed)
        {
            randIndex = (index == -1) ? Math.floor(Math.random() * g_WordArray.length) : index;
            newObj = g_WordArray[randIndex];
            g_CurrentIndex = randIndex;
            if(g_ReusedCounter == g_WordArray.length)
            {
                stopFC();
                break;
            }
            continue;
        }
        else
        {
            if(!g_ReuseCards)
            {
                g_ReusedCounter += 1;
                newObj.bUsed = true;
            }

            document.getElementById("kanji_redirect").innerHTML = g_SwapWordMeaning ? newObj.word : newObj.reading;
            document.getElementById("fc_furigana").innerHTML = g_SwapWordMeaning ? newObj.reading : newObj.word;
            document.getElementById("fc_meaning").innerHTML = newObj.meaning;
            document.getElementById("id_flipped_meaning").innerHTML = newObj.meaning;
            break;
        }
    }
}

function flipFlashcard()
{
    if(!g_Flipped)
    {
        document.getElementById("id_fc").style.display = "flex";
        document.getElementById("id_fc_flipped").style.display = "none";
    }
    else
    {
        document.getElementById("id_fc").style.display = "none";
        document.getElementById("id_fc_flipped").style.display = "flex";
    }
    g_Flipped = !g_Flipped;
}

function toggleFurigana()
{
    document.getElementById("fc_furigana").style.display = !g_HideFurigana ? "block" : "none";
    g_HideFurigana = !g_HideFurigana;
}

function toggleAll()
{
    document.getElementById("fc_separator").style.display = g_ShowAll ? "block" : "none";
    document.getElementById("fc_meaning").style.display = g_ShowAll ? "block" : "none";
    document.getElementById("id_flip_button").disabled = g_ShowAll ? "disabled" : "";

    g_ShowAll = !g_ShowAll;
}

function togglePN()
{
    document.getElementById("prev_next_id").style.display = g_DisplayPN ? "block" : "none";
    g_DisplayPN = !g_DisplayPN;
}

function nextCard()
{
    if(g_CurrentIndex < g_WordArray.length-1)
    {
        newFlashcard(g_CurrentIndex+1);
    }
    else
    {
        g_CurrentIndex = 0;
        newFlashcard(0);
    }
}

function prevCard()
{
    if(g_CurrentIndex > 0)
    {
        newFlashcard(g_CurrentIndex-1);
    }
    else
    {
        g_CurrentIndex = g_WordArray.length-1;
        newFlashcard(g_CurrentIndex);
    }
}

function flagSwap()
{
    g_SwapWordMeaning = !g_SwapWordMeaning;
}