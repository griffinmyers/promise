module.exports = new function help() {

  this.is_function = function(f) {
    return typeof f === 'function'
  }

  this.is_object = function(o) {
    return typeof o === 'object'
  }

  this.once = function(f) {
    var called = false
    return function() {
      if(!called) {
        called = true
        return f.apply(this, Array.prototype.slice.call(arguments))
      }
    }
  }

  this.any_once = function(funcs) {
    var called = false
    return funcs.map(function(f) {
      return function() {
        if(!called) {
          called = true
          return f.apply(null, Array.prototype.slice.call(arguments))
        }
      }
    })
  }

}()
