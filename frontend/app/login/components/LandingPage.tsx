'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GraduationCap } from 'lucide-react';

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-primary">Arizona State University</h1>
          <p className="text-muted-foreground">CSE 230: Computer Org/Assemb Lang Prog</p>
        </div>
        
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-1">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Choose an option to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => router.push('/register')} 
              className="w-full"
              size="lg"
            >
              Sign Up
            </Button>
            <Button 
              onClick={() => router.push('/login')} 
              className="w-full"
              variant="outline"
              size="lg"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
