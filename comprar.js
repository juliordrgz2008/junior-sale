// 1. Configuración Inicial e IDs de Elementos
const juniorSaleAPI = "https://script.google.com/macros/s/AKfycbyQmhLUBAc1oA141M5th7SJjMshLHMQaYHZdvtfS4H7nOAdWw9vA-9Wmqa5fI7X0RSH/exec";
const tableBody = document.getElementById("tableBody");
const searchBar = document.getElementById("searchBar");
const chosenStudent = document.getElementById("chosenStudent");
const buyer = document.getElementById("buyer");
const pageSelector = document.getElementById("pageSelector");
const item = document.getElementById("item");
const itemName = document.getElementById("itemName");
const productoLabel = document.getElementById("productoLabel");
const cantidadLabel = document.getElementById("cantidadLabel");
const quantity = document.getElementById("quantity");
const montoLabel = document.getElementById("montoLabel");
const cost = document.getElementById("cost");
const finalSubmitButton = document.getElementById("finalSubmitButton");
const transDisplayBody = document.getElementById("transDisplayBody");
const cargandoLabel = document.getElementById("cargandoLabel");
const form = document.getElementById("form"); // Asegúrate de que tu <form> tenga id="form"

// VARIABLES GLOBALES (Aquí estaba el error, faltaba definirlas)
let allUsers = { names: [], grades: [], balances: [], bolivares: [] };
let selectedUser = null;
let pendingTransactions = []; // DEFINIDA PARA EVITAR EL ERROR
const inventoryUpdater = [];
let data = {};


// 2. Listas de Productos

// Llenar selectores
const comidaGroup = document.getElementById("comidaGroup");
const bebidaGroup = document.getElementById("bebidaGroup");

const inventory = { id: [], name: [], cost: [], quantity: [], photo: [], type: [], show: [] };

// 3. Funciones de Datos (GET)
async function getJuniorSale() {
    try {
        const response = await fetch(juniorSaleAPI);
        const data = await response.json();
        const cellData = data.cellData;
        const inventoryData = data.inventory

        if (cellData && cellData.length > 0) {
            allUsers.names = []; allUsers.grades = []; allUsers.balances = []; allUsers.bolivares = [];
            cellData.forEach((row) => {
                allUsers.names.push(row[0]);
                allUsers.grades.push(row[1]);
                allUsers.balances.push(row[2]);
                allUsers.bolivares.push(row[3]);
            });
        }
        if (inventoryData && inventoryData.length > 0) {
            inventory.id = []; inventory.name = []; inventory.cost = []; inventory.quantity = []; inventory.photo = []; inventory.type = []; inventory.show = [];
            inventoryData.forEach((row) => {
                inventory.id.push(row[0]);
                inventory.name.push(row[1]);
                inventory.cost.push(row[2]);
                inventory.quantity.push(row[3]);
                inventory.photo.push(row[4]);
                inventory.type.push(row[5]);
                inventory.show.push(row[6]);
            });
        }

        for (let i = 0; i < inventory.name.length; i++) {

            if (inventory.show[i] === true) {
                let opt = document.createElement("option");
                opt.innerText = inventory.name[i];
                opt.value = inventory.id[i];

                if (inventory.type[i] === "food") {
                    comidaGroup.appendChild(opt);
                } else if (inventory.type[i] === "drink") {
                    bebidaGroup.appendChild(opt);
                }
            }
        }
        showJuniorSale(1);
        mainDiv.style = "";
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

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
        newRow.innerHTML = `
            <td><a href="#" class="user-link">${user.name}</a></td>
            <td>${user.grade}</td>
            <td>${user.balance}</td>
            <td>${user.bolivares}</td>
        `;
        newRow.querySelector(".user-link").onclick = (e) => {
            e.preventDefault();
            selectedUser = user.name;
            chosenStudent.textContent = selectedUser;
            buyer.value = selectedUser;
        };
        tableBody.appendChild(newRow);
    });
}

