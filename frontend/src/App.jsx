import Navbar from "./Component/Navbar";
import Body from "./Component/Body"
import { useContext } from "react";
import { AppContext } from "./appContext";
import ChatUi from "./Component/ChatUi"
function App() {
const { started } = useContext(AppContext);

  return (
   <div className="h-full w-full">
    {started? <ChatUi/> :(<><Navbar/> <Body/></>)}
      
   </div>
  )
}

export default App
