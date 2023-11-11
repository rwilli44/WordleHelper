"set strict";
import {
  form,
  eliminated_letters,
  correct_position,
  incorrect_position,
  find_button,
  reset_button,
  word_list,
} from "./modules/const.js";

import { find_word } from "./modules/funcs.js";

var list_elim_letters, list_correct_pos, list_incorrect_pos;
var incorrect_dict = {};
var correct_list = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

find_button.addEventListener("click", () => {
  let pattern_elim_letters = /^[a-zA-Z](?:,\s*[a-zA-Z])*$/;
  let pattern_letter_pos = /^[a-zA-Z]:[1-5](,\s*[a-zA-Z]:[1-5])*$/;
  if (pattern_elim_letters.test(eliminated_letters.value)) {
    list_elim_letters = eliminated_letters.value;
    list_elim_letters = list_elim_letters.replaceAll(" ", "");
    list_elim_letters = list_elim_letters.split(",");
  }
  if (pattern_letter_pos.test(correct_position.value)) {
    let pos_pairs = correct_position.value.split(",");
    for (let i in pos_pairs) {
      var pair_info = pos_pairs[i];
      pair_info = pair_info.replaceAll(" ", "");
      pair_info = pair_info.split(":");
      correct_list.push(pair_info);
    }
  }
  if (pattern_letter_pos.test(incorrect_position.value)) {
    let pos_pairs = incorrect_position.value.split(",");
    for (let i in pos_pairs) {
      var pair_info = pos_pairs[i];
      pair_info = pair_info.replaceAll(" ", "");
      pair_info = pair_info.split(":");
      incorrect_dict[pair_info[0]] = pair_info[1];
    }
  }
  let possible_words = find_word(
    list_elim_letters,
    correct_list,
    incorrect_dict
  );
  console.log(possible_words);
});

reset_button.addEventListener("click", () => {
  console.log("reset");
});
