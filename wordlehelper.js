"set strict";
import {
  form,
  eliminated_letters,
  correct_position,
  incorrect_position,
  find_button,
  reset_button,
} from "./modules/const.js";

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

find_button.addEventListener("click", () => {
  console.log("find");
});

reset_button.addEventListener("click", () => {
  console.log("reset");
});
