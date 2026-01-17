import { google } from "googleapis";
import ENV from "../config/env.js";

/* =========================================================
   GOOGLE AUTH
========================================================= */
const auth = new google.auth.JWT(
  ENV.GOOGLE_CLIENT_EMAIL,
  null,
  ENV.GOOGLE_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

/* =========================================================
   GET ALL ROWS
========================================================= */
export const getAllRows = async (sheetName) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: ENV.GOOGLE_SHEET_ID,
      range: sheetName
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || "";
      });
      return obj;
    });

  } catch (error) {
    console.error("Google Sheet get error:", error.message);
    throw new Error("Failed to read Google Sheet");
  }
};

/* =========================================================
   ADD ROW
========================================================= */
export const addRow = async (sheetName, data) => {
  try {
    const headersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: ENV.GOOGLE_SHEET_ID,
      range: sheetName
    });

    const headers = headersResponse.data.values?.[0];
    if (!headers) throw new Error("Sheet headers missing");

    const row = headers.map(h => data[h] ?? "");

    await sheets.spreadsheets.values.append({
      spreadsheetId: ENV.GOOGLE_SHEET_ID,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row]
      }
    });

    return true;

  } catch (error) {
    console.error("Google Sheet add error:", error.message);
    throw new Error("Failed to insert data into Google Sheet");
  }
};

/* =========================================================
   UPDATE ROW BY ID
========================================================= */
export const updateRowById = async (sheetName, id, updates) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: ENV.GOOGLE_SHEET_ID,
      range: sheetName
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      throw new Error("No data found");
    }

    const headers = rows[0];
    const idIndex = headers.indexOf("id");
    if (idIndex === -1) {
      throw new Error("ID column not found");
    }

    const rowIndex = rows.findIndex(
      (row, index) => index !== 0 && row[idIndex] === id
    );

    if (rowIndex === -1) {
      throw new Error("Row not found");
    }

    const updatedRow = headers.map(
      h => updates[h] ?? rows[rowIndex][headers.indexOf(h)] ?? ""
    );

    await sheets.spreadsheets.values.update({
      spreadsheetId: ENV.GOOGLE_SHEET_ID,
      range: `${sheetName}!A${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [updatedRow]
      }
    });

    return true;

  } catch (error) {
    console.error("Google Sheet update error:", error.message);
    throw new Error("Failed to update Google Sheet");
  }
};

/* =========================================================
   DELETE ROW BY ID
========================================================= */
export const deleteRowById = async (sheetName, id) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: ENV.GOOGLE_SHEET_ID,
      range: sheetName
    });

    const rows = response.data.values;
    const headers = rows[0];
    const idIndex = headers.indexOf("id");

    const rowIndex = rows.findIndex(
      (row, index) => index !== 0 && row[idIndex] === id
    );

    if (rowIndex === -1) {
      throw new Error("Row not found");
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: ENV.GOOGLE_SHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: await getSheetIdByName(sheetName),
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1
              }
            }
          }
        ]
      }
    });

    return true;

  } catch (error) {
    console.error("Google Sheet delete error:", error.message);
    throw new Error("Failed to delete row");
  }
};

/* =========================================================
   HELPER: GET SHEET ID BY NAME
========================================================= */
const getSheetIdByName = async (sheetName) => {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: ENV.GOOGLE_SHEET_ID
  });

  const sheet = meta.data.sheets.find(
    s => s.properties.title === sheetName
  );

  if (!sheet) {
    throw new Error("Sheet not found");
  }

  return sheet.properties.sheetId;
};
