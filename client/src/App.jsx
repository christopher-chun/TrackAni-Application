import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Anime from './pages/Anime';
import AnimeDetails from './pages/AnimeDetails';
import Home from './pages/Home';
import Manga from './pages/Manga';
import MangaDetails from './pages/MangaDetails';
import Favorite from './pages/Favorite';
import AnimeList from './pages/AnimeList';
import MangaList from './pages/MangaList';
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home/>} /> 
        
        {/* Anime Routes */}
        <Route path='/anime' element={<Anime/>} />
        <Route path='/anime/:id' element={<AnimeDetails/>} />
        
        {/* Manga Routes */}
        <Route path='/manga' element={<Manga/>} />
        <Route path='/manga/:id' element={<MangaDetails/>} />
        
        {/* User Lists */}
        <Route path='/favorites' element={<Favorite/>} />
        <Route path='/my-anime' element={<AnimeList/>} />
        <Route path='/my-manga' element={<MangaList/>} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App;