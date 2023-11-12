"set strict";

/************************* INPUT AND GUESS ROWS *************************/
// Number of gueses to enter determines the number of rows displayed
export const num_of_guesses = document.querySelector(
  "input[name='num_guesses']"
);

// This div contains all the rows of guesses
export const guesses_section = document.querySelector("#guesses");

// Needed to enumerate all the rows of user input
export const all_guess_rows = document.querySelectorAll(".guess-row");

// Used for resetting all the input fields
export const all_guess_inputs = document.querySelectorAll("input[type='text']");

/**************************** LETTER TILES ****************************/
// Form is needed to set onclick listener for changing tile colors
export const form = document.querySelector("form");

// For enumerating each row of letter tiles
export const rows_letter_tiles = document.querySelectorAll(".wordtiles");

// Used for resetting color of all letter tiles
export const letter_squares = document.querySelectorAll(".guess-row p");

/****************************** RESULTS ******************************/
// Used for displaying the number of words found
export const number_found_p = document.querySelector("#number_found");

// Used for displaying the words found
export const words_found_p = document.querySelector("#words_found");

/****************************** BUTTONS ******************************/
// Button for finding possible words
export const find_button = document.querySelector("#find_button");

// Button for revealing the words
export const reveal_button = document.querySelector("#reveal-button");

// Button for resetting the page
export const reset_button = document.querySelector("#reset_button");
