'use client';
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";

export const ProjectsList = () => {
    const trpc = useTRPC();
    const { user } = useUser();
    const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());

    if (!user) return null;

    return (
        <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col
         gap-y-6 sm:gap-y-4">


            <h2 className="text-2xl font-semibold">

                {user?.firstName}&apos;s projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {projects?.length === 0 && (
                    <div className="col-span-full muted-text-center">
                        <p className="text-sm text-muted-foreground">
                            No projects found
                        </p>
                    </div>
                )}
                {projects?.map((project) => (
                    <Link className="cursor-pointer!" href={`/projects/${project.id}`}>
                        <Button
                            key={project.id}
                            variant="outline"
                            className="font-normal cursor-pointer! h-auto grid grid-cols-1 justify-start w-full p-4"
                        >
                            <div style={{
                                backgroundImage: `url(https://placehold.co/600x400/coral/white?font=raleway&text=${project.name})`
                            }} className="bg-center bg-cover rounded-xl  mb-2  aspect-video w-full bg-muted">
                            </div>
                            <div className="flex items-center gap-x-4 justify-start text-start">
                                <img
                                    src="/media/bloom.svg"
                                    alt="bloom"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />

                                <div className="flex flex-col">
                                    <h3 className="">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(project.updatedAt, {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
};