"set strict";
import {
  form,
  find_button,
  reset_button,
  num_of_guesses,
  guesses_section,
  all_guess_rows,
  all_guess_inputs,
  number_found_p,
  words_found_p,
  reveal_button,
  letter_squares,
} from "./modules/const.js";

import { find_word, remove_duplicates } from "./modules/funcs.js";

var list_elim_letters = [];
var incorrect_list = [];
var correct_list = [];
var list_previous_words = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

function clear_results() {
  number_found_p.innerText = "";
  words_found_p.innerText = "";
  reveal_button.style.display = "None";
}

function reset_letter_squares() {
  for (let i = 0; i < 25; i++) {
    letter_squares[i].style.backgroundColor = "lightgrey";
  }
}

// ****************** Change the number of guesses ****************** //
num_of_guesses.addEventListener("input", () => {
  clear_results();
  let number_guesses = parseInt(num_of_guesses.value);
  let j = 1;

  for (const child of guesses_section.children) {
    console.log();
    if (j <= number_guesses) {
      child.style.display = "flex";
    } else {
      child.style.display = "none";

      child.childNodes[2].value = "";
      for (let p = 1; p <= 9; p += 2) {
        child.childNodes[3].childNodes[p].innerText = "";
        child.childNodes[3].childNodes[p].style.backgroundColor = "lightgrey";
      }
    }
    j++;
  }
  if (number_found_p.innerText.length != 0) {
    clear_results();
  }
});

// ****************** Change the color of a letter ****************** //
guesses_section.addEventListener("click", function (event) {
  if (number_found_p.innerText.length != 0) {
    clear_results();
  }
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
  if (number_found_p.innerText.length != 0) {
    clear_results();
  }
  // Get the target element that was clicked
  var inputElement = event.target;
  let row = inputElement.parentElement.parentElement;
  let alpha_regex = /^[a-zA-Z]+$/;
  if (!alpha_regex.test(inputElement.value)) {
    for (const child of row.children) {
      if (child.localName == "p") {
        child.textContent = "";
        child.style.backgroundColor = "lightgrey";
        return null;
      }
    }
  }
  let j = 0;
  for (const child of row.childNodes[3].children) {
    if (child.localName == "p" && j < inputElement.value.length) {
      child.textContent = inputElement.value[j].toUpperCase();
      child.style.backgroundColor = "lightgrey";
      j++;
    } else if (child.localName == "p") {
      child.textContent = "";
      child.style.backgroundColor = "lightgrey";
    }
  }
});

// ****************** Find Possible Words ****************** //
find_button.addEventListener("click", () => {
  let alpha_regex = /^[a-zA-Z]+$/;
  let number_guesses = parseInt(num_of_guesses.value);
  let valid_guess_rows = [];
  for (let i = 0; i < number_guesses; i++) {
    let guess = all_guess_rows[i].childNodes[1].childNodes[2].value;
    if (guess.length == 5 && alpha_regex.test(guess)) {
      valid_guess_rows.push(all_guess_rows[i]);
    }
  }
  let p_colors = [];
  for (let i in valid_guess_rows) {
    let row = valid_guess_rows[i];
    let word = row.childNodes[1].childNodes[2].value.toLowerCase();
    for (let p = 1; p <= 9; p += 2) {
      let bgColor = row.childNodes[3].childNodes[p].style.backgroundColor;
      if (bgColor) {
        p_colors.push(bgColor);
      } else {
        p_colors.push("lightgrey");
      } ///problem here is that p_colors doesn't reset with each row, fix this!
    }
    for (let i = 0; i < 5; i++) {
      if (p_colors[i] == "yellow") {
        add_to_list(incorrect_list, [word[i], i]);
        // incorrect_list.push();
      } else if (p_colors[i] == "lime") {
        add_to_list(correct_list, [word[i], i]);

        // correct_list.push([word[i], i]);
      } else {
        add_to_list(list_elim_letters, word[i]);

        // list_elim_letters.push(word[i]);
      }
    }
    p_colors = [];
  }

  let possible_words = find_word(
    list_elim_letters,
    correct_list,
    incorrect_list
  );

  insert_results(possible_words);
  list_elim_letters = [];
  correct_list = [];
  incorrect_list = [];
  list_previous_words = Array.from(possible_words);
  possible_words = [];
});

function insert_results(words_found) {
  number_found_p.innerText = `${words_found.length} words were found. Would you like to reveal them ?`;
  reveal_button.style.display = "block";
}

reveal_button.addEventListener("click", () => {
  let result = "";
  for (let word in list_previous_words) {
    result += list_previous_words[word] + ", ";
  }
  words_found_p.innerText = result.substring(0, result.length - 2);
});

function add_to_list(list, element) {
  let list_string = list.toString();
  let element_string = element.toString();
  if (list_string.indexOf(element_string) < 0) {
    list.push(element);
  }
}
// ****************** Reset the Page - TO DO  ****************** //
reset_button.addEventListener("click", () => {
  reset_input();
  reset_letter_squares();
  clear_results();
});

window.onload = reset_input();
function reset_input() {
  num_of_guesses.value = 1;
  for (let i = 0; i < 5; i++) {
    all_guess_inputs[i].value = "";
  }
  for (let i = 0; i < 25; i++) {
    letter_squares[i].innerText = "";
  }

  for (let i = 1; i <= 4; i++) {
    all_guess_rows[i].style.display = "None";
  }
}
