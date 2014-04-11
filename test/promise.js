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

    it('allows me to register an onRejected callback', function(done) {
      p.then(function(value) {
        done()
      }, function(reason) {
        reason.should.be.exactly("nope")
        done()
      })
      p.reject("nope")
    })

    it('allows me to only register an onRejected callback', function(done) {
      p.then(null, function(reason){
        reason.should.be.exactly("nope")
      })

      p.reject("nope")
      done()
    })

    it('allows me to return from onFulfilled and propgate a value', function(done) {
      p.then(function(value) {
        return value * 2
      }).then(function(value) {
        return value + 3
      }).then(function(value) {
        value.should.be.exactly(5)
      })

      p.fulfill(1)
      done()
    })

    it('allows me to throw from onRejected and propgate a reason', function(done) {
      p.then(null, function(reason) {
        throw "gettin' mine " + reason
      }).then(null, function(reason) {
        throw "ridin' big, " + reason
      }).then(null, function(reason) {
        reason.should.be.exactly("ridin' big, gettin' mine two microwaves I cook a brick at a time")
      })

      p.reject("two microwaves I cook a brick at a time")
      done()
    })

    it('only lets me fulfill a promise once', function(done) {
      p.fulfill(2)
      p.value.should.be.exactly(2)
      p.fulfill(5)
      p.value.should.be.exactly(2)
      done()
    })


  })

})