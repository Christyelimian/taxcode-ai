
'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Landmark } from 'lucide-react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle, signInWithGithub, signInWithFacebook, signInWithTwitter } from '@/lib/firebase-client';
import { createSession } from '../actions';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

function LoginPageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Service Unavailable',
        description: 'Authentication service is not configured.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const idToken = await userCredential.user.getIdToken();
      await createSession(idToken);

      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push(redirectTo);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!auth) return;
    setIsLoading(true);
    try {
      const { idToken } = await signInWithGoogle();
      await createSession(idToken);
      toast({ title: 'Signed in with Google' });
      router.push(redirectTo);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign In Failed', description: error.message || String(error) });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGithubSignIn() {
    if (!auth) return;
    setIsLoading(true);
    try {
      const { idToken } = await signInWithGithub();
      await createSession(idToken);
      toast({ title: 'Signed in with GitHub' });
      router.push(redirectTo);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign In Failed', description: error.message || String(error) });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFacebookSignIn() {
    if (!auth) return;
    setIsLoading(true);
    try {
      const { idToken } = await signInWithFacebook();
      await createSession(idToken);
      toast({ title: 'Signed in with Facebook' });
      router.push(redirectTo);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign In Failed', description: error.message || String(error) });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTwitterSignIn() {
    if (!auth) return;
    setIsLoading(true);
    try {
      const { idToken } = await signInWithTwitter();
      await createSession(idToken);
      toast({ title: 'Signed in with Twitter' });
      router.push(redirectTo);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign In Failed', description: error.message || String(error) });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLinkedInSignIn() {
    // For LinkedIn, we'll show a message directing users to email signup
    toast({
      title: 'LinkedIn Sign In',
      description: 'LinkedIn sign in is coming soon! Please use email signup or other social providers.',
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/5 p-4">
      <div className="w-full max-w-md">
         <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
                <Landmark className="h-10 w-10 text-primary" />
                <span className="text-3xl font-headline font-bold text-primary">TaxCode</span>
            </Link>
         </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                 <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-semibold text-green-600 hover:underline">
                        Sign up
                    </Link>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full">
                      Sign in with Google
                    </Button>
                    <Button variant="outline" onClick={handleFacebookSignIn} disabled={isLoading} className="w-full">
                      Sign in with Facebook
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={handleTwitterSignIn} disabled={isLoading} className="w-full">
                      Sign in with Twitter
                    </Button>
                    <Button variant="outline" onClick={handleGithubSignIn} disabled={isLoading} className="w-full">
                      Sign in with GitHub
                    </Button>
                  </div>
                  <Button variant="outline" onClick={handleLinkedInSignIn} disabled={isLoading} className="w-full">
                    <Linkedin className="h-4 w-4 mr-2" />
                    Sign in with LinkedIn (Coming Soon)
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-primary/5">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
