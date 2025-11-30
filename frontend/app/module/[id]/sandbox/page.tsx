import Link from "next/link";
import CodingSandbox from "../sandbox";

export async function generateStaticParams() {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"].map((id) => ({
    id,
  }));
}

export default async function SandboxPage({ params }: { params: Promise<{ id: string }> }) {
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
            <Link href={`/module/${id}`} className="text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Module</span>
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
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-2 mb-6">
          <p className="text-sm uppercase tracking-wider text-[#800020]">Module {id}</p>
          <h1 className="text-3xl font-bold text-gray-900">Coding Sandbox</h1>
          <p className="text-gray-600">
            Write and test your MIPS assembly code in this interactive sandbox environment.
          </p>
        </div>

        <CodingSandbox />
      </main>
    </div>
  );
}

