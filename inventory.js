const url = "https://script.google.com/macros/s/AKfycbyQmhLUBAc1oA141M5th7SJjMshLHMQaYHZdvtfS4H7nOAdWw9vA-9Wmqa5fI7X0RSH/exec";
const action = "?action=getInventory"
const juniorSaleAPI = url + action;

const inventory = []
const element = {
    item: [],
    name: [],
    cost: [],
    quantity: [],
    addItem: [],
    subItem: [],
    photo: [],

}


function debounce(func, timeout) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}


async function getJuniorSale() {
    const response = await fetch(juniorSaleAPI);
    const data = await response.json();

    globalThis.cellData = data.cellData;

    console.log(cellData);
    for (row in cellData) {
        let temp = {}
        temp.id = cellData[row][0];
        temp.name = cellData[row][1];
        temp.cost = cellData[row][2];
        temp.quantity = cellData[row][3];
        temp.photo = cellData[row][4];
        temp.type = cellData[row][5];
        temp.show = cellData[row][6];
        inventory.push(temp);
    }


    for (let i = 0; i < 8; i++) {
        element.item.push(document.getElementById("item" + i));
        element.name.push(document.getElementById("name" + i));
        element.cost.push(document.getElementById("cost" + i));
        element.quantity.push(document.getElementById("quantity" + i));
        element.addItem.push(document.getElementById("addItem" + i));
        element.subItem.push(document.getElementById("subItem" + i));
        element.photo.push(document.getElementById("photo" + i));
    }

    domLoaded();
    displayItems();
}

const loading = document.getElementById("loading");
const mainDiv = document.getElementById("mainDiv");
const mainDivSub = document.getElementById("mainDivSub");

function domLoaded() {
    loading.hidden = true;
    mainDiv.style = "";
}

const changes = [];

getJuniorSale();
function displayItems() {
    var rowEntries = 0;
    var currentRow = null;
    const debouncedSave = debounce(saveChanges, 3000)

    function saveChanges() {
        console.log('Here');
    }

    inventory.forEach((item) => {
        if (item.show == true) {

            if (rowEntries === 0 || rowEntries === 3) {
                const rowId = `row-${Math.random().toString(36).substr(2, 9)}`; // Unique ID for the row
                const htmlDiv = `<div style="gap: 2%; flex-wrap: wrap; display: flex;" id="${rowId}" class="mainDivSub"></div>`;

                mainDivSub.insertAdjacentHTML('beforeend', htmlDiv);
                currentRow = document.getElementById(rowId);
                rowEntries = 0;
            }

            const htmlItem = `
            <div style="background-color: whitesmoke; padding: 5%;">
                <img width="150px" height="150px" src="${item.photo}">
                <p style="margin: 0;">${item.name}</p>
                <p style="margin: 0;">$${item.cost}</p>
                <div style="gap: 3%; text-align: center; justify-content: space-around;" class="itemDisplay">
                    <button id="addButton${item.id}" class="quantityButton">+</button>
                    <input value="${item.quantity}" id="qtyDisplay${item.id}" class="quantitySelector" type="tel" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                    <button id="subButton${item.id}" class="quantityButton">-</button>
                </div>
            </div>
        `;

            currentRow.insertAdjacentHTML('beforeend', htmlItem);
            rowEntries++;

            const addButton = document.getElementById(`addButton${item.id}`);
            const subButton = document.getElementById(`subButton${item.id}`);
            const qtyDisplay = document.getElementById(`qtyDisplay${item.id}`);
            function updateQuantity() {
                qtyDisplay.value = item.quantity;
                fetch(url + "?action=updateQuantity", {
                    mode: "no-cors",
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({ id: item.id, quantity: item.quantity }),
                })
                    .then(response => console.log('Sheet updated!'))
                    .catch(error => console.error('Error!', error.message));
            }

            function change(quantity) {

                let x = changes.findIndex(c => c.id === item.id)
                if (x !== -1) {
                    changes[x].quantity = Number(changes[x].quantity) + Number(quantity);
                    qtyDisplay.value = changes[x].quantity;
                }
                else {
                    let changeEntry = { id: item.id, quantity: Number(quantity) };
                    changes.push(changeEntry);
                    qtyDisplay.value = changeEntry.quantity;
                    console.log(changes);
                    debouncedSave();
                }

            }

            qtyDisplay.addEventListener("input", function () {
                change(qtyDisplay.value);
            })

            addButton.addEventListener("click", function () {
                change(1);
            });

            subButton.addEventListener("click", function () {
                change(-1);
            });
        }
    });
}


function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
