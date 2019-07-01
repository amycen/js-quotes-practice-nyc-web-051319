// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")
const newQuote = document.querySelector("#new-quote")
const author = document.querySelector("#author")
fetch("http://localhost:3000/quotes?_embed=likes")
.then(resp => resp.json())
.then(json => addQuotes(json))

function addQuotes(json) {
    json.forEach(quote => {
        const newLI = document.createElement("li")
        newLI.className = "quote-card"
        const newBlockQuote = document.createElement("blockquote")
        newBlockQuote.className = "blockquote"

        newBlockQuote.innerHTML = `
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>`

        const likeBtn = document.createElement("button")
        likeBtn.className = "btn-success"
        showLikes(likeBtn, quote.id)

        likeBtn.addEventListener('click', e => {
            fetch(`http://localhost:3000/likes`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    quoteId: quote.id,
                    createdAt: Date.now()
                })
            })
            .then(resp => resp.json())
            .then(json => showLikes(likeBtn, quote.id))
        })
        newBlockQuote.appendChild(likeBtn)

        const deleteBtn = document.createElement("button")
        deleteBtn.className = "btn-danger"
        deleteBtn.innerText = "Delete"
        deleteBtn.addEventListener("click", e => {
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: quote.id})
            })
            .then(resp => newLI.remove())
        })

        newBlockQuote.appendChild(deleteBtn)
        newLI.appendChild(newBlockQuote)
        quoteList.appendChild(newLI)
    })
}



newQuoteForm.addEventListener('submit', e=> {
    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({quote: newQuote.value, author: author.value})
    })
    .then(resp => resp.json())
    .then(json => addQuotes(json))
})

function showLikes(likeBtn, quoteId) {
    let length = 0
    fetch(`http://localhost:3000/likes/?quoteId=${quoteId}`)
    .then(resp => resp.json())
    .then(json => {
        likeBtn.innerHTML = `Likes: <span>${json.length}</span>`
    })
}