function countWordsInArray(inputArray, queryArray) {
    const result = [];

    for (let i = 0; i < queryArray.length; i++)
    {
        const word = queryArray[i];
        const count = inputArray.filter(item => item === word).length;
        result.push(count);
    }

    return result;
}

const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];

const output = countWordsInArray(INPUT, QUERY);
console.log(output);