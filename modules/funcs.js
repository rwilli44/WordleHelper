"set strict";
import { word_list } from "./const.js";

export function find_word(list_elim_letters, correct_dict, incorrect_dict) {
  let possible_words = ["test"];
  console.log(possible_words);
  for (var i in word_list) {
    var word = word_list[i].toUpperCase();
    var has_eliminated_letters = check_eliminated(word, list_elim_letters);
    var correct_letters_in_place = check_correct_pos(word, correct_dict);
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
    if (word.includes(list_elim_letters[letter].trim())) {
      return true;
    }
  }
  return false;
}

function check_correct_pos(word, correct_dict) {
  for (let key in correct_dict) {
    let letter_pos = parseInt(correct_dict[key]) - 1;
    let word_letter = word[letter_pos];
    if (key.trim() != word_letter) {
      return false;
    }
  }
  return true;
}

function check_incorrect_pos(word, incorrect_dict) {
  for (let key in incorrect_dict) {
    let letter_pos = parseInt(incorrect_dict[key]) - 1;
    let word_letter = word[letter_pos];
    if (key.trim() == word_letter) {
      return true;
    } else if (!word.includes(key.trim())) {
      return true;
    }
  }
  return false;
}
