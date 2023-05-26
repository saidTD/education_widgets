
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




function accordion(elementSelector) {
    const element = document.querySelector(elementSelector);
    const openBar = element.querySelector('.accordion__toggler-bar');
    console.log(element)
    console.log(openBar)


    openBar.addEventListener('click', () => {
        openBar.classList.toggle('show');
        let programList = openBar.nextElementSibling ;

        if(programList.style.maxHeight){
            programList.style.maxHeight = null;
            programList.style.marginTop = '0px';
        }
        else {
            programList.style.maxHeight = programList.scrollHeight + 'px';
        }
    });
}

const id = generateId(8);

scopeAccordion(id);
accordion(`#${id}`);