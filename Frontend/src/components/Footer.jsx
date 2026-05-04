import React from 'react';

export default function Footer() {
  return (
    <div className="bg-[#0f172a] text-gray-300">
      {/* Decorative top border with gradient */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <footer className="footer footer-center p-10 bg-[#0f172a] flex flex-col items-center gap-8">
        {/* LOGO / BRAND SECTION */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg">
            <span className="font-black text-xl italic text-white">EH</span>
          </div>
          <p className="font-bold text-xl text-white tracking-tight">
            RIT's <span className="text-purple-500">EventHub</span>
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="grid grid-flow-col gap-6 text-sm font-medium uppercase tracking-wider">
          <a className="link link-hover hover:text-purple-400 transition-colors">About us</a>
          <a className="link link-hover hover:text-purple-400 transition-colors">Contact</a>
          <a className="link link-hover hover:text-purple-400 transition-colors">Jobs</a>
          <a className="link link-hover hover:text-purple-400 transition-colors">Press kit</a>
        </nav>

        {/* SOCIAL ICONS */}
        <nav>
          <div className="grid grid-flow-col gap-6">
            <a className="hover:text-purple-500 transition-transform hover:-translate-y-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a className="hover:text-purple-500 transition-transform hover:-translate-y-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a className="hover:text-purple-500 transition-transform hover:-translate-y-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>

        {/* COPYRIGHT */}
        <aside className="text-center border-t border-gray-800 w-full pt-8">
          <p className="text-gray-500 text-sm">
            Copyright © {new Date().getFullYear()} - All rights reserved by{' '}
            <span className="text-gray-300 font-semibold">RIT EventHub Team</span>
          </p>
        </aside>
      </footer>
    </div>
  );
}