let db;
const request = indexedDB.open("budget-tracker", 1);

// if database verion changes, reload object store
request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = function(e) {
    db = e.target.result;

    // check if application is online or offline
    if (navigator.onLine) {
        // if yes, upload data
        uploadTransaction();
    };
};

request.onerror = function(e) {
    console.log(e.target.errorCode);
};

function saveRecord(record) {
    // open new transaction
    const transaction = db.transaction(["new_transaction"], "readwrite");
    // access objectStore
    const transactionObjectStore = transaction.objectStore("new_transaction");
    // add record to objectStore
    transactionObjectStore.add(record);
};