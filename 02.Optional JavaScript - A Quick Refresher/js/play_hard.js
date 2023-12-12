const person = {
    name: 'Max', // a key-value is a property or fields of an object
    age: 29,
    greet() {
        console.log('Hi, I am ' + this.name);
    }
};
person.greet();

const hobbies = ['Sports', 'Cooking'];
for (let hobby of hobbies) {
    console.log(hobby);
}
// console.log(hobbies.map(hobby => 'Hobby: ' + hobby));
// console.log(hobbies);
// hobbies.push('Programming');
// console.log(hobbies);
const copiedArray = hobbies.slice(); // copy an array using slice()
let copiedArray2 = [hobbies]; // this is a nested array, the same object not a copy can be freely modified

copiedArray2[0].push('Programming'); // this will change the original array
console.log(hobbies);
console.log(copiedArray2);

//const copiedArray = [...hobbies]; // this is a spread operator
// const copiedPerson = {...person}; // this is a spread operator
// console.log(copiedPerson);
const toArray = (...args) => { // this is a rest operator: it takes all the arguments and put them into an array
    return args;
};
console.log(toArray(1, 2, 3, 4));
