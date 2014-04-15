var P = require('../lib/promise.js')
var assert = require('should')

describe('Promise', function(){

  var p;

  beforeEach(function(done) {
    p = new P()
    done()
  })

  describe("#then()", function() {

    it('allows me to register an onFulfilled callback', function(done) {
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
        done()
      })

      p.reject("nope")
    })

    it('allows me to return from onFulfilled and propagate a value', function(done) {
      p.then(function(value) {
        return value * 2
      }).then(function(value) {
        return value + 3
      }).then(function(value) {
        value.should.be.exactly(5)
        done()
      })

      p.fulfill(1)
    })

    it('allows me to throw from onRejected and propagate a reason', function(done) {
      p.then(null, function(reason) {
        throw "gettin' mine " + reason
      }).then(null, function(reason) {
        throw "ridin' big, " + reason
      }).then(null, function(reason) {
        reason.should.be.exactly("ridin' big, gettin' mine two microwaves I cook a brick at a time")
        done()
      })

      p.reject("two microwaves I cook a brick at a time")
    })

    it('only lets me fulfill a promise once', function(done) {
      p.fulfill(2)
      p.value.should.be.exactly(2)
      p.fulfill(5)
      p.value.should.be.exactly(2)
      done()
    })

    it('allows me to register multiple resolve callbacks', function(done) {

      var made_it = false

      p.then(function(value) {
        made_it = true
      })

      p.then(function(value) {
        made_it.should.be.true
        done()
      })

      p.fulfill(2)

    })

    it('allows me to register multiple reject callbacks', function(done) {

      var made_it = false

      p.then(null, function(reason) {
        made_it = true
      })

      p.then(null, function(reason) {
        made_it.should.be.true
        done()
      })

      p.reject(2)

    })

    it('should resolve promises returned by then given immediate values', function(done) {

      p.then(2).then(function(value) {
        value.should.be.exactly(2)
        done()
      })

      p.fulfill(10)

    })

    it('should reject promises returned by then given immediate values', function(done) {

      p.then(null, 2).then(null, function(reason) {
        reason.should.be.exactly(2)
        done()
      })

      p.reject(10)

    })

    it('should let me propagate errors', function(done) {

      p.then(function(value) {
        throw value
      }).then(function(value) {
        return value
      }).then(null, function(reason) {
        assert(reason === undefined)
        done()
      })

      p.fulfill(10)

    })

    it('should let me catch errors', function(done) {

      p.then(function(value) {
        throw value
      }).then(null, function(reason) {
        return reason
      }).then(function(value) {
        value.should.be.exactly(10)
        done()
      })

      p.fulfill(10)

    })

    it.only('should adopt promise state', function(done) {

      var pone = new P()
      var ptwo = new P()

      pone.then(function(value) {
        return ptwo
      }).then(function(value) {
        console.log(value)
        value.should.be.exactly(20)
        done()
      })

      pone.fulfill(10)
      ptwo.fulfill(20)

    })

  })

})