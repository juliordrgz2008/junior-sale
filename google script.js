const ss = SpreadsheetApp.getActiveSpreadsheet();
const logSheet = ss.getSheetByName("log");
const inventorySheet = ss.getSheetByName("inventory");
const peopleSheet = ss.getSheetByName("people");

const lastInventoryRow = inventorySheet.getLastRow();
const lastPeopleRow = peopleSheet.getLastRow();

const peopleData = peopleSheet.getRange(2, 2, lastPeopleRow - 1, 5).getValues();
const inventoryData = inventorySheet.getRange(2, 1, lastInventoryRow - 1, 7).getValues();

function doGet(e) {

  if (e.parameter.action == "getInventory") {
    return ContentService.createTextOutput(JSON.stringify({ cellData: inventoryData })).setMimeType(ContentService.MimeType.JSON);
  }

  else {
    const data = peopleData.map(row => [
      row[0], // Name (B)
      row[2], // Grade (D)
      row[3], // Balance (E)
      row[4]  // Bolivares (F)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ cellData: data, inventory: inventoryData, debugMessage: "Version 5.0 Live - Column C Skipped" })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  if (e.parameter.action == "updateQuantity") {
    const postData = JSON.parse(e.postData.contents);
    const newId = postData.id;
    const newQuantity = postData.quantity;

    const rowIndex = inventoryData.findIndex(row => String(row[0]) === String(newId));
    if (rowIndex !== -1) {
      let newIndex = rowIndex + 2;
      inventorySheet.getRange(newIndex, 4).setValue(newQuantity);

      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    }
  }
  else {
    const postData = JSON.parse(e.postData.contents);
    const transactions = postData.transactions;

    const logRows = transactions.map(t => [t.sellerID, t.buyer, t.item, t.cost, t.quantity, t.time]);
    logSheet.getRange(logSheet.getLastRow() + 1, 1, logRows.length, logRows[0].length).setValues(logRows);

    const buyerCosts = new Map();
    transactions.forEach(t => {
      const total = parseFloat(t.cost) * parseInt(t.quantity);
      const name = t.buyer.trim();
      buyerCosts.set(name, (buyerCosts.get(name) || 0) + total);
    });

    buyerCosts.forEach((totalCost, buyerName) => {
      const rowIndex = peopleData.findIndex(row => row[0].toString().trim() === buyerName);
      if (rowIndex !== -1) {
        const actualRowNumber = rowIndex + 2;
        const currentBalance = peopleData[rowIndex][3]; // El Balance está en el índice 3 del rango (Col E)
        peopleSheet.getRange(actualRowNumber, 5).setValue(currentBalance - totalCost);
      }
    });
  }

  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}