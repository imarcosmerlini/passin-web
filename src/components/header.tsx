import {NavLink} from "./nav-link.tsx";

export function Header() {
  return (
    <div className='flex items-center gap-5 py-2'>
      <nav className='flex items-center gap-5'>
        <NavLink href='/eventos'>Eventos</NavLink>
        <NavLink href='/participantes'>Participantes</NavLink>
      </nav>
    </div>
  );
}