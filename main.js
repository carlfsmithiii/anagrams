"use strict";
document.getElementById("findButton").onclick = function() {
    clearAllResultDivs();
    pushToScreen("results", "Anagrams: ");
    const alphabetizedInput = getAlphabetizedInput();

    let anagrams = [];
    for (let word of words) {
        if (alphabetizedInput.length == word.length && alphabetizedInput == alphabetize(word)) {
            anagrams.push(word);
        }
    }

    pushToScreen("results", anagrams.join(', '));
}

document.getElementById("findTheMostMatched").onclick = function() {
    clearAllResultDivs();
    pushToScreen("frequentlyMatchedWords", "Anagram sets with at least 5 members: ");
    const threshold = 5;
    const alphabetizedDictionaryContents = alphabetizeDictionaryContents();

    for (let key in alphabetizedDictionaryContents) {
        let entry = alphabetizedDictionaryContents[key];
        if (entry.length >= threshold) {
            pushToScreen("frequentlyMatchedWords", entry.join(', '));
        }
    }
};

document.getElementById("twoWordAnagramButton").onclick = function() {
    clearAllResultDivs();
    pushToScreen("twoWordResults", "2-word anagrams formed from input: ");
    const alphabetizedInput = getAlphabetizedInput();
    const pairsList = generateAnagramKeyPairs(alphabetizedInput);
    const anagramKeys = alphabetizeDictionaryContents();
    for (let [shortPart, longPart] of pairsList) {
        let workingString = "";
        workingString += anagramKeys[shortPart].join(',');
        workingString += " + ";
        workingString += anagramKeys[longPart].join(',');
        pushToScreen("twoWordResults", workingString);
    }
}

function generateAnagramKeyPairs(source) {
    const alphabetizedDictionaryContents = alphabetizeDictionaryContents();

    const possiblePairs = partitionInput(source, 2);
    let results = possiblePairs.filter(([shortPart, longPart]) => shortPart in alphabetizedDictionaryContents && longPart in alphabetizedDictionaryContents);
    return results;
}

function partitionInput(source, partitions = 2) {
    let listOfComplements = [];
    const longestLengthOfShortedPart = Math.floor(source.length / partitions);
    for (let i = 1; i <= longestLengthOfShortedPart; i++) {
        let newAdditions = partitionWithFixedShortestLength(source, i, partitions);
        for (let element of newAdditions) {
            listOfComplements.push(element);
        }
    }
    return listOfComplements;
}

function partitionWithFixedShortestLength(source, shortestLength, partitionCount) {
    let listOfComplements = [];

    let complementGenerator = function(progress, remainingOptions, spotsNeeded) {
        for (let  i = 0; i <= remainingOptions.length - spotsNeeded; i++) {
            
            if (spotsNeeded == 0) {
                if (!matchFoundInArray(listOfComplements, progress)) {
                    listOfComplements.push([progress, getComplement(source, progress)]);
                }
                break;
            } else {
                let workingString = progress + remainingOptions[i];
                let reducedRemainingOptions = remainingOptions.slice(i + 1);
                complementGenerator(workingString, reducedRemainingOptions, spotsNeeded - 1);
            }
        }
    }

    complementGenerator("", source, shortestLength, partitionCount);
    return listOfComplements;
}

function matchFoundInArray(array, string) {
    for (let [shortPart, longPart] of array) {
        if (shortPart == string) {
            return true;
        }
    }
    return false;
}

function removeCharacterFromString(theString, theCharacter) {
    const index = theString.indexOf(theCharacter);
    return theString.slice(0, index) + theString.slice(index + 1);
}

function alphabetizeDictionaryContents() {
    const alphabetizedDictionaryContents = {};
    for (let word of words) {
        const alphabetizedWord = alphabetize(word);
        if (alphabetizedDictionaryContents[alphabetizedWord] === undefined) {
            alphabetizedDictionaryContents[alphabetizedWord] = [word];
        } else {
            alphabetizedDictionaryContents[alphabetizedWord].push(word);
        }
    }
     
    return alphabetizedDictionaryContents;
}

function getComplement(fullString, memberString) {
    let complement = fullString;
    for (let character of memberString) {
        complement = removeCharacterFromString(complement, character);
    }
    return complement;
}

function alphabetize(a) {
    return a.toLowerCase().split("").sort().join("").trim();
}

function getAlphabetizedInput() {
    return alphabetize(document.getElementById("input").value);
}

function pushToScreen(divName, resultsString) {
    const resultsDiv = document.getElementById(divName);
    const resultsTextNode = document.createTextNode(resultsString);
    const resultsParagraph = document.createElement("p");
    resultsParagraph.appendChild(resultsTextNode);
    resultsDiv.appendChild(resultsParagraph);
}

function clearAllResultDivs() {
    const resultsDivsNodeList = document.getElementsByClassName("resultsDiv");
    for (let element of resultsDivsNodeList) {
        element.textContent = "";
    }
}