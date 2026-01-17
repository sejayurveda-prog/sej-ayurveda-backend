import { google } from "googleapis";
import ENV from "./env.js";

/*
  Google Sheets acts as Database
  This file only initializes & exports the client
*/

const auth = new google.auth.JWT(
  ENV.GOOGLE_CLIENT_EMAIL,
  null,
  ENV.GOOGLE_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({
  version: "v4",
  auth
});

export const GOOGLE_SHEET_ID = ENV.GOOGLE_SHEET_ID;
export default sheets;
