'use client'

import { useTRPC } from '@/src/trpc/client';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';
import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NavProjects = () => {
    const trpc = useTRPC();
    const { user } = useUser();
    const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
    const pathname = usePathname()
    if (!user) return null;
    return (
        <section className='grid gap-1'>
            {projects?.map((
                project
            )=>
                <>
                {pathname === `/project/${project.id}` ? <div className={cn('group hover:bg-secondary/5  px-2 py-1 rounded-lg text-sm flex items-center justify-between p',pathname === `/project/${project.id}` && 'bg-secondary/5')}>
                    <div className='flex items-center gap-2'>
                        <img src="/media/flower-violet.svg" className='w-4 h-4   group-hover:scale-100  group-hover:rotate-180  transition-all' alt="" />
                        <p className='transition-all'>
                            {project.name}
                        </p>
                    </div>
                    <Button variant={'ghost'} size={'sm'}>
                        <EllipsisVertical size={10} />
                    </Button>
                </div> : <Link href={`/project/${project.id}`} className={cn('group hover:bg-secondary/5  px-2 py-1 rounded-lg text-sm flex items-center justify-between p',pathname === `/project/${project.id}` && 'bg-secondary/5')}>
                    <div className='flex items-center gap-2'>
                        <img src="/media/flower-violet.svg" className='w-4 h-4 scale-0  group-hover:scale-100  group-hover:rotate-180  transition-all' alt="" />
                        <p className='-ml-6 group-hover:ml-0   transition-all'>
                            {project.name}
                        </p>
                    </div>
                    <Button variant={'ghost'} size={'sm'}>
                        <EllipsisVertical size={10} />
                    </Button>
                </Link>}
                </>
                )
            }
        </section>
    )
}

export default NavProjects