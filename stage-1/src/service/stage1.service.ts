import { AnalyzedString } from "../model/stage1.model";

function palindrome(value:string) : boolean {
  
  if (typeof value !== 'string') {
    throw new Error("Invalid data type for 'value', (must be string).")
  }

  const cleaned = value.toLocaleLowerCase();
  let reversed = cleaned.split('').reverse().join('');

  return cleaned == reversed;
} 

function frequencyOfCharacters(value:string) : {[key:string]: number} {
  const frequencyHash: {[key:string]: number} = {};

  for (const char of value) {
    if (char in frequencyHash){
      frequencyHash[char] =  (frequencyHash[char] ?? 0) + 1;
    } else {
      frequencyHash[char] = 1;
    }
  }

  return frequencyHash
}

function uniqueCharacters(value: string) : number {

  const frequency = frequencyOfCharacters(value);
  let count = 0;

  for (const char in frequency) {
    if (frequency[char] === 1) {
      count += 1;
    }
  }

  return count;
}

function lengthOfCharacters(value:string) : number {
  return value.length;
}

function wordCount(value:string) : number {
  if (typeof value !== 'string'){
    throw new Error("Input must be a string");
  }

  const words = value.trim().split(/\s+/);
  return words.length;

}