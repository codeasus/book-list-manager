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
        const bookList = document.querySelector('#book-list');
        const tempRow  = document.createElement('tr');

        tempRow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><button class="delete">X</button></td>
        `;
        bookList.appendChild(tempRow);
    }

    static removeBook(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
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

        // const animepopup        = popmotion.styler(alertPopup);

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
        setTimeout((e) => alertPopup.style.display = 'none', 2500);
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
        Store.addBook(tempBook);
        UI.addBook(tempBook);
        UI.clearFields();
        UI.alert('Book added', 'positive');
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
    UI.removeBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.alert('Book removed', 'positive')
});

