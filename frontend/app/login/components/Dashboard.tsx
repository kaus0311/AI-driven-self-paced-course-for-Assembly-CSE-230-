'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LogOut, UserCircle } from 'lucide-react';

export function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleGoToModules = () => {
    router.push('/module/1');
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b-2 border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1>Dashboard</h1>
              <p className="text-sm text-muted-foreground">Arizona State University - CSE 230</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleGoToModules}>
                Go to Module 1
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-6 w-6" />
                Welcome, {user?.name ?? user?.email ?? 'learner'}!
              </CardTitle>
              <CardDescription>
                You have successfully registered and logged in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{user?.name ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user?.email ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="capitalize">{user?.role ?? 'student'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-sm">{user?.id ?? '—'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Your dashboard is ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is your personal dashboard. In a production application, this would contain
                your personalized content, analytics, settings, and more.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
