'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LayoutDashboard, PlusCircle, CheckSquare, Calendar, LogOut, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Pipeline', href: '/', icon: LayoutDashboard },
    { name: 'New Intake', href: '/transactions/new', icon: PlusCircle },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  if (!session) {
    return (
      <nav className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">RE</div>
          <span className="font-serif italic text-xl tracking-tight">RE-Sync</span>
        </div>
        <button 
          onClick={() => signIn('google')}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Sign In
        </button>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-stone-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">RE</div>
          <span className="font-serif italic text-xl tracking-tight">RE-Sync</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href 
                  ? "bg-stone-100 text-emerald-700" 
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-700 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200">
          <User className="w-4 h-4 text-stone-400" />
          {session.user?.name}
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
            {session.user?.role}
          </span>
        </div>
        <button 
          onClick={() => signOut()}
          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
