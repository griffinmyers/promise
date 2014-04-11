var h = require('../lib/help.js')
var should = require('should')
var assert = require('assert')

describe('Help', function(){

  describe("#is_function()", function() {
    it('works', function() {
      h.is_function(2).should.be.false
      h.is_function(function(){}).should.be.true
    })
  })

  describe("#is_object()", function() {
    it('works', function() {
      h.is_object(2).should.be.false
      h.is_object({'hey': 'breh'}).should.be.true
    })
  })

  describe("#once()", function() {
    it('allows me to call a function only once', function() {
      lilb = h.once(function(){
        return "based god"
      })

      lilb().should.be.exactly("based god")
      assert(lilb() === undefined)
    })
  })

  describe("#any_once()", function() {
    it('allows me to call any function only once', function() {
      var funcs = h.any_once([function() {
        return "flosstadams"
      }, function() {
        return "pizza pups"
      }])

      funcs[1]().should.be.exactly("pizza pups")
      assert(funcs[0]() === undefined)
      assert(funcs[1]() === undefined)
    })
  })

})
