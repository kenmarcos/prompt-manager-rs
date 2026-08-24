'use client';

import { cn } from '@/lib/utils';
import { ChangeEvent, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeftToLine, ArrowRightToLine, Plus, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';
import { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import { PromptList } from '../prompts';

export interface SidebarContentProps {
  prompts: PromptSummary[];
}

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const searchParams = useSearchParams();

  const [isExpanded, setIsExpanded] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');

  const router = useRouter();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNewPrompt = () => {
    router.push('/new');
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchInput = event.target.value;
    setSearchInput(newSearchInput);

    const url = newSearchInput
      ? `/?q=${encodeURIComponent(newSearchInput)}`
      : '/';

    router.push(url, { scroll: false });
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
              <header
                className="flex w-full items-center justify-between"
                aria-label="Título do sidebar"
              >
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

            <section className="mb-5">
              <form action="">
                <Input
                  name="q"
                  type="text"
                  placeholder="Buscar prompt..."
                  autoFocus
                  onChange={handleSearch}
                  value={searchInput}
                />
              </form>
            </section>

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

          <nav
            className="flex-1 overflow-auto px-6 pb-6"
            aria-label="Lista de prompts"
          >
            <PromptList prompts={prompts} />
          </nav>
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

          <div className="flex items-center justify-center">
            <Button aria-label="Minimizar sidebar" title="Minimizar sidebar">
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        </section>
      )}
    </aside>
  );
};
