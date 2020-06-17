//Trivia
//https://opentdb.com/api_config.php
// La API Fetch proporciona una interfaz para recuperar recursos (incluso a través de la red). 
const categories = 'https://opentdb.com/api_category.php'
// fetch(`https://opentdb.com/api.php?amount=10&category=20&type=multiple&difficulty=easy`)//
//     .then(function(response) {
//         return response.json()
//     })
//     .then((jsonData) => {
       
//         console.log(jsonData.results)
        
//     })
//     .catch((err) => {
//         alert('Tuvimos un error')
//         console.error(err)
//     })

const users = [
    {
        name,
        score:0
    }
]

const triviaValues = []

let index = 0
function nextTriviaPage(){
    const arrSectionsGame = document.querySelectorAll('section')
    arrSectionsGame.forEach(sectionGame => {
        return sectionGame.style.display = 'none'
    })
    arrSectionsGame[index].style.display = 'block' 
    index++ 
}
nextTriviaPage()

function saveUsers(){
    const name = document.getElementById('input-name').value
    users[0].name=name
    nextTriviaPage()
}
function getUser(){
    return users[0]
}

function difficultyEasy(){
    difficulty(document.getElementById('btn-easy').value)
}
function difficultyMedium(){
    difficulty(document.getElementById('btn-medium').value)
}
function difficultyHard(){
    difficulty(document.getElementById('btn-hard').value)
}
function difficulty(level){
    triviaValues[1] = level
    nextTriviaPage()
}

function getCategories(){
    fetch(categories)
    .then(function(response) {
        return response.json()
    })
    .then((jsonData) => {
        printCategories(jsonData.trivia_categories)
        console.log(jsonData.trivia_categories)
    })
    .catch((err) => {
        console.error(err)
        
    })
}
function printCategories(categories) {
    const selectFilter = document.getElementById('select-filter')
    const html = categories.map((category) => {
        return `<option value="${category.id}">${category.name}</option>`
    })
    const htmlJoined = html.join("")
    selectFilter.innerHTML = htmlJoined
}

getCategories()

function filter(){
    const filterOptionCategory = document.getElementById('select-filter').value
    triviaValues[0] = filterOptionCategory
}

function questionsType(type){
    triviaValues[2] = type
    getQuestions( triviaValues[0],triviaValues[1],triviaValues[2])
    nextTriviaPage()
}
function typeMulti(){
    questionsType(document.getElementById('btn-multy').value)
}

function typeBoolean(){
    questionsType(document.getElementById('btn-boolean').value)
}

var jsonObject = []
function getQuestions(category,difficulty,type) {
    console.log('Inputs')
    console.log(category,difficulty,type)
    fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`)//
    .then(function(response) {
        return response.json()
    })
    .then((jsonData) => {
        console.log('desde el get')
        console.log(jsonData)
        jsonObject.push(jsonData.results)
        console.log(jsonData.results)
        initGame(jsonObject)
    })
    .catch((err) => {
        alert('Tuvimos un error')
        console.error(err)
    })
}

function initGame(jsonObject){
    console.log('Dentro de init')
    console.log(jsonObject[0][0])
    jsonObject[0][0].incorrect_answers.push(jsonObject[0][0].correct_answer)
    jsonObject[0][0].incorrect_answers = shuffle(jsonObject[0][0].incorrect_answers)
    
    printQuestion(jsonObject[0][0].question)
    printAnswers(jsonObject[0][0].incorrect_answers)
}

var j = 1
function nextQuestion(){
    if(j<10){
        jsonObject[0][j].incorrect_answers.push(jsonObject[0][j].correct_answer)
        jsonObject[0][j].incorrect_answers = shuffle(jsonObject[0][j].incorrect_answers)
        
        printQuestion(jsonObject[0][j].question)
        printAnswers(jsonObject[0][j].incorrect_answers)
    }  
    j++
}

function shuffle(array) {
    let currentIndex = array.length
    let temporalValue  = 0
    let randomIndex = 0

    while (0 !== currentIndex) {
  
      // Genera un número entre 0 y la longitud de mi array de manera casi aleatoría
      randomIndex =  Math.floor(Math.random() * currentIndex)
      //Decremento en 1 para acceder a la última posición de mi array
      currentIndex -= 1;
     
      // Guarda en uan variable temporal el último valor de mi array
      temporalValue = array[currentIndex]
      // En el espacio donde estaba el valor anteriormente guardado, se agrega el valor de ese mismo array pero el de una posición aleatoría
      array[currentIndex] = array[randomIndex]
      // Regresa el valor guardado en la posición que estaba el último valor salvado
      array[randomIndex] = temporalValue
    }
    return array;
}

function printQuestion(question){
    const questionSection = document.getElementById('question')
    console.log(questionSection)
    questionSection.innerHTML = question
}

function printAnswers(answers){
    let option =0
    console.log('Estas son ' +answers)
    const answersSection = document.getElementById('answers')
    console.log(answersSection)
    const html = answers.map(answer => {
        option += 1
        return `
                <button id="${option}" onclick="validateAnswer('${answer}')" class="btn btn-primary mt-5 col-sm-4 bt content-btn">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                ${answer}</button>
                `
    })
    console.log('This html')
    console.log(html)
    const htmlJoined = html.join("")
    answersSection.innerHTML = htmlJoined
}

var k=0
function validateAnswer(answer){
    console.log(answer)
    // nextQuestion()
    if(answer === jsonObject[0][k].correct_answer){
        
        users[0].score+=100
        console.log(users)
        nextQuestion()
    }else{
        console.log('Wrong')
        console.log(users)
        nextQuestion()
    }
    if(k==9){
      endGame()
    }
    k++
}

function endGame(){
    nextTriviaPage()
    let resumeSection = document.getElementById('resume')
    let html = users.map(user=>{
        return `<h2 class=" bg-black  col-sm-6 mt-4">${user.name}</h2>
                <h2 class=" bg-black col-sm-6 mt-4 ">${user.score}</h2>
                <button onclick="playAgain()" class="btn btn-outline-success  mt-4 col-sm-6">AGAIN</button>
                `
    })
    htmlJoined = html.join("")
    resumeSection.innerHTML = htmlJoined
}

function playAgain(){
    location.reload()
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Crear un juego de preguntas

// Instrucciones
// 1. Muestra al usuario las distintas categorias entre las cuáles puede elegir para las preguntas=>DONE
// 2. Le das al usuario la opción de elegir entre preguntas de opción múltiple o preguntas de verdadero o falso
// 3. Mostramos 10 preguntas junto con las respuestas posibles



// 3.1 El usuario selecciona las respuestas =>DONE
// 4. Le indicas al usuario cuántos aciertos tuvo y cuántos errores tuvo



// Fetch
// https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Utilizando_Fetch



// Ejercicios hacker rank
// https://www.hackerrank.com/challenges/diagonal-difference/problem
// https://www.hackerrank.com/challenges/camelcase/problem
// https://www.hackerrank.com/challenges/mini-max-sum/problem


// *Nota que puede ser útil para los ejercicos:
// podemos acceder a las letras de un string mediante su pocisión, como lo hacemos con los arrays, por ejemplo
// const name = 'erik' // definimos la variable name
// al hacer esto name[0] estaríamos accediendo a la letra e, que es la que se encuentra en la primer posición de mi string