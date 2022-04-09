// TODO: Need to find a way to compare remaining wordlists and include only words with intersecting letters at intersection points
// TODO: Once only one word remains in the list for a single word, autopopulate it into the mastermatrix
//          or at least make it pop up saying that's all that's left for a certain word


const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
const inquirer = require('inquirer')
const CONSTANTS = require('./constants')
let { ENTER_GLOBAL_BAD, VIEW_ANSWERS, ENTER_LOCAL_KNOWN, ENTER_LOCAL_BAD, ENTER_KNOWN_WORD, CONTINUE, EXIT } = CONSTANTS

const readFileLines = filename =>
    fs.readFileSync(filename)
        .toString('UTF8')
        .toUpperCase()
        // .split('\n');
        .split(' ')

// let masterWordList = readFileLines('./fiveLetterWords.txt');
let masterWordList = readFileLines('./squardleDict.txt');

function Word(wordList, name) {
    this.name = name;
    this.wordList = wordList;
    this.badLetterSet = new Set();
    // TODO turn the valid array into a set
    this.validLetterArray = [];
    this.fixedLetters = [null, null, null, null, null];
}

let v1 = new Word(masterWordList, 'v1')
let v2 = new Word(masterWordList, 'v2')
let v3 = new Word(masterWordList, 'v3')
let h1 = new Word(masterWordList, 'h1')
let h2 = new Word(masterWordList, 'h2')
let h3 = new Word(masterWordList, 'h3')

let varArray = [v1, v2, v3, h1, h2, h3]

function populateBadLetterSet(userInput) {
    let anyBadLetterSet = new Set()
    for (let letter of userInput) {
        badLetterSet.add(letter)
    }
    return anyBadLetterSet
}

function filterBadLetterWords(badLetters, word) {
    for (let letter of badLetters) {
        let filteredWordList = word.wordList.filter(a => !a.includes(letter))
        word.wordList = filteredWordList
    }
}

function viewAnswers(word) {
    console.log(word.wordList)
}

function enterLocalKnown(word) {
    let localKnownLetters = prompt(`Type all known letters of ${word.name}: `).toUpperCase()
    for (let letter of localKnownLetters) {
        word.validLetterArray.push(letter)
    }
    for (let letter of word.validLetterArray) {
        let filteredWordList = word.wordList.filter(a => a.includes(letter))
        word.wordList = filteredWordList
    }
}

function enterLocalBadLetters(word) {
    let localLettersToEliminate = prompt(`Type all letters not used in ${word.name}: `).toUpperCase()
    filterBadLetterWords(localLettersToEliminate, word)
}

function enterGlobalBadLetters() {
    let globalLettersToEliminate = prompt('Type all letters not used globally: ').toUpperCase()
    for (let word of varArray) {
        filterBadLetterWords(globalLettersToEliminate, word)
    }
}

function placeKnownLetters(word, masterMatrix) {
    for (let letter of word.validLetterArray) {
        let validLetterLocationPrompt = prompt(`If known, type the location(s) of the letter ${letter}, else leave blank `, 6)
            .toString()
            .split('')
        for (let entry of validLetterLocationPrompt) {
            let validLetterLocation = parseInt(entry) - 1
            if (validLetterLocation <= 4) {
                let { counterWord, counterIndexLocation } = returnIntersectedWordAndIndex(word, validLetterLocation)
                filterGoodWordLetters(word, validLetterLocation, letter)
                if (counterWord) {
                    filterGoodWordLetters(counterWord, counterIndexLocation, letter)
                }
            }
        }
    }
}

function filterGoodWordLetters(word, index, letter) {
    word.wordList = word.wordList.filter(word => word[index] === letter)
    word.validLetterArray = word.validLetterArray.filter(arrayLetter => arrayLetter != letter)
    // TODO: Do i really want to remove letters from the array once I know where they go? 
    // May be better off using a set for this and keeping the letters there
    //  IF ^^^^ Then need to 
    word.fixedLetters.splice(index, 1, letter)
}

function enterKnownWord(word) {
    let knownWord = prompt('Type the known word: ').toUpperCase()
    let updatedArray = Array.from(knownWord)
    word.fixedLetters = updatedArray
    word.wordList = [knownWord]
    updateIntersectedWordsFromKnownWord(word)
}

function updateIntersectedWordsFromKnownWord(word) {
    for (let [index, letter] of word.fixedLetters.entries()) {
        let {counterWord, counterIndexLocation} = returnIntersectedWordAndIndex(word, index)
        if (counterWord) {
            filterGoodWordLetters(counterWord, counterIndexLocation, letter)
        }
    }
}

function enterLocalNonLocation(word) {
    for (let letter of word.validLetterArray) {
        let validLetterNonLocationPrompt = prompt(`Type the location(s) where ${letter} does not belong, else leave blank `, 6)
            .toString()
            .split('')
        for (let entry of validLetterNonLocationPrompt) {
            let validLetterNonLocation = parseInt(entry) - 1
            if (validLetterNonLocation <= 4) {
                let { counterWord, counterIndexLocation } = returnIntersectedWordAndIndex(word, validLetterNonLocation)
                filterLocalNonLetters(word, validLetterNonLocation, letter)
                if (counterWord) {
                    filterLocalNonLetters(counterWord, counterIndexLocation, letter)
                }
            }
        }
    }
}

function filterLocalNonLetters(wordObj, index, letter) {
    wordObj.wordList = wordObj.wordList.filter(word => word[index] != letter)
}

