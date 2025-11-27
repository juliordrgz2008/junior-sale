const juniorSaleAPI = "https://script.google.com/macros/s/AKfycbyQmhLUBAc1oA141M5th7SJjMshLHMQaYHZdvtfS4H7nOAdWw9vA-9Wmqa5fI7X0RSH/exec";


const modeSelect = document.getElementById("modeSelect");
const comprarDiv = document.getElementById("comprarDiv");



let allUsers = {
    names: [],
    emails: [],
    grade: [],
    balance: []
};

let pendingTransactions = [];

async function getJuniorSale() {
    const response = await fetch(juniorSaleAPI);
    const data = await response.json();

    const cellData = data.cellData;

    if (cellData && cellData.length > 0) {
        cellData.forEach((row) => {

            const columnB = row[1];
            const columnC = row[2];
            const columnD = row[3];
            const columnE = row[4];

            allUsers.names.push(columnB);
            allUsers.emails.push(columnC);
            allUsers.grade.push(columnD);
            allUsers.balance.push(columnE);
        });
    }
    console.log("Data gotten!");
    showJuniorSale(1);
}

getJuniorSale();

const form = document.getElementById("form");
form.reset();

const tableBody = document.getElementById("tableBody");
const searchBar = document.getElementById("searchBar");
searchBar.value = "";
const chosenStudent = document.getElementById("chosenStudent");
const buyer = document.getElementById("buyer");

let selectedUser = null;

function showJuniorSale(page, filter) {
    tableBody.innerHTML = '';
    let usersToShow = [];
    if (filter) {
        const filterValue = searchBar.value.toLowerCase();
        for (let i = 0; i < allUsers.names.length; i++) {
            if (allUsers.names[i].toLowerCase().startsWith(filterValue)) {
                usersToShow.push({
                    name: allUsers.names[i],
                    email: allUsers.emails[i],
                    grade: allUsers.grade[i],
                    balance: allUsers.balance[i],
                });
            }
        }
    } else {
        for (let i = 0; i < allUsers.names.length; i++) {
            usersToShow.push({
                name: allUsers.names[i],
                email: allUsers.emails[i],
                grade: allUsers.grade[i],
                balance: allUsers.balance[i],
            });
        }
    }
    const startIndex = (page - 1) * 25;
    const endIndex = startIndex + 25;
    const usersOnPage = usersToShow.slice(startIndex, endIndex);
    usersOnPage.forEach(user => {
        const newRow = document.createElement("tr");
        newRow.setAttribute("data-email", user.email);
        const nameCell = document.createElement("td");
        const nameLink = document.createElement("a");
        nameLink.textContent = user.name;
        nameLink.href = "#";
        nameLink.addEventListener("click", function (event) {
            event.preventDefault();
            selectedUser = user.name;
            chosenStudent.textContent = selectedUser;
            buyer.value = selectedUser;
            console.log(selectedUser);
        });
        nameCell.appendChild(nameLink);
        const emailCell = document.createElement("td");
        emailCell.textContent = user.email;
        const gradeCell = document.createElement("td");
        gradeCell.textContent = user.grade;
        const balanceCell = document.createElement("td");
        balanceCell.textContent = user.balance;
        newRow.appendChild(nameCell);
        newRow.appendChild(emailCell);
        newRow.appendChild(gradeCell);
        newRow.appendChild(balanceCell);
        tableBody.appendChild(newRow);
    });
}
const pageSelector = document.getElementById("pageSelector");
pageSelector.addEventListener("input", function () {
    showJuniorSale(pageSelector.value);
});
searchBar.addEventListener("input", function () {
    let filterValue = searchBar.value;
    if (filterValue !== "") {
        showJuniorSale(1, true);
    }
    if (filterValue == "") {
        showJuniorSale(1, false);
    }
});

const item = document.getElementById("item");
const itemName = document.getElementById("itemName");
const productoLabel = document.getElementById("productoLabel");
const cantidadLabel = document.getElementById("cantidadLabel");
const quantity = document.getElementById("quantity");
const montoLabel = document.getElementById("montoLabel");

prices = [3, 1, 1, 3, 3, 3, 1, 3, 3, 2, 3, 1, 2, 1];
names = [
"Brownies",
"Chupi Chupi",
"Cotufa",
"Empanada",
"Galletas",
"Gomitas",
"Ring Pop",
"Sandwich de Helado",
"Toston Grande",
"Toston Pequeño",
"5 Tequeños",
"Jugo",
"Nestea",
"Refresco"]

