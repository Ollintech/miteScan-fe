import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

function DefaultLayout() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Outlet />
      </div>
    </>
  )
}

export default DefaultLayout