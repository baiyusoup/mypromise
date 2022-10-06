class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.PromiseState = MyPromise.PENDING;
    this.PromiseResult = null;
    this.onfulfilledQueue = [];
    this.onrejectedQueue = [];
    // 在执行函数里抛出错误时，会触发then方法的第二个参数
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch(e) {
      this.reject(e);
    }
  }
  resolve(value) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.FULFILLED;
      this.PromiseResult = value;
      this.onfulfilledQueue.forEach(fn => fn(this.PromiseResult));
    }
  }
  reject(reason) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.REJECTED;
      this.PromiseResult = reason;
      this.onrejectedQueue.forEach(fn => fn(this.PromiseResult));
    }
  }
  then(onfulfilled, onrejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.PromiseState === MyPromise.PENDING) {
        this.onfulfilledQueue.push(() => {
          queueMicrotask(() => {
            try {
              if (typeof onfulfilled !== 'function') {
                resolve(this.PromiseResult);
              } else {
                const x = onfulfilled(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch(e) {
              reject(e);
            }
          })
        });
        this.onrejectedQueue.push(() => {
          queueMicrotask(() => {
            try {
              if (typeof onrejected !== 'function') {
                reject(this.PromiseResult);
              } else {
                const x = onrejected(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch(e) {
              reject(e);
            }
          })
        });
      }
      if (this.PromiseState === MyPromise.FULFILLED) {
        queueMicrotask(() => {
          try {
            if (typeof onfulfilled !== 'function') {
              resolve(this.PromiseResult);
            } else {
              const x = onfulfilled(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch(e) {
            reject(e);
          }
        })
      }
      if (this.PromiseState === MyPromise.REJECTED) {
        queueMicrotask(() => {
          try {
            if (typeof onrejected !== 'function') {
              reject(this.PromiseResult);
            } else {
              const x = onrejected(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch(e) {
            reject(e);
          }
        })
      }
    })
    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    throw new TypeError('Chaining cycle detected for promise');
  }

  if (x instanceof MyPromise) {
    x.then(_x => {
        resolvePromise(promise2, _x, resolve, reject)
    }, reject);
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      var then = x.then;
    } catch (e) {
      return reject(e);
    }

    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(
          x,
          _x => {
            if (called) return;
            called = true;
            resolvePromise(promise2, _x, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        )
      } catch(e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  } else {
    return resolve(x);
  }
}
MyPromise.deferred = function () {
  let result = {};
  result.promise = new MyPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  })
  return result;
}

// export default MyPromise;
module.exports = MyPromise;