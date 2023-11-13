"set strict";
import { word_list } from "./wordlist.js";
import {
  num_of_guesses,
  all_guess_inputs,
  letter_squares,
  all_guess_rows,
  number_found_p,
  words_found_p,
  reveal_button,
  rows_letter_tiles,
} from "./const.js";

/*************************** Responding to Input ***************************/

export function show_rows(number_guesses) {
  for (let j = 0; j < number_guesses; j++) {
    all_guess_rows[j].style.display = "flex";
  }
}
export function change_color(clickedElement) {
  if (clickedElement.localName == "p" && clickedElement.innerText != "") {
    let current_bgColor = clickedElement.style.backgroundColor;
    if (current_bgColor == "yellow") {
      clickedElement.style.backgroundColor = "lime";
    } else if (current_bgColor == "lime") {
      clickedElement.style.backgroundColor = "lightgrey";
    } else if (current_bgColor == "" || current_bgColor == "lightgrey") {
      clickedElement.style.backgroundColor = "yellow";
    }
  }
}

export function show_letters(row, inputElement) {
  let alpha_regex = /^[a-zA-Z]+$/;
  let letter_position = 0;
  for (const child of row.childNodes[3].children) {
    if (
      child.localName == "p" &&
      letter_position < inputElement.value.length &&
      alpha_regex.test(inputElement.value)
    ) {
      child.textContent = inputElement.value[letter_position].toUpperCase();
      child.style.backgroundColor = "lightgrey";
      letter_position++;
    } else if (child.localName == "p") {
      child.textContent = "";
      child.style.backgroundColor = "lightgrey";
      letter_position++;
    }
  }
}

/*************************** Clearing Input ***************************/

