var h = require('../lib/help.js')
var assert = require('assert')

describe('Help', function(){
  describe("#is_function()", function() {
    it('works', function() {
      assert(!h.is_function(2))
      assert(h.is_function(function(){}))
    })
  })
})

describe('Help', function(){
  describe("#is_object()", function() {
    it('works', function() {
      assert(!h.is_object(2))
      assert(h.is_object({'hey': 'breh'}))
    })
  })
})

describe('Help', function(){
  describe("#once()", function() {
    it('allows me to call a function only once', function() {
      lilb = h.once(function(){
        return "based god"
      })

      assert(lilb() === "based god")
      assert(lilb() === undefined)
    })
  })
})

describe('Help', function(){
  describe("#any_once()", function() {
    it('allows me to call any function only once', function() {
      var funcs = h.any_once([function() {
        return "flosstadams"
      }, function() {
        return "pizza pups"
      }])

      assert(funcs[1]() === "pizza pups")
      assert(funcs[0]() === undefined)
      assert(funcs[1]() === undefined)
    })
  })
})
