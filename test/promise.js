var P = require('../lib/promise.js')
var assert = require('assert')

var p = new P()

describe('Promise', function(){

  var p;

  beforeEach(function(done) {
    p = new P()
    done()
  })

  describe("#then()", function() {
    it('asserts true', function() {
      assert(true)
    })
  })

})

// p.then(function(value) {
//   return value + 2
// }, function(reason) {
//   console.log(reason)
// }).then(function(value){
//   console.log(value)
// })

// p.fulfill(1)