// 1. Configuración Inicial e IDs
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
const form = document.getElementById("form");
const modeSelect = document.getElementById("modeSelect");
const comprarDiv = document.getElementById("comprarDiv");
const mainDiv = document.getElementById("mainDiv");
const prepaidLabel = document.getElementById("prepaidLabel");
const prepaid = document.getElementById("prepaid");


// VARIABLES GLOBALES
let allUsers = { names: [], grades: [], balances: [], bolivares: [] };
let selectedUser = null;
let pendingTransactions = [];
let inventory = { id: [], name: [], cost: [], quantity: [], photo: [], type: [], show: [] };

// 3. Funciones de Datos (GET)
async function getJuniorSale() {
    try {
        const response = await fetch(juniorSaleAPI);
        const data = await response.json();
        const cellData = data.cellData;
        const inventoryData = data.inventory;

        if (cellData) {
            allUsers.names = cellData.map(r => r[0]);
            allUsers.grades = cellData.map(r => r[1]);
            allUsers.balances = cellData.map(r => r[2]);
            allUsers.bolivares = cellData.map(r => r[3]);
        }

        if (inventoryData) {
            inventory.id = inventoryData.map(r => r[0]);
            inventory.name = inventoryData.map(r => r[1]);
            inventory.cost = inventoryData.map(r => r[2]);
            inventory.quantity = inventoryData.map(r => r[3]);
            inventory.photo = inventoryData.map(r => r[4]);
            inventory.type = inventoryData.map(r => r[5]);
            inventory.show = inventoryData.map(r => r[6]);

            // Fill Selectors
            const comidaGroup = document.getElementById("comidaGroup");
            const bebidaGroup = document.getElementById("bebidaGroup");
            comidaGroup.innerHTML = ""; bebidaGroup.innerHTML = "";

            for (let i = 0; i < inventory.name.length; i++) {
                if (inventory.show[i] === true || inventory.show[i] === "TRUE") {
                    let opt = document.createElement("option");
                    opt.innerText = inventory.name[i];
                    opt.value = inventory.id[i];
                    if (inventory.type[i] === "food") comidaGroup.appendChild(opt);
                    else if (inventory.type[i] === "drink") bebidaGroup.appendChild(opt);
                }
            }
        }
        showJuniorSale(1);
        mainDiv.style.visibility = "visible";
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

function showJuniorSale(page, filter = false) {
    tableBody.innerHTML = '';
    let usersToShow = [];
    const filterValue = searchBar.value.toLowerCase();

    for (let i = 0; i < allUsers.names.length; i++) {
        if (!filter || allUsers.names[i].toLowerCase().includes(filterValue)) {
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

// 4. Listeners de Interfaz
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
    comprarDiv.classList.toggle("hidden", modeSelect.value == "none");
    item.classList.toggle("hidden", !isBuy);
    prepaidLabel.classList.toggle("hidden", !isBuy);
    prepaid.classList.toggle("hidden", !isBuy);
    productoLabel.classList.toggle("hidden", !isBuy);
    cantidadLabel.classList.toggle("hidden", !isBuy);
    quantity.classList.toggle("hidden", !isBuy);
    montoLabel.textContent = isBuy ? "Precio" : "Monto";
    cost.readOnly = isBuy;
});

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

form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!selectedUser) { alert("¡Tienes que escoger un nombre!"); return; }
    if (!isNumber(cost.value)) { alert("Precio inválido"); return; }

    const now = new Date();
    const timeStr = `${now.toLocaleString('en-US', { month: 'short' })} ${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
    const sID = localStorage.getItem("sellerID");
    
    let currentItemID = null;
    if (modeSelect.value === "buy") {
        currentItemID = Number(item.value);
    }

    let transData = {
        itemId: currentItemID,
        sellerID: sID,
        buyer: selectedUser,
        item: modeSelect.value === "buy" ? itemName.value : "Pago",
        cost: modeSelect.value === "buy" ? parseFloat(cost.value) : parseFloat(cost.value) * -1,
        quantity: parseInt(quantity.value) || 1,
        time: timeStr,
        prepaid : prepaid.checked
    };

    pendingTransactions.push(transData);
    
    // Reset individual selection
    form.reset();
    chosenStudent.textContent = "Seleccione un nombre";
    selectedUser = null;
    updateHistory();
});

// 6. ENVÍO FINAL - FIX PARA EL BOTÓN Y LA CANTIDAD
finalSubmitButton.addEventListener("click", async function () {
    if (pendingTransactions.length === 0) {
        alert("No hay transacciones para mandar.");
        return;
    }

    cargandoLabel.classList.remove("hidden");
    finalSubmitButton.classList.add("hidden");

    // Actualizamos el inventario local basado en lo que hay en el carrito
    pendingTransactions.forEach(t => {
        if (t.itemId) {
            const idx = inventory.id.indexOf(t.itemId);
            if (idx !== -1) {
                inventory.quantity[idx] -= t.quantity;
            }
        }
    });

    try {
        await fetch(juniorSaleAPI, {
            method: 'POST',
            mode: "no-cors",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                transactions: pendingTransactions, 
                inventory: {
                    id: inventory.id,
                    quantity: inventory.quantity
                }
            }),
        });

        alert("¡Transacciones enviadas con éxito!");
        window.location.reload();
    } catch (error) {
        console.error("Error:", error);
        cargandoLabel.classList.add("hidden");
        finalSubmitButton.classList.remove("hidden");
        alert("Error al enviar. Intente de nuevo.");
    }
});

// Inicializar
getJuniorSale();
pageSelector.addEventListener("input", () => showJuniorSale(pageSelector.value, searchBar.value !== ""));
searchBar.addEventListener("input", () => showJuniorSale(1, searchBar.value !== ""));