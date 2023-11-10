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
var correct_dict = {};

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

find_button.addEventListener("click", () => {
  const pattern_eliminated = /^[a-zA-Z](?:,\s*[a-zA-Z])*$/;
  const pattern_positions = /^[a-zA-Z]:[1-5](,\s*[a-zA-Z]:[1-5])*$/;
  if (pattern_eliminated.test(eliminated_letters.value)) {
    list_elim_letters = eliminated_letters.value.split(",");
  }
  if (pattern_positions.test(correct_position.value)) {
    const pos_pairs = correct_position.value.split(",");
    for (const i in pos_pairs) {
      var pair_info = pos_pairs[i].split(":");
      correct_dict[pair_info[0]] = pair_info[1];
    }
  }
  if (pattern_positions.test(incorrect_position.value)) {
    const pos_pairs = incorrect_position.value.split(",");
    for (const i in pos_pairs) {
      var pair_info = pos_pairs[i].split(":");
      incorrect_dict[pair_info[0]] = pair_info[1];
    }
  }
  var possible_words = find_word(
    list_elim_letters,
    correct_dict,
    incorrect_dict
  );
  console.log(possible_words);
});

reset_button.addEventListener("click", () => {
  console.log("reset");
});
