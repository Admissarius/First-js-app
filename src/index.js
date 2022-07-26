import {Question} from './question.js'
import {createModal, isValid} from './utils.js'
import {getAuthForm, authWithEmailAndPasword} from './auth.js'
import './styles.css'

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event){
    event.preventDefault()

    if(isValid(input.value)){
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }
        submitBtn.disabled = true
        //Async request to server to save question
        Question.create(question).then( () => {
            input.value = ''
        input.className = ''
        submitBtn.disabled = false
        })

        console.log('question', question);
    }
}

function openModal() {
    createModal('Authorisation', getAuthForm())
    document.getElementById('auth-form')
    .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault()
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    authWithEmailAndPasword(email, password)
        .then(token => {
            return Question.fetch(token)
        })
}
