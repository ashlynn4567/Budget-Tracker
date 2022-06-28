let db;
const request = indexedDB.open("budget_tracker", 1);

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

// run error handling for database
request.onerror = function(e) {
    console.log(e.target.errorCode);
};

// save transaction if no internet connection exists
function saveRecord(record) {
    // open new transaction
    const transaction = db.transaction(["new_transaction"], "readwrite");
    // access objectStore
    const transactionObjectStore = transaction.objectStore("new_transaction");
    // add record to objectStore
    transactionObjectStore.add(record);
};

// once online connection is reestablished, upload data
function uploadTransaction() {
    const transaction = db.transaction(["new_transaction"], "readwrite");
    const transactionObjectStore = transaction.objectStore("new_transaction");

    // set all records from object store to a variable
    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST", 
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, test/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                };
                const transaction = db.transaction(["new_transaction", "readwrite"]);
                const transactionObjectStore = transaction.objectStore("new_transaction");

                // clear store
                transactionObjectStore.clear();
                alert("All saved transactions have been uploaded!");
            })
            .catch(err => console.log(err));
        };
    };
};

// listen for app to come online
window.addEventListener("online", uploadTransaction);