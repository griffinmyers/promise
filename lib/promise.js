var h = require('./help.js')

function Promise() {
  this.state = 'pending'
  this.value = undefined
  this.reason = undefined
  this.on_fulfilled = []
  this.on_rejected = []
  this.fulfill = h.once(function(v) {
    var self = this
    self.state = 'fulfilled'
    self.value = v
    process.nextTick(function(){
      self.on_fulfilled.map(function(f) {
        f.exec(v)
      })
      self.on_fulfilled = []
    })
  })
  this.reject = h.once(function(r) {
    var self = this
    self.state = 'rejected'
    self.reason = r
    process.nextTick(function() {
      self.on_rejected.map(function(f) {
        f.exec(r)
      })
      self.on_rejected = []
    })
  })
}

Promise.prototype = {
  then: function(on_fulfilled, on_rejected) {
    var self = this
    var next = new Promise()

    if(self.state === 'pending') {
      self.on_fulfilled.push(new Fulfiller(on_fulfilled, next))
      self.on_rejected.push(new Rejector(on_rejected, next))
    }
    else if(self.state === 'fulfilled') {
      process.nextTick(function() {
        new Fulfiller(on_fulfilled, next).exec(self.value)
      })
    }
    else if(self.state === 'rejected') {
      process.nextTick(function() {
        new Rejector(on_rejected, next).exec(self.reason)
      })
    }

    return next
  }
}

function Fulfiller(f, p) {
  this.next = p
  this.callback = h.is_function(f) ? h.once(f) : f
  this.on_value = function(v) {
    p.fulfill(v)
  }
}

function Rejector(f, p) {
  this.next = p
  this.callback = h.is_function(f) ? h.once(f) : f
  this.on_value = function(v) {
    p.reject(v)
  }
}

Fulfiller.prototype = Rejector.prototype = {
  "exec": function(v) {
    if(h.is_function(this.callback)) {
      try {
        var x = this.callback.call(null, v)
        if(x !== undefined) {
          resolve(this.next, x)
        }
      }
      catch(e) {
        this.next.reject(e)
      }
    }
    else {
      this.on_value(this.callback)
    }
  }
}

function resolve(promise, x) {

  if(promise === x) {
    promise.reject(new TypeError("Resolving promise with itself."))
    return
  }

  if(x instanceof Promise) {
    x.then(function(value) {
      resolve(promise, value)
    }, function(reason) {
      promise.reject(reason)
    })
    return
  }

  if(h.is_function(x) || h.is_object(x)) {

    try {
      var then = x.then
    }
    catch(e) {
      promise.reject(e)
    }

    if(h.is_function(then)) {

      callbacks = h.any_once([function(y) {
        resolve(promise, y)
      }, function(r) {
        promise.reject(r)
      }])

      try {
        then.call(x, function(y) {
          callbacks[0](y)
        }, function(r) {
          callbacks[1](r)
        })
      }
      catch(e) {
        promise.reject(e)
      }
    }
    else {
      promise.fulfill(then)
    }

  }

  promise.fulfill(x)
}

module.exports = Promise
