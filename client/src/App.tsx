import "./App.css"
import { BrowserRouter } from "react-router-dom"
import { MainPage } from "./page"


function App() {
  // @ts-ignore
  window.Buffer = window.Buffer || require("buffer").Buffer
  return (
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
  )
}

export default App
