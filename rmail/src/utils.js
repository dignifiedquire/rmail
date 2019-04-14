export const ALL_TODOS = 'all'
export const ACTIVE_TODOS = 'active'
export const COMPLETED_TODOS = 'completed'

export const uuid = function() {
  /*jshint bitwise:false */
  var i, random
  var uuid = ''

  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }

  return uuid
}

export const pluralize = function(count, word) {
  return count === 1 ? word : word + 's'
}

export const store = function(namespace, data) {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data))
  }

  var store = localStorage.getItem(namespace)
  return (store && JSON.parse(store)) || []
}

export const extend = function() {
  var newObj = {}
  for (var i = 0; i < arguments.length; i++) {
    var obj = arguments[i]
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key]
      }
    }
  }
  return newObj
}
