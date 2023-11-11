"set strict";
import {
  form,
  eliminated_letters,
  correct_position,
  incorrect_position,
  find_button,
  reset_button,
  num_guesses,
  guesses_section,
} from "./modules/const.js";

import { find_word } from "./modules/funcs.js";

var list_elim_letters;
var incorrect_list = [];
var correct_list = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

num_guesses.addEventListener("input", () => {
  let number_guesses = parseInt(num_guesses.value);
  let rows_to_add = "";
  let j = 1;
  for (const child of guesses_section.children) {
    if (j <= number_guesses) {
      child.style.display = "block";
    } else {
      child.style.display = "none";
    }
    j++;
  }
});

guesses_section.addEventListener("click", function (event) {
  // Get the target element that was clicked
  var clickedElement = event.target;
  if (clickedElement.localName == "p") {
    console.log(clickedElement.style.backgroundColor);
    let current_bgColor = clickedElement.style.backgroundColor;
    if (current_bgColor == "yellow") {
      clickedElement.style.backgroundColor = "lime";
    } else if (current_bgColor == "lime") {
      clickedElement.style.backgroundColor = "lightgrey";
    } else if (current_bgColor == "" || current_bgColor == "lightgrey") {
      clickedElement.style.backgroundColor = "yellow";
    }
  }
});

guesses_section.addEventListener("input", function (event) {
  // Get the target element that was clicked
  var inputElement = event.target;
  let row = inputElement.parentElement;
  if (inputElement.value.length == 5) {
    let j = 0;
    for (const child of row.children) {
      if (child.localName == "p") {
        console.log(inputElement.value[j]);
        child.textContent = inputElement.value[j];
        j++;
      }
    }
  }
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
      incorrect_list.push(pair_info);
    }
  }

  let possible_words = find_word(
    list_elim_letters,
    correct_list,
    incorrect_list
  );
  console.log(possible_words);
});

reset_button.addEventListener("click", () => {
  console.log("reset");
});
