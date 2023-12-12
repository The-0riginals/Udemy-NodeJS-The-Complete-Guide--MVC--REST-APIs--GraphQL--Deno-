// let color = 'red'; // global scope
// if (color =='red'){ //-> block scope
//  let color = ' blue'; // new variable
// }
// console.log(color); // red

// let color = 'red';

// const name = 'Max'; // global scope
// name = 'Manu'; // error
// console.log(name);

//primitive types: string, number, boolean, null, undefined, symbol(es6), bigint

// var name = 'Max';
// console.log(typeof name); // string
// var age = 29;
// console.log(typeof age); // number
// var hasHobbies = true;
// console.log(typeof hasHobbies); // boolean

// var myAge ;
// console.log(myAge); // undefined
// myAge = null;
// console.log(myAge); // null


//this is hoisting
var person = {
    name: 'Max',
    age: 29,
    hobbies: ['Sports', 'Cooking'],
    greet: function() {
        return ('Hi, I am ' + name2);
    }
};

var name2 = 'Max2';
//ANOYMOUS FUNCTION
// const name = function() {
//     console.log('Max2');
// };

console.log(person.greet());
// coersion: converting one type to another
if (1==true){
    console.log('coersion');
}
else{
    console.log('no coersion');
}

// example of closure
// function retirement(retirementAge){
//     var a = ' years left until retirement';
//     return function(yearOfBirth){
//         var age = 2024 - yearOfBirth;
//         console.log((retirementAge - age) + a);
//     }
// }
// retirement(66)(1990);

//different way of declaring functions
function caculateAge(yearOfBirth){
    return 2024 - yearOfBirth;
}
var age = caculateAge(1990);

// function expression

var whatDoYouDo = function(job, name){
    switch(job){
        case 'teacher':
            return name + ' teaches';
        case 'driver':
            return name + ' drives';
        default:
            return name + ' does something else';
    }
}

console.log(whatDoYouDo('teacher', 'John'));

var whatDoYouDo2 = (job, name) => {
    switch(job){
        case 'teacher':
            return name + ' teaches';
        case 'driver':
            return name + ' drives';
        default:
            return name + ' does something else';
    }
}

// console.log(whatDoYouDo2('teacher', 'John'));
// //example of async /await in es6
// function great(){
//     const greet = 'Hello';
//     setTimeout(() => {
//         console.log(greet);
//     }, 3000);
//     console.log('Hi');
//     setTimeout(() => {
//         console.log('World');
//     }, 6000);
// }
//great();

//map function
// const array1 = [1, 4, 9, 16];
// const map1 = array1.map(x => x * 2);
// console.log(map1);
// const map2= array1.map(x => x * 3).filter(x => x > 10);
// console.log(map2);
// //reduce function
// const array2 = [1, 2, 3, 4];
// const reducer = (accumulator, currentValue) => accumulator + currentValue;
// console.log(array2.reduce(reducer));
// console.log(array2.reduce(reducer, 5));

//callback function
// function greeting(name){
//     console.log('Hello ' + name);
// }
// function processUserInput(callback){
//     var name = 'John';
//     callback(name);
// }
// processUserInput(greeting);

//forEach()
const array3 = ['a', 'b', 'c'];
array3.forEach(element => console.log(element));
