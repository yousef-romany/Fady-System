let btn = document.querySelector("#add");

let container = document.querySelector(".contianer-add-new-employer");

btn.addEventListener("click" , () => {

    container.classList.toggle("active-em");

});