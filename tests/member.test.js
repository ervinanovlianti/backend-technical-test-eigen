const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Pastikan path menuju aplikasi Anda sesuai
const expect = chai.expect;

chai.use(chaiHttp);

describe('Member API', () => {
    // Pengujian untuk menampilkan semua anggota
    describe('GET /api/members', () => {
        it('should retrieve all members', (done) => {
            chai
                .request(app)
                .get('/api/members')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    // Pengujian untuk menambahkan anggota baru
    describe('POST /api/members', () => {
        it('should add a new member', (done) => {
            const newMember = {
                code: 'M006',
                name: 'Test Member 6',
            };

            chai
                .request(app)
                .post('/api/members')
                .send(newMember)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body.code).to.equal('M006');
                    done();
                });
        });

        it('should not add a member without required fields', (done) => {
            const invalidMember = {
                code: 'M007', // Tidak menyertakan field 'name'
            };

            chai
                .request(app)
                .post('/api/members')
                .send(invalidMember)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    // Pengujian untuk mendapatkan anggota berdasarkan ID
    describe('GET /api/members/:code', () => {
        it('should retrieve a member by Code', (done) => {
            const memberCode = 'M006'; // Sesuaikan dengan ID anggota yang telah ditambahkan sebelumnya

            chai
                .request(app)
                .get(`/api/members/${memberCode}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.code).to.equal(memberCode);
                    done();
                });
        });

        it('should return an error for non-existent member Code', (done) => {
            const nonExistentCode = '999'; // ID anggota yang tidak ada

            chai
                .request(app)
                .get(`/api/members/${nonExistentCode}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    // Pengujian untuk memperbarui anggota berdasarkan ID
    describe('PUT /api/members/:code', () => {
        it('should update a member by ID', (done) => {
            const memberCode = 'M006'; // Sesuaikan dengan ID anggota yang telah ditambahkan sebelumnya
            const updatedMember = {
                name: 'Updated Test Member',
            };

            chai
                .request(app)
                .put(`/api/members/${memberCode}`)
                .send(updatedMember)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.name).to.equal('Updated Test Member');
                    done();
                });
        });
    });

    // Pengujian untuk menghapus anggota berdasarkan ID
    describe('DELETE /api/members/:code', () => {
        it('should delete a member by ID', (done) => {
            const memberCode = 'M006'; // Sesuaikan dengan ID anggota yang telah ditambahkan sebelumnya

            chai
                .request(app)
                .delete(`/api/members/${memberCode}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    // Kasus 1: Anggota meminjam buku
    describe('POST /api/members/:code/borrow', () => {
        it('should allow a member to borrow a book', (done) => {
            const member = { code: 'M002', name: 'Angga', borrowedBooks: [], penaltyStartDate: null };
            const book = { code: 'BK002', title: 'Test Book', author: 'Test Author', isBorrowed: false };

            // Simulasikan penambahan anggota dan buku ke basis data

            chai
                .request(app)
                .post(`/api/members/${member.code}/borrow`)
                .send({ bookCode: book.code })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Book borrowed successfully');
                    done();
                });
        });

        it('should not allow borrowing a book that is already borrowed', (done) => {
            const member1 = { code: 'M001', name: 'Angga', borrowedBooks: [], penaltyStartDate: null };
            const member2 = { code: 'M002', name: 'Budi', borrowedBooks: [], penaltyStartDate: null };
            const book = { code: 'BK001', title: 'Test Book', author: 'Test Author', isBorrowed: false };

            // Simulasikan penambahan anggota, buku, dan member1 meminjam buku
            // Kemudian, mencoba member2 meminjam buku yang sama

            chai
                .request(app)
                .post(`/api/members/${member2.code}/borrow`)
                .send({ bookCode: book.code })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error').equal('Book is already borrowed');
                    done();
                });
        });
    });

    // Kasus 2: Anggota mengembalikan buku
    describe('POST /api/members/:code/return', () => {
        it('should allow a member to return a book', (done) => {
            const member = { code: 'M001', name: 'Angga', borrowedBooks: ['BK001'], penaltyStartDate: null };
            const book = { code: 'BK001', title: 'Test Book', author: 'Test Author', isBorrowed: true };

            // Simulasikan penambahan anggota, buku, dan anggota meminjam buku

            chai
                .request(app)
                .post(`/api/members/${member.code}/return`)
                .send({ bookCode: book.code, returnDate: new Date() })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Book returned successfully');
                    done();
                });
        });

        it('should not allow returning a book that does not belong to the member', (done) => {
            const member = { code: 'M001', name: 'Angga', borrowedBooks: ['BK001'], penaltyStartDate: null };
            const book = { code: 'BK002', title: 'Another Book', author: 'Another Author', isBorrowed: true };

            // Simulasikan penambahan anggota, buku, dan anggota meminjam buku

            chai
                .request(app)
                .post(`/api/members/${member.code}/return`)
                .send({ bookCode: book.code, returnDate: new Date() })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error').equal('Book does not belong to the member');
                    done();
                });
        });
    });


});
