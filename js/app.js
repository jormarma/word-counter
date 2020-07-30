const alpha = new Set("0123456789" 
+ "abcçdefghijklmnñopqrstuvwxyz" 
+ "ABCÇDEFGHIJKLMNÑOPQRSTUVWXYZ" 
+ "èéëêàáäâíìïîòóöôùúüû" 
+ "ÈÉËÊÀÁÄÂÍÌÏÎÒÓÖÔÙÚÜÛ".split(""));
        
let updateStats = (e) => {
    let text =  e.target.value;
    let textSize = text.length;
    let currentLine = "";
    let currentWord = "";
    let linesCount = 0;
    let wordsCount = 0;
    let charsCount = 0;
    let lines = new Map();
    let words = new Map();
    let chars = new Map();

    for(let i = 0; i < textSize; i++) {
        let currentChar = text.charAt(i);

        // Deal with lines ----------------------------------------------
        if('\n' === currentChar) {
            linesCount++;
            let lCount = lines.get(currentLine);
            lines.set(currentLine, !lCount ? 1 : lCount + 1);
            currentLine = "";

        } else {
            currentLine += currentChar;
        }

        // Deal with words ----------------------------------------------
        let hasAlpha = alpha.has(currentChar);

        if(hasAlpha) {
            if(currentWord === "") {
                wordsCount++;
            }

            currentWord += currentChar;

        } else {
            if(currentWord !== "") {
                let wCount = words.get(currentWord);
                words.set(currentWord, !wCount ? 1 : wCount + 1);
                currentWord = "";
            }
        }

        // Deal with chars ------------------------------------------
        if(hasAlpha) {
            let cCount = chars.get(currentChar);
            chars.set(currentChar, !cCount ? 1 : cCount + 1);
            charsCount++;
        }
    }

    if(currentWord !== "") {
        let wCount = words.get(currentWord);
        words.set(currentWord, !wCount ? 1 : wCount + 1);
    }

    if(currentLine !== "") {
        linesCount++;
        let lCount = lines.get(currentLine);
        lines.set(currentLine, !lCount ? 1 : lCount + 1);
    }

    document.getElementById("numlines").innerHTML = zeroFill(linesCount);
    document.getElementById("numwords").innerHTML = zeroFill(wordsCount);
    document.getElementById("numchars").innerHTML = zeroFill(charsCount);
    document.getElementById("freqlines").innerHTML = zeroFill(lines.size);
    document.getElementById("freqwords").innerHTML = zeroFill(words.size);
    document.getElementById("freqchars").innerHTML = zeroFill(chars.size);

    updateFrequencyTable(lines, "lines-freq-table", "Lines");
    updateFrequencyTable(words, "words-freq-table", "Words");
    updateFrequencyTable(chars, "chars-freq-table", "Chars");
}

let updateFrequencyTable = (map, tableId, label) => {
    let orderedByFrequency = new Map(
        Array
            .from(map)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
    );

    let frequencyTable = document.getElementById(tableId);
    let tdataRows = document.querySelectorAll("#" + tableId + " .tdata");

    tdataRows.forEach((tdataRow) => frequencyTable.removeChild(tdataRow));
    // reset lft

    let buttons = document.querySelector("#" + tableId + " .tbuttons");

    let count = 1; 
    orderedByFrequency.forEach((value, key) => {
        frequencyTable.insertBefore(getRow("tdata", count, key, value), buttons);
        count++;
    });

    buttons.style.display = orderedByFrequency.size > 0 
        ? "flex"
        : "none";
}

let getRow = (rowClass, pos, textColValue, freqColValue) => {
    let row = document.createElement("div");
    row.setAttribute("class", rowClass);
    let posCol = document.createElement("div");
    posCol.innerText = "" + pos;
    let textCol = document.createElement("div");
    textCol.classList.add("truncate");
    textCol.setAttribute("title", textColValue);
    textCol.innerText = textColValue;
    let freqCol = document.createElement("div");
    freqCol.classList.add("text-digital");
    freqCol.innerText = freqColValue;
    row.appendChild(posCol);
    row.appendChild(textCol);
    row.appendChild(freqCol);
    return row;
}

/* TODO: improve */
let zeroFill = (num) => {
    if(num === 0) {
        return "000000<span>0</span>"
    } else if(num < 10) {
        return "000000<span>" + num + "</span>";
    } else if(num < 100) {
        return "00000<span>" + num + "</span>";
    } else if(num < 1000) {
        return "0000<span>" + num + "</span>";
    } else if(num < 10000) {
        return "000<span>" + num + "</span>";
    } else if(num < 100000) {
        return "00<span>" + num + "</span>";
    } else if(num < 1000000) {
        return "0<span>" + num + "</span>";
    } else {
        return "<span>" + num + "</span>";
    }
}

const forceChangeEventInTextarea = (elem) => {
    const text = elem || document.getElementById("text");
    if ("createEvent" in document) {
        // this needs explanation
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("input", false, true);
        text.dispatchEvent(evt);
        
    } else {
        // this needs explanation
        text.fireEvent("onchange");
    }
}

window.onload = function(){
    let textarea = document.getElementById("text");
    textarea.addEventListener('input', updateStats);

    let clearBtn = document.getElementById("clear");
    clearBtn.addEventListener('click', () => {
        let text = document.getElementById("text");
        text.value = "";
        
        forceChangeEventInTextarea(text);
    });

    function loadFile() {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function(evt) {
            const textarea = document.getElementById("text");
            textarea.value = evt.target.result;
            forceChangeEventInTextarea(textarea);
        };
        reader.readAsText(file);
    }
    const inputFile = document.getElementById("input-file");
    inputFile.addEventListener("change", loadFile, false);
}
