//https://viblo.asia/p/synchronous-va-asynchronous-trong-javascript-WAyK8LqnKxX

// setTimeout(() => {
//     console.log('Timer is done!');
// }, 2); // this is an asynchronous code

// console.log('Hello!');
// console.log('Hi!');

//output:
// Hello!
// Hi!
// Timer is done!
// this is because the setTimeout() is an asynchronous code, it will be executed after the synchronous code

/*
const fetchData = callback => {
    setTimeout(() => {
        callback('Done!');
    }, 1500);
};

setTimeout(() => {
    console.log('Timer is done!');
    fetchData(text => {
        console.log(text);
    });
}, 2000);

console.log('Hello!');
console.log('Hi!');
*/

//output:
// Hello!
// Hi!
// Timer is done!
// Done!

const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done!');
        }, 1500);
    });
    return promise;
}

setTimeout(() => {
    console.log('Timer is done!');
    fetchData()
        .then(text => {
            console.log(text);
            return fetchData(); // this is a promise chaining if you want to execute multiple promises
        })
        .then(text2 => {
            console.log(text2);
        });
}, 2000);

console.log('Hello!');
console.log('Hi!');

//output:
// Hello!
// Hi!
// Timer is done!
// Done!
// Done!


