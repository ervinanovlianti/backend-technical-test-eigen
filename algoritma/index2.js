function longestWord (sentence) {
    const words = sentence.split(" ");
    let longest = words[0];

    for (let i = 0; i < words.length; i++) {
        if (words[i].length > longest.length) {
            longest = words[i];
        }
    }
    return longest;
}
const sentence = "Saya sangat senang mengerjakan soal algoritma";
const longestWordInSentence = longestWord(sentence);
console.log(`${longestWordInSentence} = ${longestWordInSentence.length} karakter`);

// Cara 2
function longestWord(sentence) {
    const words = sentence.split(' ');
    let longest = '';

    for (const word of words)
    {
        if (word.length > longest.length)
        {
            longest = word;
        }
    }

    return longest;
}

const inputSentence = process.argv[2]; // Menggunakan argumen command line sebagai input
const longestWordInInput = longestWord(inputSentence);

if (inputSentence)
{
    console.log("Kata terpanjang:", longestWordInInput);
} else
{
    console.log("Tidak ada input kalimat.");
}