import { google } from 'googleapis';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSheetsClient() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.accessToken) {
    throw new Error('Not authenticated or missing access token');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken as string });

  return google.sheets({ version: 'v4', auth });
}

export const SHEET_ID = process.env.GOOGLE_SHEET_ID;

export const TRANSACTIONS_HEADERS = [
  'TransactionID', 'ClientNames', 'Address', 'TransactionType', 'Status',
  'EffectiveDate', 'DDDeadlineDate', 'ClosingDate', 'PurchasePrice',
  'DDAmount', 'DDReceived', 'EMAmount', 'EMReceived', 'EMHolder', 'EMReceiptLink',
  'BuilderDepositAmount', 'BuilderDepositPaid', 'DriveFolderLink', 'eXpComplianceLink',
  'AssignedTo', 'Notes'
];

export const TASKS_HEADERS = [
  'TaskID', 'TransactionID', 'TaskName', 'Owner', 'DueDate', 'Status', 'Notes', 'Link'
];

export const CALENDAR_HEADERS = [
  'EventID', 'TransactionID', 'EventType', 'EventDate', 'Title', 'Link'
];

export async function getTransactions(): Promise<Transaction[]> {
  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Transactions!A2:U',
  });
  return mapRowsToObjects<Transaction>(response.data.values || [], TRANSACTIONS_HEADERS);
}

export async function getTasks(): Promise<Task[]> {
  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Tasks!A2:H',
  });
  return mapRowsToObjects<Task>(response.data.values || [], TASKS_HEADERS);
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'CalendarEvents!A2:F',
  });
  return mapRowsToObjects<CalendarEvent>(response.data.values || [], CALENDAR_HEADERS);
}

export async function addTransaction(transaction: Transaction) {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Transactions!A2',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: mapObjectsToRows([transaction], TRANSACTIONS_HEADERS),
    },
  });
}

export async function addTasks(tasks: Task[]) {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Tasks!A2',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: mapObjectsToRows(tasks, TASKS_HEADERS),
    },
  });
}

export async function addCalendarEvents(events: CalendarEvent[]) {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'CalendarEvents!A2',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: mapObjectsToRows(events, CALENDAR_HEADERS),
    },
  });
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const transactions = await getTransactions();
  return transactions.find(t => t.TransactionID === id) || null;
}

export async function getTasksByTransactionId(id: string): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter(t => t.TransactionID === id);
}

export async function updateTaskStatus(taskId: string, status: Task['Status']) {
  const sheets = await getSheetsClient();
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex(t => t.TaskID === taskId);
  
  if (taskIndex === -1) return;

  // Sheets are 1-indexed, headers are row 1, so data starts at row 2
  const rowNumber = taskIndex + 2;
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Tasks!F${rowNumber}`, // Column F is Status
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[status]],
    },
  });
}

export type Transaction = {
  TransactionID: string;
  ClientNames: string;
  Address: string;
  TransactionType: 'Resale' | 'NewConstruction';
  Status: 'DepositsPending' | 'DueDiligence' | 'BuilderActive' | 'Financing' | 'ClearToClose' | 'Closed' | 'Terminated' | 'Archived';
  EffectiveDate: string;
  DDDeadlineDate: string;
  ClosingDate: string;
  PurchasePrice: string;
  DDAmount: string;
  DDReceived: 'Yes' | 'No';
  EMAmount: string;
  EMReceived: 'Yes' | 'No';
  EMHolder: string;
  EMReceiptLink: string;
  BuilderDepositAmount: string;
  BuilderDepositPaid: 'Yes' | 'No';
  DriveFolderLink: string;
  eXpComplianceLink: string;
  AssignedTo: string;
  Notes: string;
};

export type Task = {
  TaskID: string;
  TransactionID: string;
  TaskName: string;
  Owner: 'Admin' | 'TC';
  DueDate: string;
  Status: 'NotStarted' | 'Waiting' | 'Done';
  Notes: string;
  Link: string;
};

export type CalendarEvent = {
  EventID: string;
  TransactionID: string;
  EventType: 'Effective' | 'DDDeadline' | 'Closing';
  EventDate: string;
  Title: string;
  Link: string;
};

// Helper to map sheet rows to objects
export function mapRowsToObjects<T>(rows: any[][], headers: string[]): T[] {
  if (!rows || rows.length === 0) return [];
  return rows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj as T;
  });
}

// Helper to map objects to sheet rows
export function mapObjectsToRows<T>(objects: T[], headers: string[]): any[][] {
  return objects.map(obj => {
    return headers.map(header => (obj as any)[header] || '');
  });
}
