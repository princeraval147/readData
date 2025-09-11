import Footer from './components/Footer'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import { NotificationProvider } from './context/NotificationContext'

const App = () => {

  return (
    <>
      <NotificationProvider>
        <Header />
        {/* <Outlet /> */}
        {/* <Footer /> */}
        <div style={{ minHeight: '89vh', display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1 }}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </NotificationProvider>
    </>
  )
}

export default App;
