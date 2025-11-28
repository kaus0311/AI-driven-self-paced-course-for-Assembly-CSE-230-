import Link from "next/link";

export default async function ModuleDetailPage(
  { params }: { params: Promise<{id: string} > }
) {
  const { id } = await params; 
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back to Modules */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Modules</span>
        </Link>

        {/* Module Title and Description */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-black mb-2">Module 1: Introduction to Computer Architecture</h2>
            <p className="text-gray-600 text-lg">Abstraction layers, performance metrics, instruction sets, MIPS basics.</p>
          </div>
          <div className="ml-6">
            <span className="bg-[#800020] text-white px-6 py-2 rounded-full text-sm font-semibold">
              92% Mastery
            </span>
          </div>
        </div>

        {/* Module Progress */}
        <div className="flex items-center gap-4 mb-8">
          <span className="font-semibold text-black text-sm">Module Progress</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-[#800020] h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <span className="text-black font-semibold">100%</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 border-b border-gray-300 mb-6">
          <button className="px-6 py-3 font-semibold text-black border-b-2 border-black">
            Learning Content
          </button>
          <Link
            href={`/module/${id}/mastery`}               
            className="px-6 py-3 text-gray-600 hover:text-black"
          >
            Practice & Mastery
          </Link>
          <button className="px-6 py-3 text-gray-600 hover:text-black transition-colors">
            Coding Sandbox
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Readings Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-xl font-semibold text-black">Readings</h3>
            </div>

            <div className="space-y-0">
              {/* Reading 1 */}
              <div className="flex items-center py-4 border-b border-gray-200">
                <div className="w-6 h-6 mr-4 rounded-full bg-[#800020] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">Computer Abstraction and Technology</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">20 min</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Reading 2 */}
              <div className="flex items-center py-4 border-b border-gray-200">
                <div className="w-6 h-6 mr-4 rounded-full bg-[#800020] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">Performance Metrics: CPI, Clock Rate</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">18 min</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Reading 3 */}
              <div className="flex items-center py-4 border-b border-gray-200">
                <div className="w-6 h-6 mr-4 rounded-full bg-[#800020] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">Instruction Set Principles</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">22 min</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Reading 4 */}
              <div className="flex items-center py-4">
                <div className="w-6 h-6 mr-4 rounded-full bg-[#800020] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">Introduction to MIPS Architecture</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">25 min</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Video Lessons Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-black">Video Lessons</h3>
            </div>

            <div className="space-y-0">
              {/* Video 1 */}
              <div className="flex items-center py-4 border-b border-gray-200">
                <div className="w-6 h-6 mr-4 rounded-full bg-[#800020] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">Overview of Computer Architecture</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">15 min</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Video 2 */}
              <div className="flex items-center py-4 border-b border-gray-200">
                <div className="w-6 h-6 mr-4 rounded-full bg-[#800020] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">Performance Evaluation Techniques</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">18 min</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Video 3 */}
              <div className="flex items-center py-4 border-b border-gray-200">
                <div className="w-6 h-6 mr-4 rounded-full bg-[#800020] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">MIPS Assembly Basics</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">25 min</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Video 4 */}
              <div className="flex items-center py-4">
                <div className="w-6 h-6 mr-4 rounded-full bg-[#800020] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-medium">MIPS Instruction Set Deep Dive</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">30 min</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

