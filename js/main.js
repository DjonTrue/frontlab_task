const userListElement = document.querySelector("#user_list");
const infoStatElement = document.querySelector("#stat");
const modalOverlay = document.querySelector("#modal-overlay");
const closeButton = document.querySelector("#close-button");
const xhr = new XMLHttpRequest();
let response = null;

xhr.open('GET', 'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture');
xhr.send();
xhr.onreadystatechange = () => {
  if (xhr.readyState != 4) return;

  if (xhr.status != 200) {
    alert(xhr.status + ': ' + xhr.statusText);
  } else {
    response = JSON.parse(xhr.responseText);
  
    createUserList(response);
  }
}

function ucFirst (str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

function sortList () {
  const select = document.getElementById('sort-slct');
  let value = select.options[select.selectedIndex].value;
  value = parseInt(value);

  response.results.sort((a, b)  => {
    if (a.name.last > b.name.last) return 1;
    if (a.name.last < b.name.last) return -1;
    if (a.name.first > b.name.first) return 1;
    return -1;
  })

  if (value === 2) { // Z-A sort
    response.results.reverse();
  }
  
  createUserList(response);

  if (value == 0) { //shuffle elements
    response.results.sort((a, b) => Math.random() - 0.5);
  }
  createUserList(response);
}

closeButton.addEventListener("click", () => {
  modalOverlay.classList.toggle("opened");
});

function createUserList (data) {
  while (userListElement.firstChild) {
    userListElement.removeChild(userListElement.firstChild);
  }

  for (const key in data.results) {
    const newUserElement = document.createElement('div');
    newUserElement.className = 'newUserElement';
    newUserElement.setAttribute("idUser", key)
    newUserElement.addEventListener("click", clickUserElement);
    userListElement.appendChild(newUserElement);

    const avatarUser = document.createElement('img');
    avatarUser.className = 'avatarUser';
    avatarUser.setAttribute("src", data.results[key].picture.medium);
    newUserElement.appendChild(avatarUser);

    const newUserText = data.results[key].name.title + ". " + ucFirst(data.results[key].name.first) + " " + ucFirst(data.results[key].name.last);
    newUser = document.createElement('div');
    newUser.className = 'nameUser';
    newUser.textContent = newUserText;
    newUserElement.appendChild(newUser);
  }
}

function clickUserElement () {
  modalOverlay.classList.toggle("opened");

  const user_avatarL = document.querySelector(".user_avatarL");
  const user_FIO = document.querySelector(".user_FIO");
  const user_street = document.querySelector(".user_street");
  const user_city = document.querySelector(".user_city");
  const user_state = document.querySelector(".user_state");
  const user_email = document.querySelector(".user_email");
  const user_phone = document.querySelector(".user_phone");
  
  user_avatarL.setAttribute("src", response.results[this.getAttribute("iduser")].picture.large)
  const fio = response.results[this.getAttribute("iduser")].name.title + ". " + ucFirst(response.results[this.getAttribute("iduser")].name.first) + " " + ucFirst(response.results[this.getAttribute("iduser")].name.last);    
  user_FIO.innerHTML = fio;
  user_street.innerHTML = response.results[this.getAttribute("iduser")].location.street;
  user_city.innerHTML = ucFirst(response.results[this.getAttribute("iduser")].location.city);
  user_state.innerHTML = ucFirst(response.results[this.getAttribute("iduser")].location.state);
  user_email.innerHTML = response.results[this.getAttribute("iduser")].email;
  user_phone.innerHTML = response.results[this.getAttribute("iduser")].phone;
}
