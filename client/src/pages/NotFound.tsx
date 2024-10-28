import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className='rounded-lg p-5 flex flex-col justify-center items-center'>
      <img src='/notFound.png' className='w-5/12 my-5' alt='' />
      <p className='text-main-600 text-2xl my-5'>Trang truy cập không tồn tại</p>
      <Button className='cursor-pointer my-4' onClick={() => navigate(-1)}>
        quay lại
      </Button>
    </div>
  )
}