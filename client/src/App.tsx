import "./App.css"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { store } from "./store"
import { MainPage } from "./page"

function App() {
  // @ts-ignore
  window.Buffer = window.Buffer || require("buffer").Buffer
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    </Provider>
  )
}

export default App
