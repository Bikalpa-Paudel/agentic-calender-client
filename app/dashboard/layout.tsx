import Sidebar from '@/components/layout/sidebar'
import React, { ReactNode } from 'react'

function layout({children}:{children:ReactNode}) {
  return (
    <div className='flex'>
        <Sidebar />
        {children}
    </div>
  )
}

export default layout