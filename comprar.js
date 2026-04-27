// Configuración Inicial
const juniorSaleAPI = "https://script.google.com/macros/s/AKfycbyQmhLUBAc1oA141M5th7SJjMshLHMQaYHZdvtfS4H7nOAdWw9vA-9Wmqa5fI7X0RSH/exec"; // Asegúrate de poner tu URL actual
const tableBody = document.getElementById("tableBody");
const searchBar = document.getElementById("searchBar");
const chosenStudent = document.getElementById("chosenStudent");
const buyer = document.getElementById("buyer");
const pageSelector = document.getElementById("pageSelector");

let allUsers = { names: [], grades: [], balances: [], bolivares: [] };
let selectedUser = null;

// 1. Obtener Datos
async function getJuniorSale() {
    try {
        const response = await fetch(juniorSaleAPI);
        const data = await response.json();
        const cellData = data.cellData;

        if (cellData && cellData.length > 0) {
            allUsers.names = [];
            allUsers.grades = [];
            allUsers.balances = [];
            allUsers.bolivares = [];

            cellData.forEach((row) => {
                // El orden que viene del backend es: [Name, Grade, Balance, Bolivares]
                allUsers.names.push(row[0]);
                allUsers.grades.push(row[1]);
                allUsers.balances.push(row[2]);
                allUsers.bolivares.push(row[3]);
            });
        }
        showJuniorSale(1);
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

// 2. Mostrar Tabla
function showJuniorSale(page, filter = false) {
    tableBody.innerHTML = '';
    let usersToShow = [];
    const filterValue = searchBar.value.toLowerCase();

    for (let i = 0; i < allUsers.names.length; i++) {
        if (!filter || allUsers.names[i].toLowerCase().startsWith(filterValue)) {
            usersToShow.push({
                name: allUsers.names[i],
                grade: allUsers.grades[i],
                balance: allUsers.balances[i],
                bolivares: allUsers.bolivares[i]
            });
        }
    }

    const startIndex = (page - 1) * 25;
    const usersOnPage = usersToShow.slice(startIndex, startIndex + 25);

    usersOnPage.forEach(user => {
        const newRow = document.createElement("tr");

        // Columna Nombre
        const nameCell = document.createElement("td");
        const nameLink = document.createElement("a");
        nameLink.textContent = user.name;
        nameLink.href = "#";
        nameLink.onclick = (e) => {
            e.preventDefault();
            selectedUser = user.name;
            chosenStudent.textContent = selectedUser;
            buyer.value = selectedUser;
        };
        nameCell.appendChild(nameLink);

        // Columna Grade
        const gradeCell = document.createElement("td");
        gradeCell.textContent = user.grade;

        // Columna Balance
        const balanceCell = document.createElement("td");
        balanceCell.textContent = user.balance;

        // Columna Bolivares
        const bolivaresCell = document.createElement("td");
        bolivaresCell.textContent = user.bolivares;

        // Agregar en orden: Name | Grade | Balance | Bolivares
        newRow.append(nameCell, gradeCell, balanceCell, bolivaresCell);
        tableBody.appendChild(newRow);
    });
}

// Iniciar carga
getJuniorSale();

// Eventos de búsqueda y página
pageSelector.addEventListener("input", () => showJuniorSale(pageSelector.value, searchBar.value !== ""));
searchBar.addEventListener("input", () => showJuniorSale(1, searchBar.value !== ""));

const item = document.getElementById("item");
const itemName = document.getElementById("itemName");
const productoLabel = document.getElementById("productoLabel");
const cantidadLabel = document.getElementById("cantidadLabel");
const quantity = document.getElementById("quantity");
const montoLabel = document.getElementById("montoLabel");
const foodItems = [
    ["Brownie/Brookie", 3],
    ["Brownie Chiquito", 1],
    ["Cachito", 3],
    ["Chupi Chupi", 1],
    ["Cocosete", 2],
    ["Cotufa", 1],
    ["Corneto Clasico", 4],
    ["Corneto Vasito Jazz", 2.5],
    ["Magnum Almendras", 4],
    ["Magnum White Almond", 4],
    ["Magnum Cappuccino", 4],
    ["Magnum Cookies N Cream", 4],
    ["Sandwitch Vainilla", 3],
    ["Helado Nucita", 2],
    ["Bati Bati", 1.5],
    ["Merengada Vasito", 2],
    ["Dona", 3.5],
    ["Empanada", 3],
    ["Sandwitch", 3],    
    ["Samba", 3],    
    ["Galleta", 3],
    ["Galleta Renatta", 3],
    ["Gomitas", 3],
    ["Papas Piter", 2],
    ["Pirulin", 1],
    ["Polvorosas", 2],
    ["Ring Pop", 1],
    ["Tequeños", 1],
    ["Torta", 3],
    ["Toston Grande", 3],
    ["Toston Pequeño", 2],
];

// for (x in foodItems){
    
// }

const drinkItems = [
    ["Jugo", 1],
    ["Agua", 1],
    ["Agua Saborizada", 1],
    ["Nestea", 1],
    ["Yolo", 3],
    ["Yolo Fit", 5.5],
    ["Refresco de Lata", 2],
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
        newQuantityEditor.classList.add("quantityEditor");

        newItemEditor.value = newItem;
        newItemEditor.classList.add("itemEditor");
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

const sellerID = localStorage.getItem("sellerID");
if (sellerID == null) {
    window.alert("La sesión ha expirado. Porfavor inicie sesion nuevamente.")
    window.location.href = "index.html";
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'short' });
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();

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