const openBars = document.querySelectorAll('.accordion__item .accordion__toggler-bar');
openBars.forEach(bar => {
    bar.addEventListener('click', () => {
        bar.classList.toggle('show');
        let programList = bar.nextElementSibling ;

        if(programList.style.maxHeight){
            programList.style.maxHeight = null;
            programList.style.marginTop = '0px';
        }
        else {
            programList.style.maxHeight = programList.scrollHeight + 'px';
        }
    })
});