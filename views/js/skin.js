let mother = document.querySelectorAll(".num-in");

mother.forEach( item => {

  
  item.addEventListener("click", (item1) => {

    if (item1.target.classList == "plus") {
  
      let inputt = item.firstElementChild.nextElementSibling; // new data here 

      let me = parseInt(inputt.value) + 1;


      inputt.value = me;
  
    } else if (item1.target.classList == "minus dis") {
  
      let inputt1 = item.firstElementChild.nextElementSibling;
  
        






      let count1 = parseInt(inputt1.value) - 1;
      
      inputt1.value = count1;
  
    } else {
      console.log("sorry")
    }
  });



});


