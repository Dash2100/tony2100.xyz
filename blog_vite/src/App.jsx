import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import PostList from './pages/PostList.jsx';
import Notes from './pages/Notes.jsx';
import Article from './pages/Article.jsx';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/post/:slug" element={<Article />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen select-none">
      <Navbar />
      {/* main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* content area is at least one viewport tall, so the footer is always
            pushed off-screen even when a page has very little content */}
        <div className="flex-1 min-h-screen">
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </div>
  );
}
