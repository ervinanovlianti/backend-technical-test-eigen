const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Book API', () => {
    // Pengujian untuk route mendapatkan semua buku
    describe('GET /api/books', () => {
        it('should retrieve all books', (done) => {
            chai
                .request(app)
                .get('/api/books')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    // Pengujian untuk route menambahkan buku baru
    describe('POST /api/books', () => {
        it('should add a new book', (done) => {
            const newBook = {
                code: 'JK-46',
                title: 'New Book',
                author: 'Author Name',
                stock: 5,
            };

            chai
                .request(app)
                .post('/api/books')
                .send(newBook)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body.code).to.equal('JK-46');
                    done();
                });
        });

        it('should not add a book without required fields', (done) => {
            const invalidBook = {
                code: 'JK-47', // Tidak menyertakan field 'title', 'author', atau 'stock'
            };

            chai
                .request(app)
                .post('/api/books')
                .send(invalidBook)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    // Pengujian untuk route mendapatkan buku berdasarkan kode buku
    describe('GET /api/books/:code', () => {
        it('should retrieve a book by code', (done) => {
            const bookCode = 'JK-46'; // Sesuaikan dengan kode buku yang telah ditambahkan sebelumnya

            chai
                .request(app)
                .get(`/api/books/${bookCode}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.code).to.equal(bookCode);
                    done();
                });
        });

        it('should return an error for non-existent book code', (done) => {
            const nonExistentCode = 'JK-999'; // Kode buku yang tidak ada

            chai
                .request(app)
                .get(`/api/books/${nonExistentCode}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

});
