// import { ModeToggle } from "@/components/mode-toggle";
import { SignInButton } from "@clerk/clerk-react";

export default function ContinueWithGoogle() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-primary"
          >
            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
          </svg>
          <span className="text-xl font-bold text-primary">Chat Hive</span>
          {/* <ModeToggle /> */}
        </div>
        <div>
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-full bg-white dark:text-gray-700 text-primary border border-primary hover:bg-primary hover:text-white transition-colors duration-300 shadow-sm">
              Log In
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:py-0 max-w-7xl mx-auto">
        <div className="md:w-1/2 space-y-6 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
            Connect with <span className="text-primary">Chat Hive</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
            Real-time messaging, group chats, and media sharing in one beautiful, secure platform.
          </p>
          <div className="pt-4">
            <SignInButton mode="modal">
              <button className="px-8 py-3 rounded-full bg-primary text-white dark:text-gray-700 hover:bg-primary/90 transition-colors duration-300 shadow-md text-lg font-medium">
                Get Started
              </button>
            </SignInButton>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Secure Messaging</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Group Chats</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Media Sharing</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 dark:bg-gray-700/30"></div>
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-indigo-400/10 rounded-full filter blur-3xl opacity-70 dark:bg-gray-700/30"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 bg-primary/5 dark:bg-primary/10 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                  <span className="font-semibold text-gray-800 dark:text-white">Chat Hive</span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">A</div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-gray-800 dark:text-gray-200">Hey! Welcome to Chat Hive! 👋</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">10:24 AM</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 flex flex-col items-end">
                    <div className="bg-primary p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                      <p className="text-white dark:text-gray-700">Thanks! This looks amazing!</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">10:26 AM</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">Y</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">A</div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-gray-800 dark:text-gray-200">You can create groups and share photos too!</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">10:28 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Chat Hive. All rights reserved.</p>
      </footer>
    </div>
  );
}