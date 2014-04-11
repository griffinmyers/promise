var P = require('../lib/promise.js')
var assert = require('should')

var p = new P()

describe('Promise', function(){

  var p;

  beforeEach(function(done) {
    p = new P()
    done()
  })

  describe("#then()", function() {

    it('allows me to register a onFulfilled callback', function(done) {
      p.then(function(value) {
        value.should.be.exactly(2)
        done()
      })
      p.fulfill(2)
    })

    it('allows me to register a onRejected callback', function(done) {
      p.then(function(value) {
        done()
      }, function(reason) {
        reason.should.be.exactly("nope")
        done()
      })
      p.reject("nope")
    })

    it('only lets me fulfill a promise once', function(done) {
      p.fulfill(2)
      (function(){ p.fulfill(2) }).should.throw();
      done()
    })

  })

})