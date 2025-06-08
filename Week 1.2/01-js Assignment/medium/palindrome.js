/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.
*/


/* 
  .replace(/[^a-z0-9]/g, '')
  This uses a regular expression to remove unwanted characters.

Let’s break the regex down:

  🔸 /[^a-z0-9]/g

  🔸/.../ → regex pattern delimiters

  🔸[^a-z0-9] → this means:
      ^ inside [] means "not"
      a-z → lowercase letters
      0-9 → digits
      So [^a-z0-9] matches anything that is not a letter or a digit

  🔸.replace(..., '')

  🔸replace(...) replaces the matched characters with something else
  
  🔸'' → empty string (i.e., delete them)
  
  🔸g flag means global → replace all matches, not just the first one
*/

function isPalindrome(str) {
  str = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let i=0, j=str.length - 1;
  while(i<j){
    if(str[i]!=str[j]) return false;
    i++;
    j--;
  }
  return true;
}

module.exports = isPalindrome;
