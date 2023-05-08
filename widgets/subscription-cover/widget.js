
function subscription(url){
   const form = document.getElementById('subscription-form');
   form.addEventListener('submit',async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      try{
      const response = await fetch(url, {
            method: "POST", 
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         })
      } catch (error) {
         console.log(error)
      }
   })
}

subscription("");