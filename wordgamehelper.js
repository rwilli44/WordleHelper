"set strict";
import {
  form,
  find_button,
  reset_button,
  num_of_guesses,
  guesses_section,
  words_found_p,
  reveal_button,
} from "./modules/const.js";

import {
  find_word,
  reset_input,
  reset_all_tiles,
  clear_results,
  add_to_list,
  insert_results_summary,
  get_valid_rows,
  show_rows,
  reset_rows,
  change_color,
  show_letters,
  get_tile_colors,
  set_repeat_limit,
} from "./modules/funcs.js";

// ********* Variables necessary for storing the letters and results ********* //
let list_elim_letters = [];
let incorrect_list = [];
let correct_list = [];
let possible_words = [];
let repeat_targets = [];
let repeat_min_uses = [];

// ****************** Listener for Changing Number of Guess Rows  ****************** //
num_of_guesses.addEventListener("input", () => {
  clear_results(); // in case a search has already been done, clear the results panel

  let number_guesses = parseInt(num_of_guesses.value);

  show_rows(number_guesses); // show the correct number of rows
  reset_rows(number_guesses); // empty and hide unneeded guess rows
});

// ***************** Listener for changing the color of a letter ***************** //
guesses_section.addEventListener("click", (event) => {
  clear_results(); // in case a search has already been done, clear the results panel

  let clickedElement = event.target; // Get the target element that was clicked

  change_color(clickedElement); // Change the background color of the tile
});

// ************************** Show Input in Letter Tiles ************************** //
guesses_section.addEventListener("input", (event) => {
  clear_results(); // in case a search has already been done, clear the results panel

  let inputElement = event.target; // Get the target element that was changed
  let row = inputElement.parentElement.parentElement; // Get the row of the element

  show_letters(row, inputElement); // Show the letters in the tiles
});

// ************************** Find Possible Words ************************** //
find_button.addEventListener("click", () => {
  // Clear any past results
  list_elim_letters = [];
  correct_list = [];
  incorrect_list = [];
  repeat_targets = [];
  repeat_min_uses = [];

  // verify the number of guesses selected to create a list of rows with valid input
  let number_guesses = parseInt(num_of_guesses.value);
  let valid_guess_rows = get_valid_rows(number_guesses);

  for (let i in valid_guess_rows) {
    let row = valid_guess_rows[i];
    // This complex DOM reference is left in place rather than using the all inputs selector
    // in case the user enters an invalid row in the middle of two or more valid rows
    let word = row.childNodes[1].childNodes[2].value.toLowerCase();

    // Get a list of the colors of each letter tile
    let p_colors = get_tile_colors(row);

    let repeat_lists = set_repeat_limit(p_colors, word);
    let guess_repeats = repeat_lists[0];
    let guess_min_uses = repeat_lists[1];

    if (guess_repeats) {
      repeat_targets.push(...guess_repeats);
      console.log("target uses", guess_repeats);
    }
    if (guess_min_uses) {
      repeat_min_uses.push(...guess_min_uses);
    }
    // enumerate the color list to add the word letters to the correct list of letters
    // which are either eliminated, correct, or included but in the incorrect place
    for (let i in p_colors) {
      if (p_colors[i] == "yellow") {
        add_to_list(incorrect_list, [word[i], i]);
      } else if (p_colors[i] == "lime") {
        add_to_list(correct_list, [word[i], i]);
      } else {
        add_to_list(list_elim_letters, word[i]);
      }
    }
  }
  // Make sure letters which are correct are not kept in the eliminated letters list which may happen if they repeat
  let updated_list_elim_letters = Array.from(list_elim_letters);
  for (let i in list_elim_letters) {
    let elim_letter = list_elim_letters[i];

    // correct and incorrect lists are nested lists, to search within the 2nd layer change them to a string
    let correct_string = correct_list.toString();
    let incorrect_string = incorrect_list.toString();

    if (
      //is true if the eliminated letter is in the string
      correct_string.indexOf(elim_letter) >= 0 ||
      incorrect_string.indexOf(elim_letter) >= 0
    ) {
      // remove the eliminated letter from the elimination list if it is a duplicate of a correct letter
      let index_in_elimlist = updated_list_elim_letters.indexOf(elim_letter);
      delete updated_list_elim_letters[index_in_elimlist];
    }
  }
  //// need to rethink this to have it signal any repeated numbers to limit how many times they are used
  /// look for double letters in the word, if any are found check to see if any are grey, if they are count how many, set the
  /// limit based on this, add a final filter to each word where in runs through a list of lists and checks if X letter is used Y or more times
  /// use string.match() to count

  console.log(repeat_targets);
  // Get possible word list
  possible_words = find_word(
    updated_list_elim_letters,
    correct_list,
    incorrect_list,
    repeat_targets,
    repeat_min_uses
  );

  // Show the number of possible words and the button to reveal them
  insert_results_summary(possible_words);
});

// ****************** Reveal the Possible Words   ****************** //
reveal_button.addEventListener("click", () => {
  let result = ""; // to hold the complete result list as a string

  // add each word tot he string
  for (let word in possible_words) {
    result += possible_words[word] + ", ";
  }

  // insert the string into the results section HTML cutting off the final comma
  words_found_p.innerText = result.substring(0, result.length - 2);
});

// ****************** Reset the Page   ****************** //
reset_button.addEventListener("click", () => {
  reset_input();
  reset_all_tiles();
  clear_results();
});

// ****************** Reset the Page on Page Refresh  ****************** //
window.onload = reset_input();

// ****************** Prevent Default Behavior  ****************** //
// There is no submit button, but keep this to avoid any unexpected behavior
form.addEventListener("submit", (event) => {
  event.preventDefault();
});
