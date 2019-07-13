import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

const user = {
  first_name: 'Victor',
  last_name: 'Ugwueze',
  email: 'victor@gmail.com',
  password: 'victor419',
};
const login = {
  email: 'victor@gmail.com',
  password: 'victor419',
};
const admin = {
  email: 'admin@gmail.com',
  password: 'omadamsel',
};

describe('Users', () => {
  // Test for creating new user
  describe('/POST register users', () => {
    it('it should throw an error if the request body is empty', (done) => {
      chai.request(app)
        .post('/api/v1/users')
        .send([])
        .end((error, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('The request body must not be empty');
          done();
        });
    });

    it('it should not POST a user without all required user fields', (done) => {
      chai.request(app)
        .post('/api/v1/users')
        .send({
          first_name: 'Okeke',
          last_name: 'Rilwan',
          email: 'virilwan@gmail.com',
        })
        .end((error, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('password is required');
          done();
        });
    });

    it('it should check that password is atleast 6 characters', (done) => {
      chai.request(app)
        .post('/api/v1/users')
        .send({
          first_name: 'Victor',
          last_name: 'Ugwueze',
          email: 'victoroop@gmail.com',
          password: 'vic',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('The password must be atleast 6 characters long');
          done();
        });
    });

    it('it should POST a user with all required fields', (done) => {
      chai.request(app)
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('is_admin');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('token');
          done();
        });
    });

    it('it should return error if user already exists', (done) => {
      chai.request(app)
        .post('/api/v1/users')
        .send(user)
        .end((error, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('User with this email has already been registered');
          done();
        });
    });
  });

  // Test for loggin in an existing user
  describe('/POST login users', () => {
    it('it should not login a user without email and password fields', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send({
          email: 'victorAdeoye@gmail.com',
        })
        .end((error, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('password is required');
          done();
        });
    });

    it('it should return error if user is not registered', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send({
          email: 'tosin@gmail.com',
          password: 'tosinf419',
        })
        .end((error, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('This email is not registered on our database');
          done();
        });
    });

    it('it should login a registered user and generate an access token', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(login)
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('is_admin');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('token');
          done();
        });
    });

    it('it should return error if user\'s password is not correct', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send({
          email: 'victor@gmail.com',
          password: 'victor',
        })
        .end((error, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('This password doesn\'t match our record');
          done();
        });
    });
  });
});
