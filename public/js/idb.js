let db;
const request = indexedDB.open("budget-tracker", 1);

// if database verion changes, reload object store
request.onupgradeneeded = function(e) {
    const db = event.target.result;
    db.createObjectStore("new_transaction", { autoIncrement: true });
};