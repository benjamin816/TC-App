import { getCalendarEvents } from '@/lib/google-sheets';
import Navbar from '@/components/Navbar';
import CalendarComponent from '@/components/CalendarComponent';
import { Calendar as CalendarIcon } from 'lucide-react';

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-serif italic tracking-tight text-stone-900 mb-2">Calendar</h1>
          <p className="text-stone-500">Track key deadlines and closing dates across all transactions.</p>
        </header>

        <CalendarComponent events={events} />
      </main>
    </div>
  );
}
