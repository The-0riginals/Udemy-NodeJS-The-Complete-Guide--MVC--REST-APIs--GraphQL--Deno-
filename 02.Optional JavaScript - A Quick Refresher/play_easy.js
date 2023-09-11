var name = "Max";
let age = 29;
const hasHobbies = true;
console.log(name);

var name = "Maximilian"; // var can be redeclared
age = 30;

const summarizeUser = (userName, userAge, userHasHobby) => {
  return (
    "Name is " +
    userName +
    ", age is " +
    userAge +
    " and the user has hobbies: " +
    userHasHobby
  );
  // the difference between "=>"" and function() is that the former does not bind the 'this' keyword
}

const add = (a, b) => a + b; // if the function body is only one line, you can omit the curly braces and the return statement
const addOne = a => a + 1; // if the function only has one argument, you can omit the parentheses
const addRandom = () => 1 + 2; // if the function has no arguments, you need to keep the parentheses

console.log(add(1, 2));
console.log(addOne(1));
console.log(addRandom());
console.log(summarizeUser(name, age, hasHobbies));
