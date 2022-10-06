import MyPromise from './p.js';

// test error
// const custom = new MyPromise(() => {
//   throw new Error("custom 错误");
// })
// custom.then(() => {}, (reason) => {
//   console.log(reason);
// });

// const native = new Promise(() => {
//   throw new Error("native 错误");
// })
// native.then(() => {}, (reason) => {
//   console.log(reason);
// })

// test then参数
// const custom = new MyPromise((resolve) => {
//   resolve("Hello");
// })
// const native = new Promise((resolve) => {
//   resolve("World");
// })
// custom.then(undefined, (reason) => {
//   console.log(reason);
// })
// native.then(undefined, (reason) => {
//   console.log(reason);
// })

//测试异步
// console.log("start")
// const promise = new MyPromise((resolve, reject) => {
//   console.log("custom promise")
//   resolve("custom");
// });
// const native = new Promise((resolve, reject) => {
//   console.log("native promise")
//   resolve("native");
// })

// native.then((value) => {
//   console.log(value);
// })

// setTimeout(() => {
//   console.log("测试顺序")
// })

// promise.then((value) => {
//   console.log(value);
// })

// 测试顺序 多次then
console.log(1)
const promise = new Promise((resolve) => { // new Promise
  console.log(2)
  setTimeout(() => {
    console.log('A');
    resolve('B');
    console.log('C');
  })
})

promise.then((value) => {
  console.log('D');
  console.log(value);
})

setTimeout(() => {
  console.log('Z');
})

promise.then((value) => {
  console.log('E');
  console.log(value);
})
console.log(3);
