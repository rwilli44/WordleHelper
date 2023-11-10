"set strict";
import { word_list } from "./const.js";

export function find_word(list_elim_letters, correct_dict, incorrect_dict) {
  var possible_words = ["test"];
  for (var i in word_list) {
    var word = word_list[i].toLocaleUpperCase();
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
  var result = false;
  for (var letter in list_elim_letters) {
    if (word.includes(list_elim_letters[letter])) {
      result = true;
      return result;
    }
    return result;
  }
}

function check_correct_pos(word, correct_dict) {
  var result = true;
  for (let key in correct_dict) {
    if (key != word[parseInt(correct_dict[key]) - 1]) {
      result = false;
      return result;
    }
  }
  return result;
}

function check_incorrect_pos(word, incorrect_dict) {
  var result = false;
  for (let key in incorrect_dict) {
    if (key == word[parseInt(incorrect_dict[key]) - 1]) {
      result = true;
      return true;
    }
  }
  return result;
}
