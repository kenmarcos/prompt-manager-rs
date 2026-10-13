'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

export interface CopyButtonProps {
  content: string;
}

export const CopyButton = ({ content }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const isContentEmpty = !content.trim();

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCopy = async () => {
    if (isContentEmpty) return;

    try {
      await navigator.clipboard.writeText(content.trim());

      setIsCopied(true);

      clearTimer();

      timerRef.current = setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      const _error = error as Error;

      toast.error(`Error ao copiar o texto: ${_error.message}`);
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-transparent"
      disabled={isContentEmpty}
      onClick={handleCopy}
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}

      <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
    </Button>
  );
};
