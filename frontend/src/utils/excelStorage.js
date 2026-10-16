
const DB_NAME = "LeadSpaceExcelDB";
const STORE_NAME = "excelFiles";
const FILE_KEY = "masterExcel";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);
  });
};

// Save selected Excel file handle
export const saveExcelHandle = async (handle) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).put(handle, FILE_KEY);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

// Get previously selected Excel file
export const getExcelHandle = async () => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");

    const request = transaction.objectStore(STORE_NAME).get(FILE_KEY);

    request.onsuccess = () => resolve(request.result || null);

    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
};
