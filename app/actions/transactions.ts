'use server';

import { 
  addTransaction, 
  addTasks, 
  addCalendarEvents, 
  updateTaskStatus,
  Transaction, 
  Task, 
  CalendarEvent 
} from '@/lib/google-sheets';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export async function createTransaction(formData: FormData) {
  const transactionId = uuidv4();
  
  const transaction: Transaction = {
    TransactionID: transactionId,
    ClientNames: formData.get('ClientNames') as string,
    Address: formData.get('Address') as string,
    TransactionType: formData.get('TransactionType') as any,
    Status: 'DepositsPending',
    EffectiveDate: formData.get('EffectiveDate') as string,
    DDDeadlineDate: formData.get('DDDeadlineDate') as string || '',
    ClosingDate: formData.get('ClosingDate') as string,
    PurchasePrice: formData.get('PurchasePrice') as string,
    DDAmount: formData.get('DDAmount') as string || '0',
    DDReceived: 'No',
    EMAmount: formData.get('EMAmount') as string || '0',
    EMReceived: 'No',
    EMHolder: formData.get('EMHolder') as string || '',
    EMReceiptLink: '',
    BuilderDepositAmount: formData.get('BuilderDepositAmount') as string || '0',
    BuilderDepositPaid: 'No',
    DriveFolderLink: '',
    eXpComplianceLink: '',
    AssignedTo: formData.get('AssignedTo') as string || 'TC',
    Notes: formData.get('Notes') as string || '',
  };

  // 1. Add Transaction
  await addTransaction(transaction);

  // 2. Generate Tasks
  const tasks: Task[] = [];
  const commonTasks = [
    { name: 'Upload Contract to Drive', owner: 'TC' },
    { name: 'Send Intro Emails', owner: 'TC' },
    { name: 'Verify EM Receipt', owner: 'TC' },
    { name: 'Submit to Compliance', owner: 'TC' },
  ];

  const resaleTasks = [
    { name: 'Order Inspection', owner: 'Admin' },
    { name: 'Review DD Deadline', owner: 'TC' },
    { name: 'Schedule Closing', owner: 'TC' },
  ];

  const newConstTasks = [
    { name: 'Verify Builder Deposit', owner: 'TC' },
    { name: 'Schedule Framing Walk', owner: 'Admin' },
    { name: 'Schedule Final Walk', owner: 'Admin' },
  ];

  const selectedTasks = transaction.TransactionType === 'Resale' ? resaleTasks : newConstTasks;
  
  [...commonTasks, ...selectedTasks].forEach(t => {
    tasks.push({
      TaskID: uuidv4(),
      TransactionID: transactionId,
      TaskName: t.name,
      Owner: t.owner as any,
      DueDate: transaction.EffectiveDate, // Default to effective date, can be adjusted
      Status: 'NotStarted',
      Notes: '',
      Link: '',
    });
  });

  await addTasks(tasks);

  // 3. Generate Calendar Events
  const events: CalendarEvent[] = [
    {
      EventID: uuidv4(),
      TransactionID: transactionId,
      EventType: 'Effective',
      EventDate: transaction.EffectiveDate,
      Title: `Effective: ${transaction.Address}`,
      Link: `/transactions/${transactionId}`,
    },
    {
      EventID: uuidv4(),
      TransactionID: transactionId,
      EventType: 'Closing',
      EventDate: transaction.ClosingDate,
      Title: `Closing: ${transaction.Address}`,
      Link: `/transactions/${transactionId}`,
    },
  ];

  if (transaction.TransactionType === 'Resale' && transaction.DDDeadlineDate) {
    events.push({
      EventID: uuidv4(),
      TransactionID: transactionId,
      EventType: 'DDDeadline',
      EventDate: transaction.DDDeadlineDate,
      Title: `DD Deadline: ${transaction.Address}`,
      Link: `/transactions/${transactionId}`,
    });
  }

  await addCalendarEvents(events);

  revalidatePath('/');
  redirect('/');
}

export async function updateTaskStatusAction(taskId: string, status: any) {
  await updateTaskStatus(taskId, status);
  revalidatePath('/transactions/[id]', 'page');
}
