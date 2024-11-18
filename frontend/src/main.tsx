import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TabletKartya from './components/Tabletek/TabletKartya';
import TabletFelvetel from './components/Tabletek/TabletFelvetel';
import TabletTorles from './components/Tabletek/TabletTorles';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Kezdolap from './components/Tabletek/Kezdolap/Kezdolap';

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Kezdolap />,
    },
    {
      path: "/tabletkartya",
      element: <TabletKartya />,
    },
    {
      path: "/tabletfelvetel",
      element: <TabletFelvetel />,
    },
    {
      path: "/tablettorles",
      element: <TabletTorles />,
    }
  ]);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router}></RouterProvider>
    </StrictMode>,
  )
