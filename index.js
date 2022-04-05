/* TODO: 
3. Will compare word lists for two middle words and their middle letters
4. Wil compare word lists for firt and last horizontal and veritcal words to ensure first and last letters are the same
5. Probalby loop to ask users which word they are trying to solve and present word choices at that time
    5.a But won't display word choices until at least some letters are known to be present or not present
6. Instead of word objects, can possibly use multidimensional arrays. console.table() can show whole grid of board
*/

const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
const inquirer = require('inquirer')
const CONSTANTS = require('./constants')
let { ENTER_GLOBAL_BAD, VIEW_ANSWERS, ENTER_LOCAL_KNOWN, ENTER_LOCAL_BAD, ENTER_KNOWN_WORD, CONTINUE, EXIT } = CONSTANTS

const readFileLines = filename =>
    fs.readFileSync(filename)
        .toString('UTF8')
        .toUpperCase()
        .split('\n');

let masterWordList = readFileLines('./fiveLetterWords.txt');

function Word(wordList, name) {
    this.name = name;
    this.wordList = wordList;
    this.badLetterSet = new Set();
    this.validLetterArray = [];
    this.fixedLetters = [0, 0, 0, 0, 0];
}

let v1 = new Word(masterWordList, 'v1')
let v2 = new Word(masterWordList, 'v2')
let v3 = new Word(masterWordList, 'v3')
let h1 = new Word(masterWordList, 'h1')
let h2 = new Word(masterWordList, 'h2')
let h3 = new Word(masterWordList, 'h3')

let varArray = [v1, v2, v3, h1, h2, h3]

let verticalMatrix = [v1.fixedLetters, v2.fixedLetters, v3.fixedLetters];
let horizontalMatrix = [h1.fixedLetters, h2.fixedLetters, h3.fixedLetters]

// let intersectionMap = new Map(
//     [
//         [v1.fixedLetters[0], h1.fixedLetters[0]],
//         [v1.fixedLetters[2], h2.fixedLetters[0]],
//         [v1.fixedLetters[4], h3.fixedLetters[0]],
//         [v2.fixedLetters[0], h1.fixedLetters[2]],
//         [v2.fixedLetters[2], h2.fixedLetters[2]],
//         [v2.fixedLetters[4], h3.fixedLetters[2]],
//         [v3.fixedLetters[0], h1.fixedLetters[4]],
//         [v3.fixedLetters[2], h2.fixedLetters[4]],
//         [v3.fixedLetters[4], h3.fixedLetters[4]],

//         [h1.fixedLetters[0], v1.fixedLetters[0]],
//         [h2.fixedLetters[0], v1.fixedLetters[2]],
//         [h3.fixedLetters[0], v1.fixedLetters[4]],
//         [h1.fixedLetters[2], v2.fixedLetters[0]],
//         [h2.fixedLetters[2], v2.fixedLetters[2]],
//         [h3.fixedLetters[2], v2.fixedLetters[4]],
//         [h1.fixedLetters[4], v3.fixedLetters[0]],
//         [h2.fixedLetters[4], v3.fixedLetters[2]],
//         [h3.fixedLetters[4], v3.fixedLetters[4]],
//         ["pink", "blue"]
//     ]
// )

let masterMatrix = [
    ['','','','',''],
    ['',null,'',null,''],
    ['','','','',''],
    ['',null,'',null,''],
    ['','','','','']
]

v1.fixedLetters = masterMatrix[0]
v2.fixedLetters = masterMatrix[2]
v3.fixedLetters = masterMatrix[4]
h1.fixedLetters = [masterMatrix[0][0], masterMatrix[0][1], masterMatrix[0][2], masterMatrix[0][3], masterMatrix[0][4]]
h2.fixedLetters = [masterMatrix[2][0], masterMatrix[2][1], masterMatrix[2][2], masterMatrix[2][3], masterMatrix[2][4]]
h3.fixedLetters = [masterMatrix[4][0], masterMatrix[4][1], masterMatrix[4][2], masterMatrix[4][3], masterMatrix[4][4]]

function checkMaster() {
    if (masterMatrix){}
}

console.table(masterMatrix)

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
    console.log('Horizontal Matrix: ')
    console.table(horizontalMatrix)
    console.log('Vertical Matrix')
    console.table(verticalMatrix)
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

function placeKnownLetters(word) {
    for (let letter of word.validLetterArray) {
        let validLetterLocationPrompt = prompt(`If known, type the location(s) of the letter ${letter}, else leave blank `, 6)
            .toString()
            .split('')
        for (let entry of validLetterLocationPrompt) {
            let validLetterLocation = parseInt(entry) - 1
            if (validLetterLocation <= 4) {
                let updatedWordList = word.wordList.filter(word => word[validLetterLocation] === letter)
                // TODO: Do i really want to remove letters from the array once I know where they go? 
                // May be better off using a set for this and keeping the letters there
                //  IF ^^^^ Then need to 
                let validLetterArray = word.validLetterArray.filter(arrayLetter => arrayLetter != letter)
                // let fixedLetters = 
                word.fixedLetters.splice(validLetterLocation, 1, letter)
                // word.fixedLetters = fixedLetters
                word.wordList = updatedWordList
                word.validLetterArray = validLetterArray
            }
        }
    }
}

function enterKnownWord(word) {
    let knownWord = prompt('Type the known word: ')
    let updatedArray = Array.from(knownWord)
    word.fixedLetters = updatedArray
    word.wordList = updatedArray
}

function enterLocalNonLocation(word) {
    for (let letter of word.validLetterArray) {
        let validLetterNonLocationPrompt = prompt(`Type the location(s) where ${letter} does not belong, else leave blank `, 6)
            .toString()
            .split('')
        for (let entry of validLetterNonLocationPrompt) {
            let validLetterNonLocation = parseInt(entry) - 1
            if (validLetterNonLocation <= 4) {
                let updatedWordList = word.wordList.filter(word => word[validLetterNonLocation] != letter)
                word.wordList = updatedWordList
            }
        }
    }
}

function updateIntersectedValue(word, index) {
    if (index === 0 || index === 2 || index === 4) {
        console.log(intersectionMap.get(word.fixedLetters[index]))
        console.log(intersectionMap.get(v1.fixedLetters[0]))
        console.log(intersectionMap.get('pink'))
    }
}

function askWordActions() {
    inquirer.prompt([
        {
            name: "wordAction",
            type: "list",
            message: "What action would you like to take?",
            choices: [VIEW_ANSWERS, ENTER_LOCAL_KNOWN, ENTER_LOCAL_BAD, ENTER_GLOBAL_BAD],
            default: VIEW_ANSWERS,
        },
        {
            name: "whichWord",
            type: "list",
            message: "Which word would you like to interact with?",
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
                    placeKnownLetters(word)
                    enterLocalNonLocation(word)
                    viewAnswers(word)
                    break
                case ENTER_LOCAL_BAD:
                    enterLocalBadLetters(word)
                    break
                case ENTER_GLOBAL_BAD:
                    enterGlobalBadLetters()
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
