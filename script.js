let numPayees = 1;
let payees = ['Me'];
let payeesAmt = [0]; 
// let billItems = []; 
// let billPrices = []; 
// let billWho = [];

let billItemsFixed = {}; 

let itemCount = 0;
let idCount = 0; 
let dropdownOpen = false; 

const BILL = document.getElementById('bill');
const ADD_FORM_ITEM = document.getElementById('add-item-item');
const ADD_FORM_PRICE = document.getElementById('add-item-price');
const PAYEES = document.getElementById('payees');
const ADD_PAYEE_NAME = document.getElementById('add-payee-name'); 

function addItem(event) { 
    event.preventDefault();
    
    const newItem = ADD_FORM_ITEM.value;
    const newPrice = parseFloat(ADD_FORM_PRICE.value);

    addItemToStore(newItem, newPrice);

    const newBillItem = createBillItem(newItem, newPrice);
    BILL.appendChild(newBillItem);

    update(); 

    ADD_FORM_ITEM.value = null; 
    ADD_FORM_PRICE.value = null; 
}

function addPayee(event) {
    event.preventDefault();

    if (dropdownOpen) {
        document.getElementById('dropdown').remove();
        dropdownOpen = false;
    }
    
    const newName = ADD_PAYEE_NAME.value; 

    addPayeeToArrays(newName);

    const newPayee = createNewPayee(newName); 
    PAYEES.appendChild(newPayee); 

    update(); 

    ADD_PAYEE_NAME.value = null;
}

function createNewPayee(name, amt = 0) {
    const payeeId = numPayees - 1; 
    const newPayee = document.createElement('div');
    newPayee.className = 'payee';
    newPayee.id = `payee${payeeId}`;
    newPayee.innerHTML = `${name}: $`; 

    // create entry for price 
    const newAmt = document.createElement('span');
    newAmt.id = `amt${payeeId}`
    newAmt.innerHTML = amt; 

    newPayee.appendChild(newAmt); 
    console.log(newPayee);
    return newPayee; 
}

function addItemToStore(newItem, newPrice, newWho = 'All') {
    // billItemsFixed[itemCount] = [newItem, newPrice, newWho]; 
    billItemsFixed = {...billItemsFixed, [idCount]: [newItem, newPrice, newWho]}
    console.log(billItemsFixed); 
    itemCount++; idCount ++;
}

function addPayeeToArrays(newName, newAmt = 0) {
    numPayees = payees.push(newName); 
    payeesAmt.push(newAmt); 
    console.log(payees, payeesAmt, numPayees); 
}

function calcShared() {
    console.log(billItemsFixed);
    let sharedSum = 0; 
    for (let i = 0; i < idCount; i++) {
        const currEntry = billItemsFixed[i]; 
        const currWho = currEntry ? currEntry[2] : currEntry; 
        if (currWho === 'All') {
            sharedSum += currEntry[1]; 
        }
    }
    const result = sharedSum / numPayees;
    return parseFloat(result.toFixed(2));
}

function update() {
    console.log(billItemsFixed); 
    for (let i = 0; i < numPayees; i++) {
        // get indiv amts
        const name = payees[i];  
        let indivAmt = 0; 
        for (let j = 0; j < idCount; j++) {
            const currEntry = billItemsFixed[j]; 
            const currWho = currEntry ? currEntry[2] : currEntry; 
            if (currWho === name) {
                indivAmt += currEntry[1]; 
            }
        }

        const element = document.getElementById(`amt${i}`);
        const shared = calcShared(); 
        console.log(shared, indivAmt); 
        const final = calcShared() + indivAmt;

        payeesAmt[i] = final; 
        element.innerHTML = final
    }
}

function initialise() {
    document.getElementById('add-item-form').addEventListener('submit', addItem);
    document.getElementById('add-payee-form').addEventListener('submit', addPayee); 
}

function createBillItem(name, price, who = 'All') {
    const billItemId = idCount - 1;
    // create a new tr 
    const newBillItem = document.createElement('tr'); 
    newBillItem.id = `billItem${billItemId}`;

    // create entry for item 
    const newItem = document.createElement('td');
    const itemId = `item${billItemId}`;
    newItem.id = itemId;
    newItem.innerHTML = name; 
    // create entry for price 
    const newPrice = document.createElement('td');
    newPrice.innerHTML = price; 
    newPrice.id = `price${billItemId}`;

    // create entry for who
    const whoId = `who${billItemId}`; 
    const newWho = document.createElement('td');
    newWho.innerHTML = who;
    newWho.className = 'who'; 
    newWho.id = whoId;
    newWho.addEventListener('click', () => displayDropdown(whoId)); 

    // create delete button
    const newDel = document.createElement('td');
    newDel.className = 'delete-item';  
    newDel.innerHTML = 'delete';
    newDel.addEventListener('click', () => deleteItem(billItemId))

    newBillItem.append(newItem, newPrice, newWho, newDel); 
    return newBillItem; 
}

function deleteItem(itemId) {
    // billItemsFixed[itemId] = undefined; 
    billItemsFixed = {...billItemsFixed, [itemId]: undefined}; 
    itemCount -= 1;
    
    document.getElementById('billItem' + itemId).remove(); 

    if (dropdownOpen) {
        removeDropdown(); 
    }
    console.log('deleted element, updating...', 'id is ' + itemId); 
    update(); 
}

function displayDropdown(id) {
    if (!dropdownOpen) {
        const element = document.getElementById(id)
        const rectPos = element.getBoundingClientRect(); 
        const menu = getDropdownPayeeList(id); 

        menu.style.position = 'absolute';
        menu.style.top = `${rectPos.bottom}px`;
        menu.style.left = `${rectPos.left}px`;  
        menu.style.backgroundColor = 'black';
        menu.style.color = 'white';

        document.body.appendChild(menu); 
        dropdownOpen = true; 
    } else {
        removeDropdown(); 
    }
}

function getDropdownPayeeList(whoId) {
    const list = document.createElement('div'); 
    list.id = 'dropdown'; 
    const menuItems = [...payees, 'All'];

    menuItems.map((payee) => {
        const p = document.createElement('div'); 
        p.innerHTML = payee; 
        p.className = 'dropdown-item';
        p.addEventListener('click', () => dropdownSelect(payee, whoId)); 
        list.appendChild(p); 
    })

    return list;
}

function removeDropdown() {
    dropdownOpen = false; 
    document.getElementById('dropdown').remove(); 
}

function dropdownSelect(payee, whoId) {
    // get the 'who' element of the affected row and change the payee 
    const affectedWho = document.getElementById(whoId); 

    // update 'who' element
    affectedWho.innerHTML = payee;
    const itemId = parseInt(whoId.substr(3));
    billItemsFixed[itemId][2] = payee; 

    update(); 

    removeDropdown(); 
}

initialise();