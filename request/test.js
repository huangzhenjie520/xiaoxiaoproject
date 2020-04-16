const obj1 = {
  a: "s",
  b: 321,
  c: 456,
  d: 654
};
const obj2 = { ...obj1, a: 1 + obj1.a };
console.log(obj2);
