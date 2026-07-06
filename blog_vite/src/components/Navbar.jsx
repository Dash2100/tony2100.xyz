import { NavLink } from 'react-router-dom';
import { setScrollIntent } from '../scrollIntent.js';

const desktop = ({ isActive }) =>
  `nav-link flex items-center justify-center p-2 rounded-full transition-all ease-in-out duration-200 ${isActive ? 'nav-active' : ''}`;

const mobile = ({ isActive }) =>
  `nav-link flex flex-col items-center justify-center p-3 rounded-full transition-all ease-in-out duration-200 ${isActive ? 'nav-active' : ''}`;

// Section switches from the side nav play the same animation every time,
// independent of scroll position (instant scroll reset, masked by the fade).
const instant = () => setScrollIntent('instant');

export default function Navbar() {
  return (
    <>
      {/* side nav (desktop) */}
      <div className="h-dvh w-17.5 px-2 py-10 bg-[#EDF5FA] shadow-nav flex-col items-center sticky top-0 left-0 hidden lg:flex z-50">
        <div className="flex items-center justify-center">
          <img src="/imgs/profile.png" alt="Profile Picture" className="h-12 w-12 rounded-full" />
        </div>
        <div className="flex flex-col gap-10 my-16">
          <NavLink to="/" end className={desktop} onClick={instant}>
            <img src="/imgs/icon/home.svg" alt="Home" className="h-7 w-7" />
          </NavLink>
          <NavLink to="/posts" className={desktop} onClick={instant}>
            <img src="/imgs/icon/blog.svg" alt="Blog" className="h-7 w-7" />
          </NavLink>
          <NavLink to="/notes" className={desktop} onClick={instant}>
            <img src="/imgs/icon/note.svg" alt="Note" className="h-7 w-7" />
          </NavLink>
        </div>
        <a href="#/" onClick={instant} className="nav-link flex items-center justify-center p-2 rounded-full mt-auto transition-all ease-in-out duration-200">
          <img src="/imgs/icon/settings.svg" alt="Settings" className="h-7 w-7" />
        </a>
      </div>

      {/* mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#EDF5FA] shadow-nav pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center py-3 px-4">
          <NavLink to="/" end className={mobile} onClick={instant}>
            <img src="/imgs/icon/home.svg" alt="Home" className="h-6 w-6" />
          </NavLink>
          <NavLink to="/posts" className={mobile} onClick={instant}>
            <img src="/imgs/icon/blog.svg" alt="Blog" className="h-6 w-6" />
          </NavLink>
          <NavLink to="/notes" className={mobile} onClick={instant}>
            <img src="/imgs/icon/note.svg" alt="Note" className="h-6 w-6" />
          </NavLink>
          <a href="#/" onClick={instant} className="nav-link flex flex-col items-center justify-center p-3 rounded-full transition-all ease-in-out duration-200">
            <img src="/imgs/icon/settings.svg" alt="Settings" className="h-6 w-6" />
          </a>
        </div>
      </div>
    </>
  );
}
