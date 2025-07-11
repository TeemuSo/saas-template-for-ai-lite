'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { ReactNode } from 'react';

interface SubmitButtonProps {
  children?: ReactNode;
  className?: string;
  pendingText?: string;
  showArrow?: boolean;
}

export function SubmitButton({ 
  children = 'Get Started Now',
  className = 'w-full text-lg bg-primary hover:bg-primary/90',
  pendingText = 'Processing...',
  showArrow = true
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className={className}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          {pendingText}
        </>
      ) : (
        <>
          {children}
          {showArrow && <ArrowRight className="ml-2 h-5 w-5" />}
        </>
      )}
    </Button>
  );
} 