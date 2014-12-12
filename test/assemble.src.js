/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assemble = require('..');
var should = require('should');
var join = require('path').join;

describe('assemble input stream', function() {
  var site = null;

  describe('src()', function() {
    describe('minimal config - enabled', function () {
      beforeEach(function () {
        site = assemble.createInst();
        site.enable('minimal config');
      });

      it('should return a stream', function (done) {
        var stream = site.src(join(__dirname, './fixtures/*.coffee'));
        should.exist(stream);
        should.exist(stream.on);
        done();
      });
      it('should return a input stream from a flat glob', function (done) {
        var stream = site.src(join(__dirname, './fixtures/*.coffee'));
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(__dirname, './fixtures/test.coffee'));
          String(file.contents).should.equal('this is a test');
        });
        stream.on('end', function () {
          done();
        });
      });

      it('should return a input stream for multiple globs', function (done) {
        var globArray = [
          join(__dirname, './fixtures/generic/run.dmc'),
          join(__dirname, './fixtures/generic/test.dmc')
        ];
        var stream = site.src(globArray);

        var files = [];
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          files.push(file);
        });
        stream.on('end', function () {
          files.length.should.equal(2);
          files[0].path.should.equal(globArray[0]);
          files[1].path.should.equal(globArray[1]);
          done();
        });
      });

      it('should return a input stream for multiple globs, with negation', function (done) {
        var expectedPath = join(__dirname, './fixtures/generic/run.dmc');
        var globArray = [
          join(__dirname, './fixtures/generic/*.dmc'),
          '!' + join(__dirname, './fixtures/generic/test.dmc'),
        ];
        var stream = site.src(globArray);

        var files = [];
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          files.push(file);
        });
        stream.on('end', function () {
          files.length.should.equal(1);
          files[0].path.should.equal(expectedPath);
          done();
        });
      });

      it('should return a input stream with no contents when read is false', function (done) {
        var stream = site.src(join(__dirname, './fixtures/*.coffee'), {read: false});
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.not.exist(file.contents);
          join(file.path, '').should.equal(join(__dirname, './fixtures/test.coffee'));
        });
        stream.on('end', function () {
          done();
        });
      });
      it('should return a input stream with contents as stream when buffer is false', function (done) {
        var stream = site.src(join(__dirname, './fixtures/*.coffee'), {buffer: false});
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          var buf = '';
          file.contents.on('data', function (d) {
            buf += d;
          });
          file.contents.on('end', function () {
            buf.should.equal('this is a test');
            done();
          });
          join(file.path, '').should.equal(join(__dirname, './fixtures/test.coffee'));
        });
      });
      it('should return a input stream from a deep glob', function (done) {
        var stream = site.src(join(__dirname, './fixtures/**/*.jade'));
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(__dirname, './fixtures/test/run.jade'));
          String(file.contents).should.equal('test template');
        });
        stream.on('end', function () {
          done();
        });
      });
      it('should return a input stream from a deeper glob', function (done) {
        var stream = site.src(join(__dirname, './fixtures/**/*.dmc'));
        var a = 0;
        stream.on('error', done);
        stream.on('data', function () {
          ++a;
        });
        stream.on('end', function () {
          a.should.equal(2);
          done();
        });
      });

      it('should return a file stream from a flat path', function (done) {
        var a = 0;
        var stream = site.src(join(__dirname, './fixtures/test.coffee'));
        stream.on('error', done);
        stream.on('data', function (file) {
          ++a;
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(__dirname, './fixtures/test.coffee'));
          String(file.contents).should.equal('this is a test');
        });
        stream.on('end', function () {
          a.should.equal(1);
          done();
        });
      });
    });

    describe('minimal config - disabled', function () {

      beforeEach(function () {
        site = assemble.createInst();
      });

      it('should return a stream', function (done) {
        var stream = site.src(join(__dirname, './fixtures/*.coffee'));
        should.exist(stream);
        should.exist(stream.on);
        done();
      });
      it('should return a input stream from a flat glob', function (done) {
        var stream = site.src(join(__dirname, './fixtures/*.coffee'));
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(__dirname, './fixtures/test.coffee'));
          String(file.contents).should.equal('this is a test');
        });
        stream.on('end', function () {
          done();
        });
      });

      it('should return a input stream for multiple globs', function (done) {
        var globArray = [
          join(__dirname, './fixtures/generic/run.dmc'),
          join(__dirname, './fixtures/generic/test.dmc')
        ];
        var stream = site.src(globArray);

        var files = [];
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          files.push(file);
        });
        stream.on('end', function () {
          files.length.should.equal(2);
          files[0].path.should.equal(globArray[0]);
          files[1].path.should.equal(globArray[1]);
          done();
        });
      });

      it('should return a input stream for multiple globs, with negation', function (done) {
        var expectedPath = join(__dirname, './fixtures/generic/run.dmc');
        var globArray = [
          join(__dirname, './fixtures/generic/*.dmc'),
          '!' + join(__dirname, './fixtures/generic/test.dmc'),
        ];
        var stream = site.src(globArray);

        var files = [];
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          files.push(file);
        });
        stream.on('end', function () {
          files.length.should.equal(1);
          files[0].path.should.equal(expectedPath);
          done();
        });
      });

      it('should return a input stream with no contents when read is false', function (done) {
        var stream = site.src(join(__dirname, './fixtures/*.coffee'), {read: false});
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.not.exist(file.contents);
          join(file.path, '').should.equal(join(__dirname, './fixtures/test.coffee'));
        });
        stream.on('end', function () {
          done();
        });
      });
      xit('should return a throw an error when buffer is false', function (done) {
        var stream = site.src(join(__dirname, './fixtures/*.coffee'), {buffer: false});
        stream.on('error', function () {
          done();
        });
        stream.on('data', function () {
          done(new Error('should have thrown an error'));
        });
      });
      it('should return a input stream from a deep glob', function (done) {
        var stream = site.src(join(__dirname, './fixtures/**/*.jade'));
        stream.on('error', done);
        stream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(__dirname, './fixtures/test/run.jade'));
          String(file.contents).should.equal('test template');
        });
        stream.on('end', function () {
          done();
        });
      });
      it('should return a input stream from a deeper glob', function (done) {
        var stream = site.src(join(__dirname, './fixtures/**/*.dmc'));
        var a = 0;
        stream.on('error', done);
        stream.on('data', function () {
          ++a;
        });
        stream.on('end', function () {
          a.should.equal(2);
          done();
        });
      });

      it('should return a file stream from a flat path', function (done) {
        var a = 0;
        var stream = site.src(join(__dirname, './fixtures/test.coffee'));
        stream.on('error', done);
        stream.on('data', function (file) {
          ++a;
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(__dirname, './fixtures/test.coffee'));
          String(file.contents).should.equal('this is a test');
        });
        stream.on('end', function () {
          a.should.equal(1);
          done();
        });
      });
    });

  });
});
