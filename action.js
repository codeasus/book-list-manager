class Store {
    static getBooks() {
        let internalBooks;
        if(localStorage.getItem('internalBooks') === null) {
            internalBooks = [];
        }
        else {
            internalBooks = JSON.parse(localStorage.getItem('internalBooks'));
        }
        return internalBooks;
    }

    static addBook(book) {
        const internalBooks = Store.getBooks();
        internalBooks.push(book);
        localStorage.setItem('internalBooks', JSON.stringify(internalBooks));
    }

    static removeBook(isbn) {
        const internalBooks = Store.getBooks();
        internalBooks.forEach((book, index) => {
            if(book.isbn === isbn) {
                internalBooks.splice(index, 1);
            }
        });
        localStorage.setItem('internalBooks', JSON.stringify(internalBooks));
    }

    static findBook(bookInput) {
        const internalBooks = Store.getBooks();
        if(internalBooks === undefined || internalBooks.length == 0) {
            return false;
        }
        else {
            for(let i = 0; i < internalBooks.length; i++) {
                if(internalBooks[i].isbn === bookInput.isbn) {
                    return true;
                }
            }
            return false;
        }
    }
}

class Book {
    constructor(title, author, isbn) {
        this.title  = title;
        this.author = author;
        this.isbn   = isbn;
    }
}


class UI {
    static displayBooks() {
        const intenalBooks = Store.getBooks();
        intenalBooks.forEach((book) => UI.addBook(book));
    }

    static addBook(book) {
        const bookList    = document.querySelector('#book-list');
        const tempRow     = document.createElement('tr');
        tempRow.className = 'tbody-row';

        tempRow.innerHTML = `
            <td class = "row-cell">${book.title}</td>
            <td class = "row-cell">${book.author}</td>
            <td class = "row-cell">${book.isbn}</td>
            <td class = "row-cell"><button class="delete">X</button></td>
        `;
        bookList.appendChild(tempRow);
    }

    static removeBook(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
        else {
            return;
        }
    }

    static cmRemoveBook(target) {
        target.parentElement.remove()   
    }

    static clearFields() {
        document.querySelector('#title').value  = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value   = '';
    }

    static alert(message, popupMode) {
        const alertPopupMessage = document.querySelector('.alert-popup p');
        const alertPopup        = document.querySelector('.alert-popup');
        const alertPopupButton  = document.querySelector('.alert-popup button');

        

        if(popupMode === 'negative') {
            alertPopup.style.backgroundColor       = '#ef5350';
            alertPopupButton.style.backgroundColor = '#ef5350';
        }

        else if(popupMode === 'positive') {
            alertPopup.style.backgroundColor       = '#4caf50';
            alertPopupButton.style.backgroundColor = '#4caf50'; 
        }

        alertPopupMessage.textContent = message;

        UI.animate(alertPopup, 'flex', 200, .4, 1, -50, 0);         
        setTimeout((e) => alertPopup.style.display = 'none', 2000);
    }

    static animate(javascriptSelect, displayMode, duration_, scaleFrom, scaleTo, yFrom, yTo) {
        const animeObject = popmotion.styler(javascriptSelect);

        popmotion.tween({
            from: {
                scale: scaleFrom,
                y: yFrom
            },
            to: {
                scale: scaleTo,
                y: yTo
            }, 
            duration: duration_
        }).start(animeObject.set);

        javascriptSelect.style.display = displayMode;
    }
}


document.addEventListener('DOMContentLoaded', UI.displayBooks());
document.addEventListener('DOMContentLoaded', UI.clearFields());

// Event Add A Book
const bookForm = document.querySelector('#book-form'); 
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookTitle   = document.querySelector('#title').value;
    const bookAuthor  = document.querySelector('#author').value; 
    const bookISBN    = document.querySelector('#isbn').value;
    
    if(bookTitle === '' || bookAuthor === '' || bookISBN === '') {
        UI.alert('Fill in all inputs', 'negative');
    }
    else {
        const tempBook = new Book(bookTitle, bookAuthor, bookISBN);

        if (Store.findBook(tempBook) == false) {
            Store.addBook(tempBook);
            UI.addBook(tempBook);
            UI.clearFields();
            UI.alert('Book added', 'positive');
        }
        else {
            UI.alert('This books already exists', 'negative');
        }
    }
});

// Event Pop-Up 
const popupButton = document.querySelector('.alert-popup button');
popupButton.addEventListener('click', (e) => {
    const popupPTag       = document.querySelector('.alert-popup p');
    const popup           = document.querySelector('.alert-popup');
    popup.style.display   = 'none';
    popupPTag.textContent = '';
});

// Event Remove A Book
const bookList = document.querySelector('#book-list');

bookList.addEventListener('click', (e) => {
    // e.preventDefault();
    if(e.target.className === 'delete') {
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        UI.removeBook(e.target);
        UI.alert('Book removed', 'positive');
    }
});

let rowInfo;
const cmRemoveButton = document.querySelector('.cm-item-remove');
cmRemoveButton.addEventListener('click', (e) => {
    UI.cmRemoveBook(rowInfo); 
    UI.alert('Book removed', 'positive');
    Store.removeBook(rowInfo.parentElement.children[2]);
})

// Event Context-Menu
const contextMenu = document.querySelector('.contextMenu');
bookList.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (e.target.className === 'row-cell') {
        contextMenu.style.display = 'block';
        contextMenu.style.left    = `${e.pageX + 10}px`;
        contextMenu.style.top     = `${e.pageY - 50}px`;
    }   
    rowInfo = e.target;
});    

document.addEventListener('click', (e) => {
    if(e.target.className === 'cm-item-update') {
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'block';
        console.log('update-button-click-action');
    }
    else {
        contextMenu.style.display = 'none';
    }
})
