import { HeroSection } from '@/components/core/HeroSection'
import { ProjectsList } from '@/components/core/ProjectList'
import React from 'react'

const Page = () => {
  return (
    <div className='bg-black'>
      <HeroSection />
      <div className='relative z-50 p-4 -mt-[8rem]'>
        <ProjectsList />
      </div>
    </div>
  )
}

export default Page