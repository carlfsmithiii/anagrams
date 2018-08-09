"use strict";
document.getElementById("findButton").onclick = function() {
    const typedText = document.getElementById("input").value;
    
    const alphabetizedInput = alphabetize(typedText);

    let anagrams = [];
    for (let word of words) {
        if (alphabetizedInput.length == word.length && alphabetizedInput == alphabetize(word)) {
            anagrams.push(word);
        }
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.textContent = "";
    const frequentMatches = document.getElementById("frequentlyMatchedWords");
    frequentMatches.textContent = "";
    const resultsString = anagrams.join(', ');
    const resultsTextNode = document.createTextNode(resultsString);
    resultsDiv.appendChild(document.createElement('p').appendChild(resultsTextNode));
}

document.getElementById("findTheMostMatched").onclick = function() {
    const threshold = 5;
    const alphabetizedDictionaryContents = {};

    for (let word of words) {
        const alphabetizedWord = alphabetize(word);
        if (alphabetizedDictionaryContents[alphabetizedWord] === undefined) {
            alphabetizedDictionaryContents[alphabetizedWord] = [word];
        } else {
            alphabetizedDictionaryContents[alphabetizedWord].push(word);
        }
    }

    for (let key in alphabetizedDictionaryContents) {
        let entry = alphabetizedDictionaryContents[key];
        if (entry.length >= threshold) {
            pushToScreen(entry);
        }
    }

    function pushToScreen(entry) {
        const resultsDiv = document.getElementById("frequentlyMatchedWords");
        const resultsString = entry.join(', ');
        const resultsTextNode = document.createTextNode(resultsString);
        const resultsParagraph = document.createElement('p');
        resultsParagraph.appendChild(resultsTextNode);
        resultsDiv.appendChild(resultsParagraph);
    }

};



function alphabetize(a) {
    return a.toLowerCase().split("").sort().join("").trim();
}