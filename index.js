const googleAPI = "https://script.google.com/macros/s/AKfycbxHm698Bu2v6qchQaQwXNsc_EZF7XxyujY_0XQXF4LG_yI3sZnOd27hZKYdW3MGvpdxtg/exec"

function removeWhite(cell) {
    return cell !== "";
}

let passwordList = [];
let passwordToday = [];
let password = ""
localStorage.removeItem("sellerID");

async function inialization() {
    const response = await fetch(googleAPI);
    const data = await response.json();
    const cellData = data.cellData;
    if (cellData && cellData.length > 0) {
        cellData.forEach((row) => {
            const colA = row[0];
            const colB = row[1];

            passwordList.push(colA);
            passwordToday.push(colB);
        });

    }
    passwordList = passwordList.filter(x => x !== "");
    passwordToday = passwordToday.filter(x => x !== "");
    password = passwordToday[0];
}
document.addEventListener('DOMContentLoaded', inialization);


const loginButton = document.getElementById("loginButton");
const form = document.getElementById("loginForm");
const warning = document.getElementById("warning");

function getPassword(adminPass) {
    if (adminPass == "ENDRHDWT57") {
        console.log(`Today's password is ${password}`)
    }
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);

    const username = formData.get('name');
    const passwordUser = formData.get('password');

    localStorage.setItem("sellerID", username);

    if (passwordUser == password) {
        // console.log(localStorage.getItem("sellerID"));
        window.location = "comprar.html";
    }
    else{
        warning.hidden = false;
        function hideWarning(){
            warning.hidden = true

        }
        if (warning.hidden == false){
            setTimeout(() => console.log("1"), 1000);     
            setTimeout(() => console.log("2"), 2000);     
            setTimeout(() => console.log("3"), 3000);     
            setTimeout(() => console.log("4"), 4000);     
            setTimeout(() => hideWarning(), 5000);     
        }
    }
});

