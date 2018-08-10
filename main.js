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

document.getElementById("five_or_more").onclick = function() {
    clearAllResultDivs();
    pushToScreen("frequentlyMatchedWords", "Anagram sets with at least 5 members: ");
    const threshold = 5;
    const alphabetizedDictionaryContents = alphabetizeDictionaryContents();

    let results = [];
    for (let key in alphabetizedDictionaryContents) {
        let entry = alphabetizedDictionaryContents[key];
        if (entry.length >= threshold) {
            pushToScreen("frequentlyMatchedWords", entry.join(', '));
        }
    }
};

document.getElementById("twoWordAnagramButton").onclick = function() {
    const alphabetizedInput = getAlphabetizedInput();
    const pairsList = generateAnagramKeyPairs(alphabetizedInput);

    publishAnagrams("twoWordResults", "2-word anagrams formed from input: ", pairsList);
}

document.getElementById("threeWordAnagramButton").onclick = function() {
    const alphabetizedInput = getAlphabetizedInput();
    const pairsList = generateAnagramKeyPairs(alphabetizedInput, 3);

    publishAnagrams("threeWordResults", "3-word anagrams formed from input: ", pairsList);
}

function generateAnagramKeyPairs(source, partitions = 2) {
    const alphabetizedDictionaryContents = alphabetizeDictionaryContents();
    const possiblePairs = partitionInput(source, partitions);

    let results = possiblePairs.filter((list) => {
        for (let element of list) {
            if (!(element in alphabetizedDictionaryContents)) {
                return false;
            }
        }
        return true;
    });   
    return results;
}


function areAnagramKeyMathces(possiblePairs) {
    const alphabetizedDictionaryContents = alphabetizeDictionaryContents();

    let [shortPart, longPart] = possiblePairs;
    if (shortPart in alphabetizedDictionaryContents) {
        if (typeof longPart === 'string') {
            return (longPart in alphabetizedDictionaryContents);
        } else {
            return areAnagramKeyMathces(longPart);
        }
    }
}

function partitionInput(source, partitions = 2) {
    let listOfComplements = [];
    const longestLengthOfShortPart = Math.floor(source.length / partitions);
    for (let i = 1; i <= longestLengthOfShortPart; i++) {
        let newAdditions = splitIntoComplementsWithFixedShortestLength(source, i);
        for (let [shortPart, longPart] of newAdditions) {
            if (partitions == 2) {
                listOfComplements.push([shortPart, longPart]);
            } else if (partitions == 3) {
                let innerComponents = partitionInput(longPart, partitions - 1);
                for (let [a,b] of innerComponents) {
                    listOfComplements.push([shortPart, a, b]);
                }
            }
        }
    }
    return listOfComplements;
}

function splitIntoComplementsWithFixedShortestLength(source, shortestLength) {
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

    complementGenerator("", source, shortestLength);
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

function publishAnagrams(divId, titleString, matchList) {
    clearAllResultDivs();
    pushToScreen(divId, titleString);
    const anagramKeys = alphabetizeDictionaryContents();
    
    for (let combination of matchList) {
        let workingArray = [];
        for (let item of combination) {
            workingArray.push(anagramKeys[item].join(','));
        }
        let workingString = workingArray.join(" + ");
        pushToScreen(divId, workingString);
    }
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