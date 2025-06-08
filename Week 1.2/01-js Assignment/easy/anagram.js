/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.
*/

/*
  const normalize = (str) => str.toLowerCase().split('').sort().join('');
  This is an arrow function in JavaScript that transforms a string to a normalized form — useful for checking anagrams. Here’s what each part does:

  🔹 What it means:
1. const normalize =
      You're creating a constant variable named normalize and assigning it a function.

2. (str) => ...
      This defines a function that takes one parameter, called str.

3. str.toLowerCase().split('').sort().join('')
      This is the body of the function — what it does with str.

4. Since there's no curly braces {}, it's an implicit return, which means:
      whatever comes after the arrow (=>) is automatically returned.


🔹 str.toLowerCase()
Converts the entire string to lowercase to make the comparison case-insensitive.
👉 "Listen" becomes "listen"

🔹 .split('')
Splits the string into an array of characters.
👉 "listen" becomes ['l', 'i', 's', 't', 'e', 'n']

🔹 .sort()
Sorts the array of characters alphabetically.
👉 ['l', 'i', 's', 't', 'e', 'n'] becomes ['e', 'i', 'l', 'n', 's', 't']

🔹 .join('')
Joins the sorted array of characters back into a single string.
👉 ['e', 'i', 'l', 'n', 's', 't'] becomes "eilnst"

*/

function isAnagram(str1, str2) {
  //Normalize both strings: lowercase and remove non-letter characters if needed
  const normalize = (str) => str.toLowerCase().split('').sort().join('');
  return normalize(str1) === normalize(str2);
}


/*optimised way :->

function isAnagram(str1, str2) {
  // If lengths don't match, can't be anagrams
  if (str1.length !== str2.length) return false;

  const count = {};

  // Count characters in str1
  for (let char of str1.toLowerCase()) {
    count[char] = (count[char] || 0) + 1;
  }

  // Subtract character counts using str2
  for (let char of str2.toLowerCase()) {
    if (!count[char]) return false; // char missing or used too many times
    count[char]--;
  }

  return true;
}

*/


module.exports = isAnagram;
