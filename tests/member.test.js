const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
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

    describe('POST /api/members/:code/borrow', () => {
        it('should allow a member to borrow a book', (done) => {
            const requestData = {
                // code: 'M006',
                bookCode: 'BK007',
            };

            chai
                .request(app)
                .post('/api/members/M006/borrow')
                .send(requestData)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message').equal('Book borrowed successfully');
                    done();
                });
        });

        it('should not allow borrowing more than 2 books', (done) => {
            // Pinjam buku pertama
            const requestData1 = {
                code: 'M001',
                bookCode: 'BK002',
            };

            chai
                .request(app)
                .post('/api/members/M001/borrow')
                .send(requestData1)
                .end(() => {
                    // Pinjam buku kedua
                    const requestData2 = {
                        code: 'M001',
                        bookCode: 'BK003',
                    };

                    chai
                        .request(app)
                        .post('/api/members/M001/borrow')
                        .send(requestData2)
                        .end(() => {
                            // Coba pinjam buku ketiga
                            const requestData3 = {
                                code: 'M001',
                                bookCode: 'BK004',
                            };

                            chai
                                .request(app)
                                .post('/api/members/M001/borrow')
                                .send(requestData3)
                                .end((err, res) => {
                                    expect(res).to.have.status(400);
                                    expect(res.body).to.have.property('error').equal('Member cannot borrow more than 2 books');
                                    done();
                                });
                        });
                });
        });

        it('should not allow borrowing an already borrowed book', (done) => {
            // Pinjam buku yang sudah dipinjam oleh anggota lain
            const requestData = {
                code: 'M002',
                bookCode: 'BK001',
            };

            chai
                .request(app)
                .post('/api/members/M002/borrow')
                .send(requestData)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error').equal('Book is already borrowed');
                    done();
                });
        });

        it('should return an error for non-existent member', (done) => {
            const requestData = {
                code: 'M999', // Kode member yang tidak ada
                bookCode: 'BK001',
            };

            chai
                .request(app)
                .post('/api/members/M999/borrow')
                .send(requestData)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error').equal('Member or book not found');
                    done();
                });
        });
    });

    describe('POST /api/members/:code/return', () => {
        it('should allow a member to return a book', (done) => {
            const requestData = {
                code: 'M001',
                bookCode: 'BK001',
            };

            chai
                .request(app)
                .post('/api/members/M001/return')
                .send(requestData)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message').equal('Book returned successfully');
                    done();
                });
        });

        it('should not allow returning a book that does not belong to them', (done) => {
            const requestData = {
                code: 'M001',
                bookCode: 'BK002', // Kode buku yang tidak pernah dipinjam oleh M001
            };

            chai
                .request(app)
                .post('/api/members/M001/return')
                .send(requestData)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error').equal('Book does not belong to the member');
                    done();
                });
        });

        it('should return an error for non-existent member', (done) => {
            const requestData = {
                code: 'M999', // Kode member yang tidak ada
                bookCode: 'BK001',
            };

            chai
                .request(app)
                .post('/api/members/M999/return')
                .send(requestData)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error').equal('Member or book not found');
                    done();
                });
        });
    });
});
