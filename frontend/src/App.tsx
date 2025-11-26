import './App.css'
import { Button } from './components/ui/Button'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'

function App() {

  return (
    <>
      <Button text={"Add Content"} startIcon={<PlusIcon size={"md"}/>}/>

      <Button text={"Share Brain"} variant={"secondary"} startIcon={<ShareIcon size={"md"}/>}/>    
    </>
  )
}

export default App
