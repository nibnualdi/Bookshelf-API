const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const addedBook = books.filter((book) => book.id === id)[0];

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: addedBook.id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const booksFiltered = books.filter((book) => book.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
    const booksAggregate = booksFiltered.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    const response = h.response({
      status: 'success',
      data: {
        books: booksAggregate,
      },
    });
    response.code(200);
    return response;
  }
  if (reading === '0') {
    const booksFiltered = books.filter((book) => !book.reading);
    const booksAggregate = booksFiltered.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    const response = h.response({
      status: 'success',
      data: {
        books: booksAggregate,
      },
    });
    response.code(200);
    return response;
  }
  if (reading === '1') {
    const booksFiltered = books.filter((book) => book.reading);
    const booksAggregate = booksFiltered.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    const response = h.response({
      status: 'success',
      data: {
        books: booksAggregate,
      },
    });
    response.code(200);
    return response;
  }
  if (finished === '0') {
    const booksFiltered = books.filter((book) => !book.finished);
    const booksAggregate = booksFiltered.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    const response = h.response({
      status: 'success',
      data: {
        books: booksAggregate,
      },
    });
    response.code(200);
    return response;
  }
  if (finished === '1') {
    const booksFiltered = books.filter((book) => book.finished);
    const booksAggregate = booksFiltered.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    const response = h.response({
      status: 'success',
      data: {
        books: booksAggregate,
      },
    });
    response.code(200);
    return response;
  }

  const booksAggregate = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books: booksAggregate,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: book,
    },
  });
  response.code(200);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const { bookId } = request.params;

  const index = books.findIndex((note) => note.id === bookId);
  const updatedAt = new Date().toISOString();

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((note) => note.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
