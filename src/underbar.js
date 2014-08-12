/*jshint eqnull:true, expr:true*/

// ===== ===== =====  Shortcuts ===== ===== ===== 
  var ArrayProto = Array.prototype;
// ===== ===== ===== End Shortcuts ===== ===== ===== 

var _ = {};

(function() {

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return val;
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    if (n === undefined){
      return array[array.length-1];
    } 
    else if (n > array.length) {
      return array;
    } 
    else {
      return array.slice(array.length - n); 
    }
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function(collection, iterator) {
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }  
    } else {
      for (var item in collection) {
        iterator(collection[item], item, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var filtered = [];

    _.each(collection, function(item){
      if (test(item)) {
        filtered.push(item);
      }
    });

    return filtered;
  };

  var not = function(func) {
    return function(){
      return !func.apply(null, arguments);
    };
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    // TIP: see if you can re-use _.filter() here, without simply
    // copying code in and modifying it

    return _.filter(collection, not(test));
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
    var uniqueObj = {};

    return _.reject(array, function(v){
      var exists = uniqueObj[v];
      uniqueObj[v] = true;
      return exists;
    });
  };

  // Return the results of applying an iterator to each element.
  _.map = function(array, iterator) {
    // map() is a useful primitive iteration function that works a lot
    // like each(), but in addition to running the operation on all
    // the members, it also maintains an array of results.
    var mapped = [];

    _.each(array, function(item) {
      mapped.push(iterator(item))
    });
      // *** I did not account for objects here!!!
    return mapped;
  };

  /*
   * TIP: map is really handy when you want to transform an array of
   * values into a new array of values. _.pluck() is solved for you
   * as an example of this.
   */

  // Takes an array of objects and returns an array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(array, propertyName) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(array, function(value){
      return value[propertyName];
    });
  };

  // Calls the method named by methodName on each value in the list.
  // Note: you will nead to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {

    //var args = Array.prototype.slice.call(arguments, 2);
    var isFunc = isFunction(functionOrKey);
    
    return _.map(collection, function(value) {
      return (isFunc ? functionOrKey : value[functionOrKey]).apply(value, args);
    });

  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(previousValue, item) for each item. previousValue should be
  // the return value of the previous iterator call.
  //
  // You can pass in an initialValue that is passed to the first iterator
  // call. If initialValue is not explicitly passed in, it should default to the
  // first element in the collection.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  _.reduce = function(collection, iterator, accumulator) {

    var initialValue = accumulator === undefined ? collection.shift() : accumulator;

    _.each(collection, function(item, key, list){
      initialValue = iterator(initialValue, item)
    })

    return initialValue;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };

  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    // TIP: Try re-using reduce() here.
      return _.reduce(collection, function(everyOne, item) {
        var test = iterator ? (!iterator(item)) : (!item)
        if (test) {
          return false;
        }
        return everyOne
      }, true);
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.
      return _.reduce(collection, function(everyOne, item) {
        var test = iterator ? (iterator(item)) : (item);

        if (test) {
          return true;
        }
        return everyOne
      }, false);
  }; 


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {
    var args = Array.prototype.slice.call(arguments, 0);

    return _.reduce(args, function(newObj, item){
      for (var key in item) {
        newObj[key] = item[key];
      }
      return newObj
    })
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    var args = Array.prototype.slice.call(arguments, 0);

    return _.reduce(args, function(newObj, item){
      for (var key in item) {
        if(!newObj.hasOwnProperty(key)){
          newObj[key] = item[key];
        }
      }
      return newObj;
    })
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // information from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memoize an expensive function by storing its results. You may assume
  // that the function takes only one argument and that it is a primitive.
  //
  // _.memoize should return a function that when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) { 
    //var result = _.once(func)
    //return result
    return function() {
      if(!func.cache) {
        func.cache = {};
        //console.log('creating new cache');
      }

      if (func.cache[arguments[0]]) { 
        //console.log(arguments[0]);
        //console.log('found cache at: ' + arguments[0]);
        //console.log('current cache...');
        //console.log(func.cache);
        return func.cache[arguments[0]]
      } else {
        func.cache[arguments[0]] = func.apply(this, arguments)
        //console.log('setting new cache');
        //console.log(func.cache[arguments[0]]);
        return func.cache[arguments[0]]
      }
    }
  };

 
  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var args = Array.prototype.slice.call(arguments,0);
    args.shift(); args.shift();

    setTimeout(function(){
      func.apply(this, args)
    }, wait)
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
    var args = Array.prototype.slice.call(array,0);
    var shuffled = [];

    for (var i = 0; i < array.length; i++) {
      var take = Math.floor(Math.random() * (args.length) )
      shuffled.push(args.splice(take,1).join())
    };

    return shuffled  
  };


  /**
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */


  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
    var str;

    if (typeof iterator === 'string') {
      var str = iterator;
      iterator = function(item){
        return item[str];
      } 
    }

    collection.sort(function(a,b){
      return iterator(a) - iterator(b)
    }) 

    return collection;

