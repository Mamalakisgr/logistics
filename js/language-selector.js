document.querySelector('.language-dropdown').addEventListener('click', function(event) {
    let selectedLang = document.getElementById('selected-lang');
    selectedLang.innerText = event.target.innerText;
});