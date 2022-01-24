let numPayees = 1;
let payees = ['Me'];
let payeesAmt = [0]; 
let billItems = []; 
let billPrices = []; 
let billWho = [];
let itemCount = 0; 
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

    addItemToArrays(newItem, newPrice);

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

function addItemToArrays(newItem, newPrice, newWho = 'All') {
    // push to arrays 
    billItems.push(newItem); 
    billPrices.push(newPrice);
    billWho.push(newWho); 
    itemCount++; 
}

function addPayeeToArrays(newName, newAmt = 0) {
    numPayees = payees.push(newName); 
    payeesAmt.push(newAmt); 
    console.log(payees, payeesAmt, numPayees); 
}

function calcShared() {
    let sharedSum = 0; 
    for (let i = 0; i < itemCount; i++) {
        const currWho = billWho[i]; 
        if (currWho === 'All') {
            sharedSum += billPrices[i]; 
        }
    }
    const result = sharedSum / numPayees;
    return parseFloat(result.toFixed(2));
}

function update() {
    for (let i = 0; i < numPayees; i++) {
        // get indiv amts
        const name = payees[i];  
        let indivAmt = 0; 
        billWho.map((payee, id) => {
            if (payee === name) {
                indivAmt += billPrices[id]; 
            }
        })

        const element = document.getElementById(`amt${i}`); 
        element.innerHTML = calcShared() + indivAmt;  
    }
}

function initialise() {
    document.getElementById('add-item-form').addEventListener('submit', addItem);
    document.getElementById('add-payee-form').addEventListener('submit', addPayee); 
}

function createBillItem(name, price, who = 'All') {
    const billItemId = itemCount - 1;
    // create a new tr 
    const newBillItem = document.createElement('tr'); 
    newBillItem.id = `billItem${billItemId}`;

    // create entry for item 
    const newItem = document.createElement('td');
    newItem.id = `item${billItemId}`;
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

    newBillItem.appendChild(newItem);
    newBillItem.appendChild(newPrice); 
    newBillItem.appendChild(newWho);
    return newBillItem; 
}

function displayDropdown(id) {
    if (!dropdownOpen) {
        const element = document.getElementById(id)
        const rectPos = element.getBoundingClientRect(); 
        console.log(rectPos.top, rectPos.right, rectPos.bottom, rectPos.left);
        const menu = getDropdownPayeeList(id); 

        menu.style.position = 'absolute';
        menu.style.top = `${rectPos.bottom}px`;
        menu.style.left = `${rectPos.left}px`;  
        menu.style.backgroundColor = 'black';
        menu.style.color = 'white';

        document.body.appendChild(menu); 
        // element.appendChild(menu); 
        dropdownOpen = true; 
    } else {
        document.getElementById('dropdown').remove(); 
        dropdownOpen = false; 
    }
}

function getDropdownPayeeList(whoId) {
    const list = document.createElement('div'); 
    list.id = 'dropdown'; 
    payees.map((payee) => {
        const p = document.createElement('div'); 
        p.innerHTML = payee; 
        p.className = 'dropdown-item';
        p.addEventListener('click', () => dropdownSelect(payee, whoId)); 
        list.appendChild(p); 
    })

    const forAll = document.createElement('div'); 
    forAll.innerHTML = 'All'; 
    forAll.className='dropdown-item'; 
    forAll.addEventListener('click', () => dropdownSelect('All', whoId));
    list.appendChild(forAll); 

    return list;
}

function dropdownSelect(payee, whoId) {
    // get the 'who' element of the affected row and change the payee 
    const affectedWho = document.getElementById(whoId); 

    // update 'who' element
    affectedWho.innerHTML = payee;
    const itemId = parseInt(whoId.substr(3));
    billWho[itemId] = payee; 

    // some function here to recalculate the expenses 
    update(); 

    // remove the dropdown menu 
    dropdownOpen = false;
    document.getElementById('dropdown').remove(); 
}

initialise();