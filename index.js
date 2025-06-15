const bookStorage = [
    new Book('Some title', 247, 'Jhon Doy'),
    new Book('Anouther title', 326, 'Alisha Tin'),
];
const bookList = document.querySelector("ul");
const bookForm = document.querySelector("form");

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isError = false;
    for (let element of bookForm.elements) {
        if (element.tagName !== 'INPUT') continue;
        if (!element.validity.valid) {
            showError(element);
            isError = true;
        }
    }
    if (isError) return;
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const pages = +formData.get('pages');
    const author = formData.get('author');
    addBook(title, pages, author);
    renderBookList();
});

bookForm.addEventListener('input', ({ target }) => {
    if (!target.matches('input')) return;
    if (target.validity.valid) {
        removeError(target);
    }
});

bookList.addEventListener('click', (e) => {
    if (!e.target.matches('.btn')) return;
    const card = e.target.closest('[data-uuid]');
    const id = card?.dataset.uuid;
    if (id) {
        const book = updateStatusBook(id);
        updateBookView(id, book);
    }
});

renderBookList();


function Book(title, pages, author) {
    if (!new.target) {
        throw new Error("Constructor must be excecuted using new keyword!");
    }
    this.uuid = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = false;
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
}

function addBook(title, pages, author) {
    let book = new Book(title, pages, author);
    bookStorage.push(book);
}

function updateStatusBook(uuid) {
    let i = bookStorage.findIndex(e => e.uuid === uuid);
    if (i === -1) {
        return;
    }
    let book = bookStorage[i];
    book.toggleRead();
    bookStorage[i] = book;
    return book;
}

function updateBookView(uuid, book) {
    var bookItem = bookList.querySelector(`[data-uuid="${uuid}"]`);
    var button = bookItem?.querySelector(`.btn`);
    if (button) {
        button.textContent = book.read ? 'reading' : 'skiped';
        button.classList.toggle('active');
    }
}

function renderBookList() {
    let innerHTML = '';
    for (let book of bookStorage) {
        let inReading = book.read ? 'reading' : 'skiped';
        let classList = book.read ? 'btn active' : 'btn';
        innerHTML += `<li class="card book-item" data-uuid="${book.uuid}">
            <span><strong>Id:</strong> ${book.uuid}</span>
            <h2>${book.title}</h2>
            <span><strong>author:</strong> ${book.author}</span>
            <span><strong>pages:</strong> ${book.pages}</span>
            <button class="${classList}" type="button">${inReading}</button>
        </li>`
    }
    bookList.innerHTML = innerHTML;
}

function showError(input) {
    let errMesage = bookForm.querySelector(`[aria-labelledby="${input.getAttribute('aria-describedby')}"]`);
    if (errMesage) {
        errMesage.textContent = 'Invalid input value.';
        errMesage.classList.add('error');
    }
}

function removeError(input) {
    let errMesage = bookForm.querySelector(`[aria-labelledby="${input.getAttribute('aria-describedby')}"]`);
    errMesage.textContent = '';
    errMesage.classList.remove('error');
}