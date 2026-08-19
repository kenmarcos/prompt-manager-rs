'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeftToLine, ArrowRightToLine, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Prompt {
  id: string;
  title: string;
  content: string;
}

export interface SidebarContentProps {
  prompts: Prompt[];
}

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNewPrompt = () => {
    router.push('/new');
  };

  return (
    <aside
      className={cn(
        'border-r border-gray-700 flex flex-col h-full bg-gray-800 transition-[transform,width] duration-300 ease-in-out fixed md:relative left-0 top-0 z-50 md:z-auto w-[80vw] sm:w-[320px]',
        isExpanded ? 'md:w-[384px]' : 'md:w-18'
      )}
    >
      {isExpanded && (
        <>
          <section className="p-6">
            <div className="md:hidden mb-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  aria-label="Fechar menu"
                  title="Fechar menu"
                >
                  <X className="w-5 h-5 text-gray-100" />
                </Button>
              </div>
            </div>

            <div className="flex w-full items-center justify-between mb-6">
              <header className="flex w-full items-center justify-between">
                PROMPT MANAGER
                <Button
                  variant="icon"
                  className="hidden md:inline-flex p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-lg transition-colors"
                  onClick={toggleSidebar}
                  aria-label="Minimizar sidebar"
                  title="Minimizar sidebar"
                >
                  <ArrowLeftToLine className="w-5 h-5 text-gray-100" />
                </Button>
              </header>
            </div>

            <div>
              <Button
                aria-label="Novo prompt"
                title="Novo prompt"
                className="w-full"
                size="lg"
                onClick={handleNewPrompt}
              >
                <Plus className="w-5 h-5 text-white" />
                Novo prompt
              </Button>
            </div>
          </section>
        </>
      )}

      {!isExpanded && (
        <section className="px-2 py-6">
          <header className="flex items-center justify-between mb-6">
            <Button
              variant="icon"
              className="hidden md:inline-flex p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-lg transition-colors"
              onClick={toggleSidebar}
              aria-label="Expandir sidebar"
              title="Expandir sidebar"
            >
              <ArrowRightToLine className="w-5 h-5 text-gray-100" />
            </Button>
          </header>
        </section>
      )}

      {prompts.map((prompt) => (
        <p key={prompt.id}>{prompt.title}</p>
      ))}
    </aside>
  );
};