// Reset all user input
export function reset_input() {
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

// Reset all tiles to grey/blank
export function reset_all_tiles() {
  for (let i = 0; i < 25; i++) {
    letter_squares[i].style.backgroundColor = "lightgrey";
  }
}

// Hide unneeded rows
export function reset_rows(number_guesses) {
  for (let j = number_guesses; j < 5; j++) {
    let row = all_guess_rows[j];
    row.style.display = "none";
    all_guess_inputs[j].value = "";
    reset_row_tiles(j);
  }
}

// Reset a specific row of tiles
export function reset_row_tiles(row_number) {
  for (let p = 0; p < 5; p++) {
    let letter_tile = rows_letter_tiles[row_number].children[p];
    letter_tile.innerText = "";
    letter_tile.style.backgroundColor = "lightgrey";
  }
}

// Remove results
export function clear_results() {
  number_found_p.innerText = "";
  words_found_p.innerText = "";
  reveal_button.style.display = "None";
}

/*************************** Finding Results ***************************/
export function find_word(
  list_elim_letters,
  correct_list,
  incorrect_dict,
  repeat_limits,
  repeat_min_uses
) {
  let possible_words = [];
  for (let i in word_list) {
    let word = word_list[i];
    let has_eliminated_letters = check_eliminated(word, list_elim_letters);
    let correct_letters_in_place = check_correct_pos(word, correct_list);
    let letters_in_incorrect_place = check_incorrect_pos(word, incorrect_dict);
    let repeats_on_target = check_repeat_target(word, repeat_limits);
    let has_min_uses = check_min_uses(word, repeat_min_uses);

    if (
      // if the word passes these 3 tests it is added to the list of possible words
      !has_eliminated_letters &&
      correct_letters_in_place &&
      !letters_in_incorrect_place &&
      repeats_on_target &&
      has_min_uses
    ) {
      possible_words.push(word);
    }
  }
  return possible_words;
}
function check_min_uses(word, min_use_list) {
  if (min_use_list.length == 0) {
    return true;
  }
  for (let i in min_use_list) {
    let use_count = 0;
    let letter = min_use_list[i][0];
    let min_uses = min_use_list[i][1];
    let re = new RegExp(letter, "g");
    let uses = word.match(re);
    if (uses) {
      use_count = uses.length;
    }
    if (use_count >= min_uses) {
      return true;
    } else {
      return false;
    }
  }
}
function check_repeat_target(word, repeat_list) {
  if (repeat_list.length == 0) {
    return true;
  }
  for (let i in repeat_list) {
    let use_count = 0;
    let letter = repeat_list[i][0];
    let target = repeat_list[i][1];
    let re = new RegExp(letter, "g");
    let uses = word.match(re);
    if (uses) {
      use_count = uses.length;
    }
    if (use_count != target) {
      return false;
    } else {
      return true;
    }
  }
}

export function set_repeat_limit(p_list, word) {
  let list_repeats = [];
  let list_indexes = [];
  let list_limits = [];
  let list_min_uses = [];
  for (let letter = 0; letter < word.length; letter++) {
    let re = new RegExp(word[letter], "g");
    let count = word.match(re).length;

    if (count > 1) {
      let list_repeats_string = list_repeats.toString();
      let repeat_letter_string = [word[letter], count].toString();
      if (list_repeats_string.indexOf(repeat_letter_string) < 0) {
        list_repeats.push([word[letter], count]);
      }
    }
  }
  for (let i in list_repeats) {
    let indexes = [];
    let letter = list_repeats[i][0];
    for (let j = 0; j < word.length; j++) {
      if (letter === word[j]) {
        indexes.push(j);
      }
    }
    list_indexes.push([letter, indexes]);
  }
  for (let i in list_indexes) {
    let allowed_count = 0;
    let has_grey_tile = false;
    for (let j in list_indexes[i][1]) {
      let letter_pos = list_indexes[i][1][j];
      if (p_list[letter_pos] === "lime" || p_list[letter_pos] === "yellow") {
        allowed_count++;
      } else {
        has_grey_tile = true;
      }
    }
    let repeated_letter = list_indexes[i][0];
    //checks that there is at least one use of the letter which is not allowed, otherwise we don't know if we've reached the limit
    if (has_grey_tile) {
      list_limits.push([repeated_letter, allowed_count]);
    } else {
      list_min_uses.push([repeated_letter, allowed_count]);
    }
  }
  return [list_limits, list_min_uses];
}
// If a word has eliminated letters, returns true and the word is rejected
function check_eliminated(word, list_elim_letters) {
  for (let letter in list_elim_letters) {
    if (word.includes(list_elim_letters[letter])) {
      return true;
    }
  }
  return false;
}

// If a word has letters which are not in the correct place, returns false and the word is rejected
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

// If a word has letters in inaccurate positions, returns true and the word is rejected
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

// Check for duplicates before adding to eliminated, correct or incorrect letter lists
export function add_to_list(list, element) {
  let list_string = list.toString();
  let element_string = element.toString();
  if (list_string.indexOf(element_string) < 0) {
    list.push(element);
  }
}

// Return a list of tile colors to assist with finding results
export function get_tile_colors(row) {
  let p_colors = [];
  for (let p = 1; p <= 9; p += 2) {
    let bgColor = row.childNodes[3].childNodes[p].style.backgroundColor;
    if (bgColor) {
      p_colors.push(bgColor);
    } else {
      p_colors.push("lightgrey");
    }
  }
  return p_colors;
}

// Return a list of rows with valid input
export function get_valid_rows(number_guesses) {
  let alpha_regex = /^[a-zA-Z]+$/; // regex expression to test that input is letters only
  let valid_guess_rows = []; //
  for (let i = 0; i < number_guesses; i++) {
    let guess = all_guess_inputs[i].value;
    if (guess.length == 5 && alpha_regex.test(guess)) {
      valid_guess_rows.push(all_guess_rows[i]);
    }
  }
  return valid_guess_rows;
}

/*************************** Displaying Results ***************************/
// Show the number of possible words
export function insert_results_summary(words_found) {
  number_found_p.innerText = `${words_found.length} words were found. Would you like to reveal them ?`;
  reveal_button.style.display = "block";
}
