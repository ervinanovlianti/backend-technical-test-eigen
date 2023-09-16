const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Pastikan path menuju aplikasi Anda sesuai
const expect = chai.expect;

chai.use(chaiHttp);

describe('Book API', () => {
    // Pengujian untuk menampilkan semua buku
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

    // Pengujian untuk menambahkan buku baru
    describe('POST /api/books', () => {
        it('should add a new book', (done) => {
            const newBook = {
                code: 'BK007',
                title: 'Test Book 7',
                author: 'Test Author',
                stock: 5,
            };

            chai
                .request(app)
                .post('/api/books')
                .send(newBook)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body.code).to.equal('BK007');
                    done();
                });
        });

        it('should not add a book without required fields', (done) => {
            const invalidBook = {
                code: 'BK008', // Tidak menyertakan field 'title', 'author', atau 'stock'
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

    // Pengujian untuk mendapatkan buku berdasarkan Code
    describe('GET /api/books/:code', () => {
        it('should retrieve a book by Code', (done) => {
            const bookCode = 'BK007'; // Sesuaikan dengan Code buku yang telah ditambahkan sebelumnya

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

        it('should return an error for non-existent book Code', (done) => {
            const nonExistentCode = '999'; // Code buku yang tidak ada

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

    // Pengujian untuk memperbarui buku berdasarkan Code
    describe('PUT /api/books/:code', () => {
        it('should update a book by Code', (done) => {
            const bookCode = 'BK007'; // Sesuaikan dengan Code buku yang telah ditambahkan sebelumnya
            const updatedBook = {
                title: 'Updated Test Book',
            };

            chai
                .request(app)
                .put(`/api/books/${bookCode}`)
                .send(updatedBook)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.title).to.equal('Updated Test Book');
                    done();
                });
        });
    });

    // Pengujian untuk menghapus buku berdasarkan Code
    describe('DELETE /api/books/:code', () => {
        it('should delete a book by Code', (done) => {
            const code = 'BK007'; // Sesuaikan dengan Code buku yang telah ditambahkan sebelumnya

            chai
                .request(app)
                .delete(`/api/books/${code}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

});
