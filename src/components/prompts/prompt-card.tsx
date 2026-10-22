'use client';

import { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Loader2, Trash } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import { deletePromptAction } from '@/app/actions/prompt.actions';

export interface PromptCardProps {
  prompt: PromptSummary;
}

export const PromptCard = ({ prompt }: PromptCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePrompt = async () => {
    setIsDeleting(true);

    const result = await deletePromptAction(prompt.id);

    toast[result.success ? 'success' : 'error'](result.message);

    setIsDeleting(false);
  };

  return (
    <li className="p-3 rounded-lg transition-all duration-200 group relative hover:bg-gray-700">
      <header className="flex items-start justify-between">
        <Link href={`/${prompt.id}`} prefetch className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-white group-hover:text-accent-300 transition-colors">
            {prompt.title}
          </h3>

          <p className="text-xs text-gray-400 mt-1 line-calmp-2">
            {prompt.content}
          </p>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="icon"
                size="icon"
                title="Remover Prompt"
                aria-label="Remover Prompt"
              >
                <Trash className="w-3 h-3" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover Prompt</AlertDialogTitle>

              <AlertDialogDescription>
                Tem certeza que deseja remover este prompt? Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePrompt}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Removendo
                  </>
                ) : (
                  'Remover'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
    </li>
  );
};
