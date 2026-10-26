'use client';

import { cn } from '@/lib/utils';
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../ui/button';
import { ArrowLeftToLine, ArrowRightToLine, Menu, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import { PromptList } from '../prompts';
import { searchPromptAction } from '@/app/actions/prompt.actions';
import { Spinner } from '../ui/spinner';
import { Logo } from '../logo';
import { useQueryState, debounce } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';

const SEARCH_DEBOUNCE_MS = 300;

export interface SidebarContentProps {
  prompts: PromptSummary[];
}

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [query, setQuery] = useQueryState('q', { defaultValue: '' });

  const formRef = useRef<HTMLFormElement | null>(null);

  const [searchPromptFormState, searchPromptFormAction, isPending] =
    useActionState(searchPromptAction, {
      success: true,
      prompts,
    });

  const hasQuery = query.trim().length > 0;
  const promptList = hasQuery
    ? (searchPromptFormState.prompts ?? prompts)
    : prompts;

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNewPrompt = () => {
    router.push('/new');
  };

  const debouncedSubmitSearch = useDebouncedCallback(() => {
    formRef.current?.requestSubmit();
  }, SEARCH_DEBOUNCE_MS);

  const handleSearchPrompt = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchInput = event.target.value;

    setQuery(newSearchInput, {
      limitUrlUpdates: debounce(SEARCH_DEBOUNCE_MS),
    });

    if (newSearchInput.trim()) {
      debouncedSubmitSearch();
    } else {
      debouncedSubmitSearch.cancel();
    }
  };

  const openMobile = () => {
    setIsMobileOpen(true);
  };
  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  // Submits once on mount when the page is opened with ?q=
  useEffect(() => {
    if (!hasQuery) return;

    formRef.current?.requestSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button
        className="md:hidden fixed top-6 left-6 z-50"
        variant="secondary"
        title="Abrir menu"
        aria-label="Abrir menu"
        aria-expanded={isMobileOpen}
        onClick={openMobile}
      >
        <Menu className="w-5 h-5 text-gray-100" />
      </Button>

      <aside
        className={cn(
          'border-r border-gray-700 flex flex-col h-full bg-gray-800 transition-[transform,width] duration-300 ease-in-out fixed md:relative left-0 top-0 z-50 md:z-auto w-[80vw] sm:w-[320px] md:translate-x-0',
          isExpanded ? 'md:w-[384px]' : 'md:w-18',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
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
                    onClick={closeMobile}
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
                  <Logo />
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
                <form
                  ref={formRef}
                  action={searchPromptFormAction}
                  className="group relative w-full"
                >
                  <Input
                    name="q"
                    type="text"
                    placeholder="Buscar prompt..."
                    autoFocus
                    onChange={handleSearchPrompt}
                    value={query}
                  />

                  {isPending && (
                    <div
                      title="Buscando prompt"
                      aria-label="Buscando prompt"
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-300"
                    >
                      <Spinner />
                    </div>
                  )}
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
              <PromptList prompts={promptList} />
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
    </>
  );
};
