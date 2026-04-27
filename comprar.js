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
let data = {};

// 2. Listas de Productos
const foodItems = [
    ["Brownie/Brookie", 3], ["Brownie Chiquito", 1], ["Cachito", 3], ["Chupi Chupi", 1],
    ["Cocosete", 2], ["Cotufa", 1], ["Corneto Clasico", 4], ["Corneto Vasito Jazz", 2.5],
    ["Magnum Almendras", 4], ["Magnum White Almond", 4], ["Magnum Cappuccino", 4],
    ["Magnum Cookies N Cream", 4], ["Sandwitch Vainilla", 3], ["Helado Nucita", 2],
    ["Bati Bati", 1.5], ["Merengada Vasito", 2], ["Dona", 3.5], ["Empanada", 3],
    ["Sandwitch", 3], ["Samba", 3], ["Galleta", 3], ["Galleta Renatta", 3],
    ["Gomitas", 3], ["Papas Piter", 2], ["Pirulin", 1], ["Polvorosas", 2],
    ["Ring Pop", 1], ["Tequeños", 1], ["Torta", 3], ["Toston Grande", 3], ["Toston Pequeño", 2]
];

const drinkItems = [
    ["Jugo", 1], ["Agua", 1], ["Agua Saborizada", 1], ["Nestea", 1],
    ["Yolo", 3], ["Yolo Fit", 5.5], ["Refresco de Lata", 2], ["Refresco", 1]
];

// Llenar selectores
const comidaGroup = document.getElementById("comidaGroup");
const bebidaGroup = document.getElementById("bebidaGroup");

foodItems.forEach(f => {
    let opt = document.createElement("option");
    opt.innerText = f[0];
    opt.value = f[0];
    comidaGroup.appendChild(opt);
});

drinkItems.forEach(d => {
    let opt = document.createElement("option");
    opt.innerText = d[0];
    opt.value = d[0];
    bebidaGroup.appendChild(opt);
});

// 3. Funciones de Datos (GET)
async function getJuniorSale() {
    try {
        const response = await fetch(juniorSaleAPI);
        const data = await response.json();
        const cellData = data.cellData;

        if (cellData && cellData.length > 0) {
            allUsers.names = []; allUsers.grades = []; allUsers.balances = []; allUsers.bolivares = [];
            cellData.forEach((row) => {
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

// 4. Lógica de Interfaz
item.addEventListener("input", function () {
    if (item.value == "custom") {
        itemName.classList.remove("hidden");
        cost.readOnly = false;
        cost.value = "";
    } else {
        itemName.classList.add("hidden");
        cost.readOnly = true;
        const allItems = [...foodItems, ...drinkItems];
        const selected = allItems.find(i => i[0] === item.value);
        if (selected) {
            itemName.value = selected[0];
            cost.value = selected[1];
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

window.removeTrans = function(index) {
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

    if (!selectedUser) { alert("¡Tienes que escoger un nombre!"); return; }
    if (!isNumber(cost.value)) { alert("Precio inválido"); return; }

    let transData = {
        sellerID: sID,
        buyer: selectedUser,
        item: modeSelect.value === "buy" ? itemName.value : "Pago",
        cost: modeSelect.value === "buy" ? parseFloat(cost.value) : parseFloat(cost.value) * -1,
        quantity: quantity.value || 1,
        time: timeStr
    };

    pendingTransactions.push(transData);
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

    try {
        await fetch(juniorSaleAPI, {
            method: 'POST',
            mode: "no-cors",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactions: pendingTransactions }),
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