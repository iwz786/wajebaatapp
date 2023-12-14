import { FormDataInterface } from "@/app/interfaces/form-data.interface";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { Session } from "inspector";


const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const MASTER_SHEET_ID = process.env.MASTER_SHEET_ID;

let tableHeaders: [string] | undefined = undefined;

const columnMappings: { [key: string]: string } = {
  "Receipt Date": "receiptDate",
  "Receipt No": "receiptNo",
  "ITS ID": "itsId",
  Jamaat: "jamaat",
  Name: "name",
  "Paid Amount": "paidAmount",
  "Paid Currency": "paidCurrency",
  "Paid Amount In Words": "paidAmountInWords",
  "TXN ID": "txnId",
  "TXN Date": "txnDate",
  "Cheque No": "chequeNo",
  "Cheque Date": "chequeDate",
  "Takhmeem Amount": "takhmeemAmount",
  "Takhmeem Currency": "takhmeemCurrency",
  UUID: "uuid",
  "Code": "code",
};

const appendReceiptIdRange = (range: string) => range.replace(/P/g, "Q");

const getReceiptIdFromRowData = (rowData: any) => {
  const receiptIdIndex = rowData.values[0].length - 1;
  return rowData.values[0][receiptIdIndex];
}

interface SheetResponse {
  success: boolean;
  receiptId: string;
}

export async function POST(request: Request) {

  // Access the environment variable containing the JSON content
  const serviceAccountJSON = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON;

  const session = await getServerSession(authOptions);

  const body: FormDataInterface = await request.json();
  body['code'] = session?.code;

  try {

    // Parse the JSON content for authentication
    const credentials = JSON.parse(serviceAccountJSON);


    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: "v4", auth });

    if (!tableHeaders) {
      tableHeaders = await fetchHeaders(sheets, session);
    }

    const requestBody = createValuesArray(body);

    // Example: Inserting a row into Sheet
    const insertRequest = {
      spreadsheetId: session?.sheetId,
      range: "Sheet1", // Update with your sheet name
      valueInputOption: "RAW",
      resource: {
        values: [requestBody],
      },
    };

    const insertResponse = await sheets.spreadsheets.values.append(
      insertRequest
    );

    const updates = insertResponse.data.updates;
    let globalReceiptId = ""
    if (updates && updates.updatedRange) {
      let updatedRowRange = updates.updatedRange;

      const modifiedRowRange: string = appendReceiptIdRange(updatedRowRange);

      const sheetRow = await sheets.spreadsheets.values.get({
        spreadsheetId: session?.sheetId,
        range: modifiedRowRange,
      })

      if (sheetRow.data) {
        const receiptId = getReceiptIdFromRowData(sheetRow.data);
        globalReceiptId = receiptId
        requestBody[requestBody.length - 1] = receiptId;


        const masterDatasheetInsertRequest = {
          spreadsheetId: MASTER_SHEET_ID,
          range: "Sheet1", // Update with your sheet name
          valueInputOption: "RAW",
          resource: {
            values: [requestBody],
          },
        };

        await sheets.spreadsheets.values.append(
          masterDatasheetInsertRequest
        );
      }
    }

    return Response.json({ status: "success", receiptId: globalReceiptId });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ status: "failure" });
  }
}

async function fetchHeaders(sheets: any, session: any) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: session.sheetId,
    range: "Sheet1!1:1",
  });
  return response.data.values[0];
}

function createValuesArray(data: FormDataInterface) {
  return tableHeaders?.map((header) => {
    return data[columnMappings[header] as keyof typeof data];
  });
}

export async function GET() {
  return Response.json({ status: "success" });
}