item.addEventListener("input", function () {
    if (item.value == "custom") {
        itemName.classList.remove("hidden");
        itemName.value = "";
        cost.readOnly = false;
        cost.value = "";
    } else {
        itemName.classList.add("hidden");
        cost.readOnly = true;
        const selectedId = Number(item.value);
        const index = inventory.id.indexOf(selectedId);
        
        if (index !== -1) {
            itemName.value = inventory.name[index];
            cost.value = inventory.cost[index];
            quantity.max = inventory.quantity[index];

        }
    }
});
modeSelect.addEventListener("input", function () {
    const isBuy = modeSelect.value == "buy";
    const isPay = modeSelect.value == "pay";

    comprarDiv.classList.toggle("hidden", modeSelect.value == "none");
    item.classList.toggle("hidden", !isBuy);
    productoLabel.classList.toggle("hidden", !isBuy);
    cantidadLabel.classList.toggle("hidden", !isBuy);
    quantity.classList.toggle("hidden", !isBuy);

    montoLabel.textContent = isBuy ? "Precio" : "Monto";
    cost.readOnly = isBuy;
});

// 5. Manejo de Transacciones (PENDING)
function updateHistory() {
    transDisplayBody.innerHTML = "";
    pendingTransactions.forEach((t, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${t.buyer}</td>
            <td>${t.item}</td>
            <td>${t.cost}</td>
            <td>${t.quantity}</td>
            <td><button type="button" onclick="removeTrans(${index})">❌</button></td>
        `;
        transDisplayBody.appendChild(row);
    });
}

window.removeTrans = function (index) {
    pendingTransactions.splice(index, 1);
    updateHistory();
};

function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

// 6. Evento Submit del Formulario (Añadir a la lista)
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const now = new Date();
    const timeStr = `${now.toLocaleString('en-US', { month: 'short' })} ${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
    const sID = localStorage.getItem("sellerID");
    let newID = 0;
    if (!selectedUser) { alert("¡Tienes que escoger un nombre!"); return; }
    if (!isNumber(cost.value)) { alert("Precio inválido"); return; }

    for (let x = 0; x < inventory.name.length; x++) {
        if (itemName.value == inventory.name[x]) {
            newID = inventory.id[x];
        }
    }

    let transData = {
        itemId: newID,
        sellerID: sID,
        buyer: selectedUser,
        item: modeSelect.value === "buy" ? itemName.value : "Pago",
        cost: modeSelect.value === "buy" ? parseFloat(cost.value) : parseFloat(cost.value) * -1,
        quantity: quantity.value || 1,
        time: timeStr
    };

    pendingTransactions.push(transData);


    pendingTransactions.forEach(object => {
        if (object.itemId === "N/A" || !object.itemId) return;
        let found = false;
        for (let z = 0; z < inventoryUpdater.length; z++) {
            if (object.itemId == inventoryUpdater[z].id) {
                inventoryUpdater[z].quantity += parseFloat(object.quantity);
                found = true;
                console.log(inventoryUpdater);
                break;
            }
        }
        if (!found) {
            let temp = {
                id: object.itemId,
                quantity: parseFloat(object.quantity)
            };
            inventoryUpdater.push(temp);
        }
    }); console.log(inventoryUpdater);
    form.reset();
    chosenStudent.textContent = "Seleccione un nombre";
    selectedUser = null;
    updateHistory();
});

// 7. Envío Final a Google Sheets
finalSubmitButton.addEventListener("click", async function () {
    if (pendingTransactions.length === 0) return;
    cargandoLabel.classList.remove("hidden");
    finalSubmitButton.classList.add("hidden");
    inventoryUpdater.forEach(f => {
        for (let x = 0; x < inventory.id.length; x++) {
            if (f.id == inventory.id[x]) {
                inventory.quantity[x] -= f.quantity;
                console.log(inventory.quantity);
                break;
            }
        }
    });

    try {
        await fetch(juniorSaleAPI, {
            method: 'POST',
            mode: "no-cors",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactions: pendingTransactions, inventory: inventory }),
        });

        alert("¡Transacciones enviadas con éxito!");
        pendingTransactions = [];
        window.location.reload();
    } catch (error) {
        cargandoLabel.classList.add("hidden");
        finalSubmitButton.classList.remove("hidden");
        alert("Error al enviar. Intente de nuevo.");
    }
});

// Inicializar
getJuniorSale();
pageSelector.addEventListener("input", () => showJuniorSale(pageSelector.value, searchBar.value !== ""));
searchBar.addEventListener("input", () => showJuniorSale(1, searchBar.value !== ""));