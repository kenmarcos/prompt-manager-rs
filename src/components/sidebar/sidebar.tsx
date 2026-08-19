import React from 'react';
import { SidebarContent } from './sidebar-content';
import prisma from '@/lib/prisma';

export const sidebar = async () => {
  const prompts = await prisma.prompt.findMany();

  return <SidebarContent prompts={prompts} />;
};
