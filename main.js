"use strict";
document.getElementById("findButton").onclick = function() {
    const typedText = document.getElementById("input").value;
    
    const alphabetizedInput = alphabetize(typedText);

    function alphabetize(a) {
        return a.toLowerCase().split("").sort().join("").trim();
    }

    let anagrams = [];
    for (let word of words) {
        if (alphabetizedInput.length == word.length && alphabetizedInput == alphabetize(word)) {
            anagrams.push(word);
        }
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.textContent = "";
    const resultsString = anagrams.join(', ');
    const resultsTextNode = document.createTextNode(resultsString);
    resultsDiv.appendChild(document.createElement('p').appendChild(resultsTextNode));
}