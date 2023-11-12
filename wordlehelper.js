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
  all_guesses,
  all_guess_inputs,
  all_ps,
} from "./modules/const.js";

import { find_word } from "./modules/funcs.js";

var list_elim_letters;
var incorrect_list = [];
var correct_list = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

// ****************** Change the number of guesses ****************** //
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

// ****************** Change the color of a letter ****************** //
guesses_section.addEventListener("click", function (event) {
  // Get the target element that was clicked
  var clickedElement = event.target;
  if (clickedElement.localName == "p") {
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

// ****************** Show Input in Letter Tiles ****************** //
guesses_section.addEventListener("input", function (event) {
  // Get the target element that was clicked
  var inputElement = event.target;
  let row = inputElement.parentElement;
  let j = 0;
  for (const child of row.children) {
    if (child.localName == "p" && j < inputElement.value.length) {
      child.textContent = inputElement.value[j].toUpperCase();
      j++;
    } else if (child.localName == "p") {
      child.textContent = "";
    }
  }
});

// ****************** Find Possible Words ****************** //
find_button.addEventListener("click", () => {
  let pattern_elim_letters = /^[a-zA-Z](?:,\s*[a-zA-Z])*$/;
  let pattern_letter_pos = /^[a-zA-Z]:[1-5](,\s*[a-zA-Z]:[1-5])*$/;
  let alpha_regex = /^[a-zA-Z]+$/;
  let number_guesses = parseInt(num_guesses.value);
  let valid_guess_rows = [];
  for (let i = 0; i < number_guesses; i++) {
    let guess = all_guesses[i].childNodes[2].value;
    if (guess.length == 5 && alpha_regex.test(guess)) {
      valid_guess_rows.push(all_guesses[i]);
    }
  }
  let p_colors = [];
  for (let i in valid_guess_rows) {
    let row = valid_guess_rows[i];
    let word = row.childNodes[2].value.toLowerCase();
    for (let p = 4; p <= 12; p += 2) {
      bgColor = row.childNodes[p].style.backgroundColor;
      if (bgColor) {
        p_colors.push(bgColor);
      } else {
        p_colors.push("lightgrey");
      }
    }
  }
  console.log(p_colors);
});

// if (pattern_elim_letters.test(eliminated_letters.value)) {
//   list_elim_letters = eliminated_letters.value;
//   list_elim_letters = list_elim_letters.replaceAll(" ", "");
//   list_elim_letters = list_elim_letters.split(",");
// }
// if (pattern_letter_pos.test(correct_position.value)) {
//   let pos_pairs = correct_position.value.split(",");
//   for (let i in pos_pairs) {
//     var pair_info = pos_pairs[i];
//     pair_info = pair_info.replaceAll(" ", "");
//     pair_info = pair_info.split(":");
//     correct_list.push(pair_info);
//   }
// }
// if (pattern_letter_pos.test(incorrect_position.value)) {
//   let pos_pairs = incorrect_position.value.split(",");
//   for (let i in pos_pairs) {
//     var pair_info = pos_pairs[i];
//     pair_info = pair_info.replaceAll(" ", "");
//     pair_info = pair_info.split(":");
//     incorrect_list.push(pair_info);
//   }
// }

// let possible_words = find_word(
//   list_elim_letters,
//   correct_list,
//   incorrect_list
// );
// console.log(possible_words);
// });

// ****************** Reset the Page - TO DO  ****************** //
reset_button.addEventListener("click", () => {
  num_guesses.value = 1;
  for (let i = 0; i < 5; i++) {
    all_guess_inputs[i].value = "";
  }
  for (let i = 0; i < 25; i++) {
    all_ps[i].innerText = "";
  }

  for (let i = 1; i <= 4; i++) {
    all_guesses[i].style.display = "None";
  }
});
