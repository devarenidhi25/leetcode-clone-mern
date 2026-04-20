import React, { useState } from "react";
import Home from "./pages/Home";
import Login from  './pages/Login'
import Signup from "./pages/SignUp";
import ProblemsPage from "./pages/ProblemsPage";
import UserProfile from "./pages/UserProfile";
import { useAuthContext } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import UserStat from "./pages/UserStat";

function App() {
  const {Authuser}=useAuthContext()
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const handleSelectProblem = (problemId) => {
    setSelectedProblemId(problemId);
  };

  return (
   <div>
    <Routes>
      <Route path="/" element={Authuser?<Home selectedProblemId={selectedProblemId} />:<Navigate to={'/login'}/>}/>
      <Route path="/login" element={Authuser?<Navigate to='/'/>:<Login/>}/>
      <Route path="/signup" element={Authuser?<Navigate to='/'/>:<Signup/>}/>
      <Route path="/problems" element={Authuser?<ProblemsPage onSelectProblem={handleSelectProblem} />:<Navigate to={'/login'}/>}/>
      <Route path="/profile" element={Authuser?<UserProfile userId={Authuser._id} isOwnProfile={true} />:<Navigate to={'/login'}/>}/>
      <Route path="/profile/:userId" element={Authuser?<UserProfile userId={Authuser._id} isOwnProfile={false} />:<Navigate to={'/login'}/>}/>
      <Route path="/user-stat" element={Authuser?<UserStat/>:<Navigate to={'/login'}/>}/>
    </Routes>
   </div>
  );
}

export default App;
