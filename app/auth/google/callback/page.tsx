"use client";

import { AuthService } from '@/services/auth.service';
import { useEffect, useState } from 'react';
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function GoogleCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const authService = new AuthService();

    async function handleCallback() {
      if (!code) {
        setError("No authorization code found");
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
        return;
      }

      try {
        const res = await authService.google_callback(code);
        document.cookie = `access_token=${res.access_token}; path=/;`;
        window.location.href = '/dashboard';
      } catch (err) {
        console.error("Google callback error:", err);
        setError("Authentication failed. Redirecting to login...");
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-2">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {error ? "Authentication Failed" : "Authenticating..."}
          </CardTitle>
          <CardDescription className="text-lg">
            {error || "Please wait while we connect your Google Calendar."}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}