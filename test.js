P = require('./promise.js')

p = new P()

p.then(function(value) {
  return value + 2
}, function(reason) {
  console.log(reason)
}).then(function(value){
  console.log(value)
})

p.fulfill(1)