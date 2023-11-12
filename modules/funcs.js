"set strict";
import { letter_squares, word_list } from "./const.js";

export function find_word(list_elim_letters, correct_list, incorrect_dict) {
  let possible_words = [];
  for (var i in word_list) {
    var word = word_list[i];
    var has_eliminated_letters = check_eliminated(word, list_elim_letters);
    var correct_letters_in_place = check_correct_pos(word, correct_list);
    var letters_in_incorrect_place = check_incorrect_pos(word, incorrect_dict);

    if (
      !has_eliminated_letters &&
      correct_letters_in_place &&
      !letters_in_incorrect_place
    ) {
      possible_words.push(word);
    }
  }
  console.log("Words found: ", possible_words.length);
  return possible_words;
}

function check_eliminated(word, list_elim_letters) {
  for (var letter in list_elim_letters) {
    if (word.includes(list_elim_letters[letter])) {
      return true;
    }
  }
  return false;
}

function check_correct_pos(word, correct_list) {
  for (let i in correct_list) {
    let correct_letter = correct_list[i][0];
    let letter_pos = correct_list[i][1];
    let word_letter = word[letter_pos];

    if (correct_letter != word_letter) {
      return false;
    }
  }
  return true;
}

function check_incorrect_pos(word, incorrect_list) {
  for (let i in incorrect_list) {
    let incorrect_letter = incorrect_list[i][0];
    let letter_pos = incorrect_list[i][1];
    let word_letter = word[letter_pos];
    if (incorrect_letter == word_letter) {
      return true;
    } else if (!word.includes(incorrect_letter)) {
      return true;
    }
  }
  return false;
}

export function remove_duplicates(list) {
  return [...new Set(list)];
}
