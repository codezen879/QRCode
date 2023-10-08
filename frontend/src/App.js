import logo from './logo.svg';
import './App.css';
import React, { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostDetails from'./createPost';
import QRCodeReader from './QRcodeReader';
import QRCodeGenerator from './QRCodeGenerator';
import Createpost from './createPost';
function App() {
  return (
    <BrowserRouter>
     <div className="App">
     <Routes>
    <Route path="/" element={<Createpost/>}></Route>
    <Route path="/Read" element={<QRCodeReader />}></Route>
     </Routes>
    </div>
    </BrowserRouter>
 
  );
}

export default App;
