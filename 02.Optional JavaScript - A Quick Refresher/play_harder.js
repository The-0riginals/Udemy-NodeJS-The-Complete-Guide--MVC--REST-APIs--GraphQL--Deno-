const person = {
    name: 'Max', // a key-value is a property or fields of an object
    age: 29,
    greet() {
        console.log('Hi, I am ' + this.name);
    }
};

const printName = ({ name }) => { // this is a destructuring : it takes the name property of the object inside {}: curly braces are used to destructure an object
    console.log(name);
}

printName(person);

const { name, age } = person; // this is a destructuring : it takes the name and age properties of the object
console.log(name, age);

const hobbies = ['Sports', 'Cooking', 'Programming'];
const [hobby1, hobby2] = hobbies; // this is a destructuring : it takes the first and second elements of the array
console.log(hobby1, hobby2);

//destructuring allows you to pull out single elements or properties(access element) and store them in variables for arrays and objects
