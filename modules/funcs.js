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
export function find_word(list_elim_letters, correct_list, incorrect_dict) {
  let possible_words = [];
  for (var i in word_list) {
    var word = word_list[i];
    var has_eliminated_letters = check_eliminated(word, list_elim_letters);
    var correct_letters_in_place = check_correct_pos(word, correct_list);
    var letters_in_incorrect_place = check_incorrect_pos(word, incorrect_dict);

    if (
      // if the word passes these 3 tests it is added to the list of possible words
      !has_eliminated_letters &&
      correct_letters_in_place &&
      !letters_in_incorrect_place
    ) {
      possible_words.push(word);
    }
  }
  return possible_words;
}

// If a word has eliminated letters, returns true and the word is rejected
function check_eliminated(word, list_elim_letters) {
  for (var letter in list_elim_letters) {
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
