let btn = document.querySelector(".container-add");

btn.addEventListener("click" , () => {
    let container = document.querySelector(".container-add-storage");
    container.classList.toggle("activee");
});