function returnIntersectedWordAndIndex(word, indexLocation) {
    let counterWord = null;
    let counterIndexLocation = null;

    if (word.name === 'v1' && indexLocation === 0) {
        counterWord = h1;
        counterIndexLocation = 0;
    }
    if (word.name === 'v1' && indexLocation === 2) {
        counterWord = h2;
        counterIndexLocation = 0;
    }
    if (word.name === 'v1' && indexLocation === 4) {
        counterWord = h3;
        counterIndexLocation = 0;
    }


    if (word.name === 'v2' && indexLocation === 0) {
        counterWord = h1;
        counterIndexLocation = 2;
    }
    if (word.name === 'v2' && indexLocation === 2) {
        counterWord = h2;
        counterIndexLocation = 2;
    }
    if (word.name === 'v2' && indexLocation === 4) {
        counterWord = h3;
        counterIndexLocation = 2;
    }


    if (word.name === 'v3' && indexLocation === 0) {
        counterWord = h1;
        counterIndexLocation = 4;
    }
    if (word.name === 'v3' && indexLocation === 2) {
        counterWord = h2;
        counterIndexLocation = 4;
    }
    if (word.name === 'v3' && indexLocation === 4) {
        counterWord = h3;
        counterIndexLocation = 4;
    }





    if (word.name === 'h1' && indexLocation === 0) {
        counterWord = v1;
        counterIndexLocation = 0;
    }
    if (word.name === 'h1' && indexLocation === 2) {
        counterWord = v2;
        counterIndexLocation = 0;
    }
    if (word.name === 'h1' && indexLocation === 4) {
        counterWord = v3;
        counterIndexLocation = 0;
    }


    if (word.name === 'h2' && indexLocation === 0) {
        counterWord = v1;
        counterIndexLocation = 2;
    }
    if (word.name === 'h2' && indexLocation === 2) {
        counterWord = v2;
        counterIndexLocation = 2;
    }
    if (word.name === 'h2' && indexLocation === 4) {
        counterWord = v3;
        counterIndexLocation = 2;
    }


    if (word.name === 'h3' && indexLocation === 0) {
        counterWord = v1;
        counterIndexLocation = 4;
    }
    if (word.name === 'h3' && indexLocation === 2) {
        counterWord = v2;
        counterIndexLocation = 4;
    }
    if (word.name === 'h3' && indexLocation === 4) {
        counterWord = v3;
        counterIndexLocation = 4;
    }

    return { counterWord, counterIndexLocation }
}

function askWordActions() {
    let masterMatrix = [
        [v1.fixedLetters[0] || h1.fixedLetters[0], h1.fixedLetters[1], v2.fixedLetters[0] || h1.fixedLetters[2], h1.fixedLetters[3], v3.fixedLetters[0] || h1.fixedLetters[4]],
        [v1.fixedLetters[1], null, v2.fixedLetters[1], null, v3.fixedLetters[1]],
        [v1.fixedLetters[2] || h2.fixedLetters[0], h2.fixedLetters[1], v2.fixedLetters[2] || h2.fixedLetters[2], h2.fixedLetters[3], v3.fixedLetters[2] || h2.fixedLetters[4]],
        [v1.fixedLetters[3], null, v2.fixedLetters[3], null, v3.fixedLetters[3]],
        [v1.fixedLetters[4] || h3.fixedLetters[0], h3.fixedLetters[1], v2.fixedLetters[4] || h3.fixedLetters[2], h3.fixedLetters[3], v3.fixedLetters[4] || h3.fixedLetters[4]]
    ]

    console.table(masterMatrix)

    inquirer.prompt([
        {
            name: "wordAction",
            type: "list",
            message: "What action would you like to take?",
            choices: [VIEW_ANSWERS, ENTER_LOCAL_KNOWN, ENTER_LOCAL_BAD, ENTER_GLOBAL_BAD, ENTER_KNOWN_WORD],
            default: VIEW_ANSWERS,
        },
        {
            name: "whichWord",
            type: "list",
            message: "Which word would you like to interact with?",
            // TODO remove word choices once solved
            choices: ["v1", "v2", "v3", "h1", "h2", "h3"],
            default: "v1",
            when: answers => answers.wordAction != ENTER_GLOBAL_BAD
        }
    ])
        .then(answers => {
            let word;
            if (answers.whichWord) {
                word = varArray.filter(result => result.name === answers.whichWord)[0]
            }
            switch (answers.wordAction) {
                case VIEW_ANSWERS:
                    viewAnswers(word)
                    break
                case ENTER_LOCAL_KNOWN:
                    enterLocalKnown(word)
                    enterLocalNonLocation(word)
                    placeKnownLetters(word, masterMatrix)
                    // TODO maybe ask this before placing letters in known location
                    break
                case ENTER_LOCAL_BAD:
                    enterLocalBadLetters(word)
                    break
                case ENTER_GLOBAL_BAD:
                    enterGlobalBadLetters()
                    break
                case ENTER_KNOWN_WORD:
                    enterKnownWord(word)
                    break
                default:
                    askAboutExit()
            }
            askAboutExit()
        });
}

function askAboutExit() {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "What action would you like to take?",
        choices: [CONTINUE, EXIT],
        default: CONTINUE,
    }]).then(answers => {
        answers.action === CONTINUE ? askWordActions() : process.exit()
    })
}

askWordActions();
