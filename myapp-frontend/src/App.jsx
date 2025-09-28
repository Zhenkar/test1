import { Login } from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./components/Register";
import  Home  from "./components/Home";
import Profile  from "./components/Profile";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Admin } from "./components/Admin";
import IsAuth from "./components/IsAuth";
import { AddArtwork } from "./components/AddArtwork";
import { MyArtwork } from "./components/MyArtwork";

// App.jsx
function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<IsAuth/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/reg" element={<Register/>}/>
          <Route path="/digA/home" element={<Home/>}/>
          <Route path="/digA/profile" element={<Profile/>}/>
          <Route path="/digA/Admin" element={<Admin/>}/>
          <Route path="/digA/Admin/ArtworkAdd" element={<AddArtwork/>}/>
          <Route path="/digA/Admin/myArtwork" element={<MyArtwork/>}/>

          <Route
              path="*"
              element={
                <div>
                  <h2>404 Page not found</h2>
                </div>
              }
            />
          </Routes>
  
    </BrowserRouter>
    </>
  );
}

export default App;