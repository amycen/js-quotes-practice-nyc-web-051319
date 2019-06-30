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
        likeBtn.innerHTML = `Likes: <span>0</span>`
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
    fetch("https://localhost:3000/quotes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({quote: newQuote.value, author: author.value})
    })
    .then(resp => console.log("HI"))
    //.then(json => console.log(json))
})