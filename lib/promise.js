var h = require('./help.js')

function Promise() {
  this.state = 'pending'
  this.value = undefined
  this.reason = undefined
  this.on_fulfilled = []
  this.on_rejected = []
}

module.exports = Promise

Promise.prototype = {
  then: function(on_fulfilled, on_rejected) {
    var next = new Promise()

    this.on_fulfilled.push(new Fulfiller(on_fulfilled, next))
    this.on_rejected.push(new Rejector(on_rejected, next))

    if(this.state === 'fulfilled') {
      this.fulfill(this.value)
    }
    else if(this.state === 'rejected') {
      this.reject(this.value)
    }

    return next
  },
  fulfill: function(v) {
    var self = this
    if(self.state === 'rejected') {
      throw new TypeError("Promise has already been rejected.")
    }
    self.value = v
    process.nextTick(function(){
      self.on_fulfilled.map(function(f) {
        f.exec(v)
      })
      self.on_fulfilled = []
    })
  },
  reject: function(r) {
    var self = this
    if(self.state === 'fulfilled') {
      throw new TypeError("Promise has already been fulfilled.")
    }
    self.reason = r
    process.nextTick(function() {
      self.on_rejected.map(function(f) {
        f.exec(r)
      })
      self.on_rejected = []
    })
  }
}

function Fulfiller(f, p) {
  this.next = p
  this.callback = h.is_function ? h.once(f) : false
  this.on_value = function(v) {
    p.fulfill(v)
  }
}

function Rejector(f, p) {
  this.next = p
  this.callback = h.is_function ? h.once(f) : false
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
        p.reject(e)
      }
    }
    else {
      this.on_value(v)
    }
  }
}

// Must not be accessible outside this module
//
function resolve(promise, x) {

  if(promise === x) {
    reject(promise, new TypeError("Resolving promise with itself."))
    return
  }

  if(x instanceof Promise) {
    x.then(function(value) {
      resolve(promise, value)
      return
    }, function(reason) {
      reject(promise, reason)
      return
    })
  }

  if(h.is_function(x) || h.is_object(x)) {

    try {
      var then = x.then
    }
    catch(e) {
      reject(promise, e)
      return
    }

    if(h.is_function(then)) {

      callbacks = h.any_once([function(y) {
        resolve(promise, y)
      }, function(r) {
        reject(promise, r)
      }])

      try {
        then.call(x, function(y) {
          callbacks[0](y)
          return
        }, function(r) {
          callbacks[1](r)
          return
        })
      }
      catch(e) {
        reject(promise, e)
        return
      }
    }

  }

  promise.fulfill(x)
}