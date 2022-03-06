import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calculator from './Calculator';
const Router = () => {
    return (<BrowserRouter>
        <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path=":theme" element={<Calculator />} />
        </Routes>
    </BrowserRouter>);
}

export default Router;