item.addEventListener("input", function(){
    console.log("input!");
    console.log(prices[item.value]);
    if(item.value == "custom"){
        itemName.classList.remove("hidden");
        cost.removeAttribute('readonly');
    }
    else{
        itemName.classList.add("hidden");
        cost.readOnly = true;
        itemName.value = names[item.value];
        cost.value = prices[item.value];
    }
});

modeSelect.addEventListener("input", function () {
    console.log(modeSelect.value);
    if (modeSelect.value == "buy") {
        comprarDiv.classList.remove("hidden");
        item.classList.remove("hidden");
        productoLabel.classList.remove("hidden");
        cantidadLabel.classList.remove("hidden");
        quantity.classList.remove("hidden");
        montoLabel.textContent = "Precio";
    }
    if (modeSelect.value == "pay") {
        cost.readOnly = false;
        comprarDiv.classList.remove("hidden");
        item.classList.add("hidden");
        productoLabel.classList.add("hidden");
        cantidadLabel.classList.add("hidden");
        quantity.classList.add("hidden");
        montoLabel.textContent = "Monto";
    }
    if (modeSelect.value == "none") {
        comprarDiv.classList.add("hidden");
    }
});

const cost = document.getElementById("cost");
const finalSubmitButton = document.getElementById("finalSubmitButton");
let data = {}
let tempData = [];



// function getTemp() {
//     if (localStorage.getItem("temp") === null) {
//         let temp = localStorage.setItem("temp", tempData);
//         let parsedTemp = JSON.parse(temp);
//         return parsedTemp;
//     }
//     else {
//         let array = [];
//         let savedData = localStorage.getItem("temp");
//         let parsedData = JSON.parse(savedData);
//         for (let x = 0; x < parsedData.length; x++) {
//             array.push(parsedData[x]);
//         }
//         return array;
//     }
// }

// let arraySavedData = getTemp();

function isNumber(textInput) {
    const num = Number(textInput);
    return !isNaN(num) && num !== null && String(textInput).trim() !== "";
}


form.addEventListener("submit", function (event) {
    event.preventDefault();
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'short' });
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const sellerID = localStorage.getItem("sellerID");
    
    if (modeSelect.value == "buy") {
        data = {
            sellerID: sellerID,
            buyer: buyer.value,
            item: itemName.value,
            cost: parseFloat(cost.value),
            quantity: quantity.value,
            time: `${month} ${day} ${hours}:${minutes}`
        };
    }
    if (modeSelect.value == "pay") {
        data = {
            sellerID: sellerID,
            buyer: buyer.value,
            item: "Pago",
            cost: (parseFloat(cost.value)) * -1,
            quantity: quantity.value,
            time: `${month} ${day} ${hours}:${minutes}`
        };
    }
    if (data.buyer == "") {
        alert("Tienes que escoger un nombre!");
        return 0;
    }
    if (isNumber(data.cost) == false) {
        alert("Precio invalido!");
        return 0;
    }
    else {
        pendingTransactions.push(data);
        currentTemp = pendingTransactions;
        console.log("Transaction added to pending list:", data);
        chosenStudent.textContent = "Seleccione un nombre";
        form.reset();
        comprarDiv.classList.add("hidden");
        searchBar.value = "";
    }

});

const cargandoLabel = document.getElementById("cargandoLabel");

finalSubmitButton.addEventListener("click", async function () {
    if (pendingTransactions.length === 0) {
        console.log("No transactions to submit.");
        return;
    }
    cargandoLabel.classList.remove("hidden");
    finalSubmitButton.classList.add("hidden");

    try {
        await fetch(juniorSaleAPI, {
            method: 'POST',
            mode: "no-cors",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transactions: pendingTransactions }),
        });

        console.log("All transactions sent. The response is opaque and cannot be read.");
        alert("All transactions submitted. Check the sheet to confirm.");
        pendingTransactions = [];
        window.location.reload();
    } catch (error) {
        cargandoLabel.classList.add("hidden");
        finalSubmitButton.classList.remove("hidden");
        console.error("Fetch error:", error);
        alert("Un error ha ocurrido. Porfavor intente denuevo.");
    }
});