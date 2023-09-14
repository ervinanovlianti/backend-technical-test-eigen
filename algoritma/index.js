function reverseString (input) {
    let result = "";
    for (let i = input.length -2 ; i >= 0; i--) {
        result += input[i];
    }
    result += input[input.length - 1];
    return result;
}

const inputString = "NEGIE1";
const reversedString = reverseString(inputString);
console.log("Hasil = " + reversedString);

// Cara 2
function reverseString(inputString) {
    // Pisahkan angka dari string
    const matches = inputString.match(/(\D+)(\d+)/);

    if (matches && matches.length === 3)
    {
        const letters = matches[1];
        const number = matches[2];

        // Balik urutan huruf dalam string dan gabungkan dengan angka
        const reversedString = letters.split('').reverse().join('') + number;

        return reversedString;
    } else
    {
        // Jika tidak ada angka di akhir, kembalikan string asli
        return inputString;
    }
}

const input = process.argv[2]; // Menggunakan argumen command line sebagai input
const hasil = reverseString
    (input);

if (hasil)
{
    console.log("Hasil:", hasil);
} else
{
    console.log("Format input tidak sesuai.");
}