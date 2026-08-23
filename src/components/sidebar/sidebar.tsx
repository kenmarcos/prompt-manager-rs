import React from 'react';
import { SidebarContent } from './sidebar-content';
import { prisma } from '@/lib/prisma';

export const Sidebar = async () => {
  const prompts = await prisma.prompt.findMany();

  return <SidebarContent prompts={prompts} />;
};
