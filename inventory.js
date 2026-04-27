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

    displayItems();
    domLoaded();
}

const loading = document.getElementById("loading");
const mainDiv = document.getElementById("mainDiv");
const mainDivSub = document.getElementById("mainDivSub");

function domLoaded() {
    loading.hidden = true;
    mainDiv.style = "";
}


getJuniorSale();
function displayItems() {
    var rowEntries = 0;
    var row = 0;
    inventory.forEach((item, index) => {
        const htmlDiv = `
            <div style="gap: 2%; flex-wrap: wrap;" id="row${row}" class="mainDivSub flex"></div>
        `
        const htmlItem = `
            <div style="background-color: whitesmoke; padding: 5%;">
                <img width="150px" height="150px" src="${item.photo}">
                <p style="margin: 0;">${item.name}</p>
                <p style="margin: 0;">${item.cost}</p>
                <div style="gap: 3%; text-align: center; justify-content: space-around;" class="itemDisplay">
                    <button class="quantityButton">+</button>
                    <p>${item.quantity}</p>
                    <button class="quantityButton">-</button>
                </div>
            </div>
            `;
            if (rowEntries < 3) {
            lastElement = mainDivSub.lastElementChild;
            if (lastElement == null){
                mainDivSub.insertAdjacentHTML('beforeend', htmlDiv);
                row++;
            }
            else{
                lastElement.insertAdjacentHTML('beforeend', htmlItem);
                rowEntries++;
            }
        }
        else if (rowEntries == 3) {
            lastElement = mainDiv.lastElementChild;
            lastElement.insertAdjacentHTML('beforeend', htmlDiv);
            row++;
            rowEntries = 0;
        }

    });
}



