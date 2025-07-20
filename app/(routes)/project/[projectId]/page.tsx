import ProjectView from "@/components/core/ProjectView";
import { getQueryClient, trpc } from "@/src/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ErrorFallback from "@/components/core/Error";

 interface props{
    params : Promise<{
      projectId:string,
    }
    >
 }

const page = async ({params}:props) => {
  const {projectId}= await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.messages.getMany.
    queryOptions({  
       projectId,
  })
 )
 void queryClient.prefetchQuery(trpc.projects.getOne.
  queryOptions({  
     id: projectId,
})
)

  return (
    <HydrationBoundary state={ dehydrate(queryClient)}>
       <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<p>Loading...</p>}>
     < ProjectView projectId= {projectId} />
     </Suspense>
     </ErrorBoundary>
      </HydrationBoundary>
  )
}



export default page