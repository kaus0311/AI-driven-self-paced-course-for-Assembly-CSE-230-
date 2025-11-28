import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#800020] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 h-10 w-10 rounded flex items-center justify-center">
              <span className="text-[#800020] font-bold text-lg">CSE</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CSE 230</h1>
              <p className="text-sm text-white">Computer Systems</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17a5.5 5.5 0 010-9.663m5.197 0a5.5 5.5 0 010 9.663M7.5 21L7.5 9M16.5 21V9M12 21V9" />
              </svg>
              <span>AI Tutor</span>
            </Link>
            <Link href="#" className="text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Analytics</span>
            </Link>
            <Link href="#" className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Welcome back, Student!</h2>
          <p className="text-gray-600">Continue your mastery-based learning journey</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Modules Completed</p>
              <p className="text-3xl font-bold text-black">2/10</p>
            </div>
            <div className="text-[#800020]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall Mastery</p>
              <p className="text-3xl font-bold text-black">68%</p>
            </div>
            <div className="text-yellow-500">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Time on Task</p>
              <p className="text-3xl font-bold text-black">12.5h</p>
            </div>
            <div className="text-[#800020]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Achievements</p>
              <p className="text-3xl font-bold text-black">5</p>
            </div>
            <div className="text-yellow-500">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 border-b border-gray-300 mb-6">
          <button className="px-6 py-3 font-semibold text-black border-b-2 border-black">
            Learning Modules
          </button>
          <button className="px-6 py-3 text-gray-600 hover:text-black transition-colors">
            AI Tools
          </button>
          <button className="px-6 py-3 text-gray-600 hover:text-black transition-colors">
            Practice & Assessment
          </button>
        </div>

        {/* Core Modules Section */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Core Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module 1 */}
            <Link href="/module/1" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow relative">
              <svg className="w-5 h-5 absolute top-4 right-4 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-black mb-2">Module 1: Introduction to Computer Architecture</h3>
              <p className="text-gray-600 text-sm mb-4">Abstraction layers, performance metrics, instruction sets, MIPS basics</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-black">Progress</span>
                  <span className="text-black">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#800020] h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-black text-sm">Mastery Score</span>
                <span className="bg-[#800020] text-white px-4 py-1 rounded-full text-sm font-semibold">92%</span>
              </div>
            </Link>

            {/* Module 2 */}
            <Link href="/module/2" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-black mb-2">Module 2: MIPS Introduction, ALU and Data Transfer</h3>
              <p className="text-gray-600 text-sm mb-4">MIPS registers, arithmetic operations, load/store instructions, memory addressing</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-black">Progress</span>
                  <span className="text-black">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#800020] h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </Link>

            {/* Module 3 */}
            <Link href="/module/3" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-black mb-2">Module 3: Branch Instructions and Machine Code</h3>
              <p className="text-gray-600 text-sm mb-4">Conditional branching, jump instructions, encoding MIPS to machine code</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-black">Progress</span>
                  <span className="text-black">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#800020] h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
