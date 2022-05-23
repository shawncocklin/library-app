// TODO: add authentication
// TODO: add user ID to new book creation
// TODO: rewrite delete book function to work with db
// TODO: refactor code
// TODO: page animations


import { supabase } from './supabase'
// DOM reference variables
const bookContainer = document.querySelector('#book-container')
const titleInput = document.querySelector('#title')
const authorInput = document.querySelector('#author')
const pageCountInput = document.querySelector('#page-count')
const submitBtn = document.querySelector('.btn-submit')
const validationText = document.querySelector('.validation-text')

// event listeners
document.addEventListener('DOMContentLoaded', displayBooks)
submitBtn.addEventListener('click', addBookToLibrary)
bookContainer.addEventListener('click', editBookCard)

// book template
function Book(title, author, pageCount) {
  this.title = title
  this.author = author
  this.pageCount = pageCount
  
}

// generate HTML for the displayed book cards
function generateBookCard(title, author, pageCount, index, date) {
  return `
    <div class="card flow book box-shadow" data-index="${index}" style="--spacer: 8px;">
      <div class="header">
        <p class="flex align-center" style="height: 40px; ">From the Library</p>
        <p class="text-left" style="height: 25px;">Title: ${title}</p>
        <p class="text-left" style="height: 25px;">Author: ${author}</p>
      </div>
      <div class="fs-200 content">
        <div class=" grid grid-modifier" style="--gap: 0;">
          <p class="top">Date:</p>
          <p class="top">Issued To:</p>
          <p class="top">Pages:</p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p>${date}</p>
          <p>User</p>
          <p>${pageCount}</p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p></p>
          <p></p>
          <p><button  class="btn delete-btn">×</button></p>
        </div>
      </div>
    </div>
  `
}

// get new book info from user input
function getBookFromUser() {
    const title = titleInput.value
    const author = authorInput.value
    const pageCount = pageCountInput.value
    return new Book(title, author, pageCount)
}

// add new book to the library array. will be hooked into database eventually
async function addBookToLibrary(e) {
  e.preventDefault()
  if(!validationText.classList.contains('hidden')) {
    validationText.classList.add('hidden')
  } 
  bookContainer.innerHTML = ''
  const newBook = getBookFromUser()
  if(newBook.title === '' || newBook.author === '') {
    validationText.classList.remove('hidden')

    displayBooks()
    return
  }
  const {data, error} = await supabase.from('books').insert([{
    title: newBook.title,
    author: newBook.author,
    pages: newBook.pageCount
  }])
 
  titleInput.value = ''
  authorInput.value = ''
  pageCountInput.value = ''

  displayBooks()

}

// display the book cards to the page
async function displayBooks() {
  const { data, error } = await supabase.from('books').select()
  data.forEach((book) => {

    // massage date object for better readability
    const rawDate = book.created_at
    const date = rawDate.slice(5, 10)

    // generate HTML for the book card
    const displayedBook = generateBookCard(book.title, book.author, book.pages, book.id, date)
    // create div to hold 
    const bookCard = document.createElement('div')
    
    bookCard.innerHTML = displayedBook
    bookContainer.appendChild(bookCard)
  })
}

// handles removing book card from page when delete button pressed
// will need to be rewritten to use db methods for removing table rows
async function editBookCard(e) {
  const target = e.target
  if(target.classList.contains('delete-btn')) {
    let bookToRemove = target.closest('.book')
    let bookIndex = bookToRemove.dataset.index
    const { data, error } = await supabase.from('books').delete().match({ id: bookIndex })
    // myLibrary.splice(bookIndex, 1)
    bookToRemove.remove()
  }
}




