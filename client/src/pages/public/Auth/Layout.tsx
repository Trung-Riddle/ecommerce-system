
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='bg-white h-screen overflow-hidden pt-8'>
        <Outlet />
    </div>
  )
}

export default Layout