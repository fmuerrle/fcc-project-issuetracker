/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

const tempId = [];

suite('Functional Tests', function() {
  suite('POST /api/issues/{project} => object with issue data', function() {
    test('Every field filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          tempId.push(res.body._id);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(
            res.body.created_by,
            'Functional Test - Every field filled in'
          );
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          // console.log('tempId :', tempId);
          //fill me in too!
          done();
        });
    });
    test('Required fields filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in'
        })
        .end(function(err, res) {
          tempId.push(res.body._id);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(
            res.body.created_by,
            'Functional Test - Required fields filled in'
          );
          //fill me in too!
          done();
        });
    });
    test('Missing required fields', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({})
        .end(function(err, res) {
          // console.log('res.body :', res.body);
          assert.equal(res.status, 400);
          //fill me in too!
          done();
        });
    });
  });

  suite('PUT /api/issues/{project} => text', function() {
    this.timeout(6000);
    test('No body', function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.text, 'no updated field sent');
          done();
        });
    });
    test('One field to update', function(done) {
      this.timeout(6000);
      chai
        .request(server)
        .put('/api/issues/test')
        .send({ _id: tempId[0], issue_title: 'New Title' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        });
    });
    test('Multiple fields to update', function(done) {
      this.timeout(6000);
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: tempId[0],
          issue_title: 'New Title',
          issue_text: 'New text',
          open: true
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        });
    });
  });

  suite(
    'GET /api/issues/{project} => Array of objects with issue data',
    function() {
      test('No filter', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .get('/api/issues/test')
          .query({})
          .end(function(err, res) {
            // console.log('res.body :', res.body);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });

      test('One filter', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .get('/api/issues/test')
          .query({ open: true })
          .end(function(err, res) {
            // console.log('res.body :', res.body);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isTrue(res.body[0].open, true);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .get('/api/issues/test')
          .query({
            open: true,
            issue_text: 'text'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });
    }
  );

  suite('DELETE /api/issues/{project} => text', function() {
    test('No _id', function(done) {
      this.timeout(6000);
      chai
        .request(server)
        .delete('/api/issues/test')
        .query({})
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text, '_id error');
          done();
        });
    });
    test('Valid _id', function(done) {
      this.timeout(6000);
      chai
        .request(server)
        .delete('/api/issues/test')
        .query({ _id: tempId[1] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'deleted ' + tempId[1]);
          done();
        });
    });
  });
});
