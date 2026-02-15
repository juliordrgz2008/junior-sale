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



const foodItems = [
    ["Brownie/Brookie", 3],
    ["Cachito", 3],
    ["Chupi Chupi", 1],
    ["Cotufa", 1],
    ["Empanada", 3],
    ["Galleta", 3],
    ["Gomitas", 3],
    ["Polvorosas", 2],
    ["Ring Pop", 1],
    ["Sandwich de Helado", 3],
    ["Toston Grande", 3],
    ["Toston Pequeño", 2],
    ["5 Tequeños", 3]
];

const drinkItems = [
    ["Jugo", 1],
    ["Nestea", 2],
    ["Refresco", 1]
]

const comidaGroup = document.getElementById("comidaGroup");
const bebidaGroup = document.getElementById("bebidaGroup");
const customGroup = document.getElementById("customGroup");

for (let item = 0; item < foodItems.length; item++) {
    const option = document.createElement("option");
    option.innerText = foodItems[item][0];
    comidaGroup.appendChild(option);
}

for (let item = 0; item < drinkItems.length; item++) {
    const option = document.createElement("option");
    option.innerText = drinkItems[item][0];
    bebidaGroup.appendChild(option);
}

item.addEventListener("input", function () {
    if (item.value == "custom") {
        itemName.classList.remove("hidden");
        cost.removeAttribute('readonly');
    }
    else {
        for (let x = 0; x < foodItems.length; x++) {
            const isInFood = foodItems[x].indexOf(item.value);
            if (isInFood > -1) {
                itemName.classList.add("hidden");
                itemName.value = foodItems[x][0];
                cost.value = foodItems[x][1];
            }
        }
        for (let x = 0; x < drinkItems.length; x++) {
            const isInDrinks = drinkItems[x].indexOf(item.value);
            if (isInDrinks > -1) {
                itemName.classList.add("hidden");
                itemName.value = drinkItems[x][0];
                cost.value = drinkItems[x][1];
            }
        }
    }
});

modeSelect.addEventListener("input", function () {
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

const transDisplayBody = document.getElementById("transDisplayBody");

function updateHistory() {
    transDisplayBody.innerHTML = "";
    for (let objects = 0; objects < pendingTransactions.length; objects++) {
        let newBuyer = pendingTransactions[objects].buyer;
        let newItem = pendingTransactions[objects].item;
        let newCost = pendingTransactions[objects].cost;
        let newQuantity = pendingTransactions[objects].quantity;

        const newRow = document.createElement("tr");
        const newBuyerCell = document.createElement("td");
        const newItemCell = document.createElement("td");
        const newCostCell = document.createElement("td");
        const newQuantityCell = document.createElement("td");
        const newButtonCell = document.createElement("td");
        const newButton = document.createElement("button");

        const newItemEditor = document.createElement("select");
        const newFoodGroup = document.createElement("optgroup");
        const newDrinkGroup = document.createElement("optgroup");

        newFoodGroup.label = "Comida";
        newDrinkGroup.label = "Bebidas";

        newItemEditor.appendChild(newFoodGroup);
        newItemEditor.appendChild(newDrinkGroup);

        for (let item = 0; item < foodItems.length; item++) {
            const option = document.createElement("option");
            option.innerText = foodItems[item][0];
            newFoodGroup.appendChild(option);
        }
        for (let item = 0; item < drinkItems.length; item++) {
            const option = document.createElement("option");
            option.innerText = drinkItems[item][0];
            newDrinkGroup.appendChild(option);
        }



        const newQuantityEditor = document.createElement("input");

        newQuantityEditor.type = "number";
        newQuantityEditor.min = 1;

        newItemEditor.value = newItem;
        newQuantityEditor.value = newQuantity;

        newRow.id = objects;
        newButton.id = objects;

        newBuyerCell.innerText = newBuyer;
        newCostCell.innerText = newCost;

        newButton.type = "button";
        newButton.style = "border: 0;";
        newButton.innerHTML = `<img id="trash" src="trash.png" style="border: 0; width:40%;">`;

        newItemEditor.addEventListener("input", function () {
            pendingTransactions[objects].item = newItemEditor.value;
            for (let x = 0; x < foodItems.length; x++) {
                if (foodItems[x].indexOf(newItemEditor.value) > -1) {
                    pendingTransactions[objects].cost = foodItems[x][1];
                    newCostCell.innerText = foodItems[x][1];
                }
            }
            for (let x = 0; x < drinkItems.length; x++) {
                if (drinkItems[x].indexOf(newItemEditor.value) > -1) {
                    pendingTransactions[objects].cost = drinkItems[x][1];
                    newCostCell.innerText = drinkItems[x][1];
                }

            }
        });

        newQuantityEditor.addEventListener("input", function () {
            pendingTransactions[objects].quantity = newQuantityEditor.value;
        })

        newButton.addEventListener("click", function () {
            pendingTransactions.splice(newButton.id, 1);
            console.log(pendingTransactions);
            updateHistory()
        });


        newItemCell.appendChild(newItemEditor);
        newQuantityCell.appendChild(newQuantityEditor);
        newButtonCell.appendChild(newButton);
        newRow.appendChild(newBuyerCell);
        newRow.appendChild(newItemCell);
        newRow.appendChild(newCostCell);
        newRow.appendChild(newQuantityCell);
        newRow.appendChild(newButtonCell);


        transDisplayBody.appendChild(newRow);




    }

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
        console.log("Transaction added to pending list:", data);
        chosenStudent.textContent = "Seleccione un nombre";
        form.reset();
        comprarDiv.classList.add("hidden");
        searchBar.value = "";
        updateHistory();
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