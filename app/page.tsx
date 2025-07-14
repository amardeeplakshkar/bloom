'use client'

import { useTRPC } from '@/src/trpc/client';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'

const Page = () => {
  const [value, setValue] = useState('');
  const trpc = useTRPC()
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: (data) => {
      console.log(data)
    } }))
  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => {
        invoke.mutate({
          value
        })
      }}>Submit</button>
    </div>
  )
}

export default Page