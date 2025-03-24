import { Provider } from 'react-redux'
import './App.css'
import store from './store/store'
import { Outlet, RouterProvider } from 'react-router'
import { router } from './Router'
import { AudioPlayerProvider } from './contexts/AudioPlayerContext '

function App() {

  return (
    <>
    <AudioPlayerProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Outlet/>

      </Provider>
    </AudioPlayerProvider>
    </>
  )
}

export default App
