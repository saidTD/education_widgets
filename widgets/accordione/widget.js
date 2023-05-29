function generateId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let randomId = ''

  for(let i = 0 ; i < length; i++ ) {
      randomId += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return randomId;
}


function scopeAccordion (id) {
  const accordionItem = document.querySelector('.accordion__item');

  accordionItem.setAttribute('id', id);
}

const id = generateId(8);

scopeAccordion(id);
Accordion(`#${id}`);