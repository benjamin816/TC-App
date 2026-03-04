'use client';

import Calendar from 'react-calendar';
import { CalendarEvent } from '@/lib/google-sheets';
import { useState } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import Link from 'next/link';
import { ArrowRight, Calendar as CalendarIcon, MapPin } from 'lucide-react';

export default function CalendarComponent({ events }: { events: CalendarEvent[] }) {
  const [value, onChange] = useState(new Date());

  const selectedDateEvents = events.filter(event => 
    isSameDay(parseISO(event.EventDate), value)
  );

  function tileContent({ date, view }: { date: Date, view: string }) {
    if (view === 'month') {
      const dayEvents = events.filter(event => isSameDay(parseISO(event.EventDate), date));
      if (dayEvents.length > 0) {
        return <div className="event-dot"></div>;
      }
    }
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Calendar 
          onChange={(val) => onChange(val as Date)} 
          value={value} 
          tileContent={tileContent}
          className="shadow-xl border-stone-200"
        />
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h3 className="font-serif italic text-xl mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            {format(value, 'MMMM do, yyyy')}
          </h3>
          
          <div className="space-y-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <Link 
                  key={event.EventID}
                  href={event.Link}
                  className="block p-4 rounded-xl border border-stone-100 bg-stone-50 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      event.EventType === 'Closing' ? 'bg-red-100 text-red-700' :
                      event.EventType === 'DDDeadline' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {event.EventType}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="font-bold text-stone-900">{event.Title}</p>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-stone-400 italic">
                <p>No events scheduled for this day.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg">
          <h4 className="font-bold mb-2">Legend</h4>
          <ul className="space-y-2 text-sm text-emerald-100">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Effective Date
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              DD Deadline
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              Closing Date
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
