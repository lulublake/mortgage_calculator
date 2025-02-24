//

let resetButton = document.querySelector("#reset-button");
let form = document.querySelector("#mortgageForm");

resetButton.addEventListener("click", function(){
    form.reset();
});