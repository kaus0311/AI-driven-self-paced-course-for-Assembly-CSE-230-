async function getHealth() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/health`, { cache: 'no-store' });
    return await res.json();
  } catch (e) {
    return { error: 'backend not reachable' };
  }
}

export default async function Home() {
  const health = await getHealth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold">Capstone Next.js Frontend</h1>
      <p className="mt-4 text-gray-700">Backend /health: {JSON.stringify(health)}</p>
    </main>
  );
}


