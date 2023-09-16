const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Member API', () => {
    // Pengujian untuk route mendapatkan semua anggota
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

    // Pengujian untuk route menambahkan anggota baru
    describe('POST /api/members', () => {
        it('should add a new member', (done) => {
            const newMember = {
                code: 'M005',
                name: 'Test Member 5',
            };

            chai
                .request(app)
                .post('/api/members')
                .send(newMember)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body.code).to.equal('M005');
                    done();
                });
        });

        it('should not add a member without required fields', (done) => {
            const invalidMember = {
                code: 'M006', // Tidak menyertakan field 'name'
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

    // Pengujian untuk route mendapatkan anggota berdasarkan kode anggota
    describe('GET /api/members/:code', () => {
        it('should retrieve a member by code', (done) => {
            const memberCode = 'M005'; // Sesuaikan dengan kode anggota yang telah ditambahkan sebelumnya

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

        it('should return an error for non-existent member code', (done) => {
            const nonExistentCode = 'M999'; // Kode anggota yang tidak ada

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

});
