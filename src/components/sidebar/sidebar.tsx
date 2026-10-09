import React from 'react';
import { SidebarContent } from './sidebar-content';
import { prisma } from '@/lib/prisma';

export const Sidebar = async () => {
  const prompts = await prisma.prompt.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <SidebarContent prompts={prompts} />;
};