//    if (typeof iterator === 'string') {
//      collection.sort(function(a,b) {
//        if (a[iterator] > b[iterator])
//            return 1;
//        if (a[iterator] < b[iterator])
//            return -1;
//        return 0;
//      })
//    } else {
//      collection.sort(function(a,b){
//        if (iterator(a) > iterator(b))
//            return 1;
//        if (iterator(a) < iterator(b))
//            return -1;
//        return 0;
//      }) 
//    }
//    return collection 
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {

    var args  = Array.prototype.slice.call(arguments,0);
    var max = 0;
    var zipped = [];

    // Find max of all arrays 
    _.each(args, function(item, key){
      max = item.length > max ? item.length : max;
    })
    
    //push to tempArrays that push to zipped
    for (var i = 0; i < max; i++) {
      var tempArray = [];
      for (var j = 0; j < args.length; j++) {
        
        if (args[j][i] == undefined) {
          tempArray.push(undefined)
        } else { 
          tempArray.push(args[j][i]) 
        }

      };
      zipped.push(tempArray)
    };

    return zipped
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
    var flatted = [];

    var flattenAction = function(array){
      if ( Array.isArray(array) ) {
        //console.log("Array Alert!!!")
        _.each(array, function(item, key) {
          if ( Array.isArray(item) ) {
            flattenAction(item); // Recursion
          }
          else{
            //console.log("Pushing: " + array[key])
            flatted.push(array[key])
          }
        })
      };
    }

    flattenAction(nestedArray);
    return flatted
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function(arrays) {
      var args = Array.prototype.slice.call(arguments,0);
      var all = _.uniq(Array.prototype.concat.apply(
        ArrayProto, ArrayProto.slice.call(arguments, 0)))
      var intersection = _.uniq(Array.prototype.concat.apply(
        ArrayProto, ArrayProto.slice.call(arguments, 0)))

      _.each(all, function(item, key){
        //console.log("testing " + item +" & "+ key)
        for (var i = 0; i < args.length; i++) {
          //console.log(args[i])
          if (!_.contains(args[i], item)) {
            intersection.splice(intersection.indexOf(item),1)
          };
        };
      })
      
      return intersection
      //ArrayProto is defined on top
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var restArray = ArrayProto.concat.apply(ArrayProto, ArrayProto.slice.call(arguments, 1));
    var baseArray = arguments[0];

    return _.filter(array, function(item) {
      return !_.contains(restArray, item)
      }); 

    //ArrayProto is defined on top
  };


  /**
   * MEGA EXTRA CREDIT
   * =================
   */

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  //
  // See the Underbar readme for details.
  _.throttle = function(func, wait) {

    var funcs = [], 
      locked = false,
      lastval = undefined;

    var unlock  = function () { 
      locked  = false; 
    };
    
    var runFunc = function () {
      setTimeout(unlock, wait);
      locked  = true;
      lastval = func.apply(this, arguments);
      return lastval;
    }

    return function () {
        if (!locked) {
          return runFunc();
        } else {
          funcs.push(true);
          var timer = setInterval(function(){
            if (!locked) {
              funcs.shift();
              clearInterval(timer)
              runFunc();
            };
          }, 1)
          return lastval;
        }
    };
  };


  _.throttle_things = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // information from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

}).call(this);
