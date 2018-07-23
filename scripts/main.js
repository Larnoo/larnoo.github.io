var image = document.querySelector('img');
var button = document.querySelector('button');
var h1 = document.querySelector('h1');

if (!localStorage.getItem('name')) {
    setUserName();
} else {
    var name = localStorage.getItem('name');
    h1.textContent = 'Mozilla is cool, ' + name;
}

image.onclick = function () {
    var src = image.getAttribute('src');
    if (src === 'images/firefox-icon.jpeg') {
        image.setAttribute('src', 'images/firefox-icon-2.png')
    } else {
        image.setAttribute('src', 'images/firefox-icon.jpeg')
    }
}

button.onclick = function () {
    setUserName();
}

function setUserName() {
    var name = prompt("Please enter your name.")
    localStorage.setItem('name', name);
    h1.textContent = 'Mozilla is cool, ' + name;
}
