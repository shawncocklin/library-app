// TODO: leaderboard
// TODO: refactor code
// TODO: page animations

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(url, anonKey)
// DOM reference variables
const bookContainer = document.querySelector('#book-container')
const leaderboardContainer = document.querySelector('#leaderboard-container')
const titleInput = document.querySelector('#title')
const authorInput = document.querySelector('#author')
const readerInput = document.querySelector('#reader')
const pageCountInput = document.querySelector('#page-count')
const leaderBtn = document.querySelector('#leaderboard-btn')
const submitBtn = document.querySelector('.btn-submit')
const validationText = document.querySelector('.validation-text')

// initialize and generate HTML for the leaderboard component
leaderboardInit()

// event listeners
document.addEventListener('DOMContentLoaded', displayBooks)
submitBtn.addEventListener('click', addBookToLibrary)
leaderBtn.addEventListener('click', toggleLeaderboard)
bookContainer.addEventListener('click', editBookCard)

// book template
function Book(title, author, pageCount, reader) {
  this.title = title
  this.author = author
  this.pageCount = pageCount
  this.reader = reader
}

// generate HTML for the displayed book cards
function generateBookCard(title, author, pageCount, index, date, reader) {
  return `
    <div class="card flow book box-shadow" data-index="${index}" style="--spacer: 8px;">
      <div class="header">
        <p class="flex align-center" style="height: 40px; ">From the Library</p>
        <p class="text-left" style="min-height: 25px;" data-book="title">Title: ${title}</p>
        <p class="text-left" style="min-height: 25px;">Author: ${author}</p>
      </div>
      <div class="fs-200 content">
        <div class=" grid grid-modifier" style="--gap: 0;">
          <p class="top">Date:</p>
          <p class="top">Issued To:</p>
          <p class="top">Pages:</p>
        </div>
        <div class="grid grid-modifier" style="--gap: 0;">
          <p>${date}</p>
          <p data-book="reader">${reader}</p>
          <p data-book="pages">${pageCount}</p>
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

function generateLeaderboard() {
  return `
    <div class="leaderboard bg-primary flow hide">
      <p class="font-sans text-light fs-700 fw-semibold text-center">Leaderboard</p>
      <div class="flex justify-between">
        <p class="font-sans text-light fs-500">Name</p>
        <p class="font-sans text-light fs-500">Books</p>
        <p class="font-sans text-light fs-500">Pages</p>
      </div>
      <div class="stats flex justify-between">
        <p class="font-sans text-light fs-500">Shawn</p>
        <p class="font-sans text-light fs-500">2</p>
        <p class="font-sans text-light fs-500">600</p>
      </div>

    </div>
  `
}

// get new book info from user input
function getBookFromUser() {
  const title = titleInput.value
  const author = authorInput.value
  const pageCount = pageCountInput.value
  const reader = readerInput.value
  return new Book(title, author, pageCount, reader)
}

function leaderboardInit() {
  const leaderboard = generateLeaderboard()
  leaderboardContainer.innerHTML = leaderboard
}

function toggleLeaderboard(e) {
  e.preventDefault()
  const leaderboardElem = document.querySelector('.leaderboard')
  if (!leaderboardElem.classList.contains('hide')) {
    leaderBtn.textContent = 'Leaderboard'
  } else {
    leaderBtn.textContent = 'Close'
  }
  leaderboardElem.classList.toggle('hide')
}

// add new book to the library array. will be hooked into database eventually
async function addBookToLibrary(e) {
  e.preventDefault()
  if (!validationText.classList.contains('hidden')) {
    validationText.classList.add('hidden')
  }
  bookContainer.innerHTML = ''
  const newBook = getBookFromUser()
  if (
    newBook.title === '' ||
    newBook.author === '' ||
    newBook.pageCount === null ||
    newBook.reader === ''
  ) {
    validationText.classList.remove('hidden')

    displayBooks()
    return
  }
  const { data, error } = await supabase.from('books').insert([
    {
      title: newBook.title,
      author: newBook.author,
      pages: newBook.pageCount,
      reader: newBook.reader,
    },
  ])

  titleInput.value = ''
  authorInput.value = ''
  readerInput.value = ''
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
    const displayedBook = generateBookCard(
      book.title,
      book.author,
      book.pages,
      book.id,
      date,
      book.reader
    )
    // create div to hold
    const bookCard = document.createElement('div')

    bookCard.innerHTML = displayedBook
    bookContainer.appendChild(bookCard)
  })
}

// handles removing book card from page when delete button pressed
async function editBookCard(e) {
  const target = e.target
  if (target.classList.contains('delete-btn')) {
    let bookToRemove = target.closest('.book')
    let bookIndex = bookToRemove.dataset.index
    const { data, error } = await supabase
      .from('books')
      .delete()
      .match({ id: bookIndex })
    bookToRemove.remove()
  }
}
