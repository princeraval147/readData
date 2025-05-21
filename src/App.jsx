import Header from './components/Header'
import ReadCSV from './components/ReadCSV'
import { Outlet } from 'react-router-dom'

const App = () => {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
