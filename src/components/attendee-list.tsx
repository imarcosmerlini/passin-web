import {Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight} from 'lucide-react';
import {IconButton} from "./icon-button.tsx";
import {Table} from "./table.tsx";
import {TableHeader} from "./table-header.tsx";
import {TableCell} from "./table-cell.tsx";
import {TableRow} from "./table-row.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedIn: string | null;
}

export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());
    const search = url.searchParams.get('search');
    return search ? search : '';

  })
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());
    const page = url.searchParams.get('page');
    return page ? Number(page) : 1;
  })
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const totalPages = Math.ceil(attendees.length / 10);

  useEffect(() => {
    const url = new URL('http://localhost:3333/events/c57da92c-c6ed-41c8-8d5d-3391daf62386/attendees');
    url.searchParams.set('pageIndex', String(page - 1));

    if (search.length > 0) {
      url.searchParams.set('query', search);
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAttendees(data.attendees)
      });
  }, [page, search])

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString());
    url.searchParams.set('page', String(page));
    window.history.pushState({}, '', url.toString());
    setPage(page);
  }

  function setQuerySearch(search: string) {
    const url = new URL(window.location.toString());
    url.searchParams.set('search', search);
    window.history.pushState({}, '', url);
    setSearch(search);
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setQuerySearch(event.target.value);
    setCurrentPage(1);
  }

  function goToNextPage() {
    setCurrentPage(page + 1);
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1);
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }

  function goToLastPage() {
    setCurrentPage(page + 1);
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-3 items-center'>
        <h1 className='text-2xl font-bold'>Participantes</h1>
        <div className='w-72 px-3 py-1.5 border border-white/10 rounded-lg flex items-center gap-3'>
          <Search className='size-4 text-emerald-300'/>
          <input
            onChange={onSearchInputChanged}
            value={search}
            className='bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0'
            placeholder='Buscar participantes...'
          ></input>
        </div>
      </div>

      <Table>
        <thead>
        <tr className='border-b border-white/10'>
          <TableHeader
            style={{width: 48}}
          >
            <input
              type='checkbox'
              className='size-4 bg-black/20 rounded border-white/10'
            ></input>
          </TableHeader>
          <TableHeader>Código</TableHeader>
          <TableHeader>Participantes</TableHeader>
          <TableHeader>Data de inscrição</TableHeader>
          <TableHeader>Data do check-in</TableHeader>
          <TableHeader
            style={{width: 64}}
          ></TableHeader>
        </tr>
        </thead>
        <tbody>
        {attendees.map((attendee) => {
          return (
            <TableRow
              key={attendee.id}
              className='border-b border-white/10 hover:bg-white/5'
            >
              <TableCell>
                <input
                  type='checkbox'
                  className='size-4 bg-black/20 rounded border-white/10'
                ></input>
              </TableCell>
              <TableCell>{attendee.id}</TableCell>
              <TableCell>
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold text-white'>{attendee.name}</span>
                  <span>{attendee.email}</span>
                </div>
              </TableCell>
              <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
              <TableCell>
                {attendee.checkedIn === null
                  ? <span className='text-zinc-400'>Não fez check-in</span>
                  : dayjs().to(attendee.checkedIn)}
              </TableCell>
              <TableCell>
                <IconButton transparent>
                  <MoreHorizontal className='size-4'/>
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
        </tbody>
        <tfoot>
        <tr>
          <TableCell
            className='py-3 px-4 text-sm text-left text-zinc-300'
            colSpan={3}
          >
            Mostrando {attendees.length} de {totalPages} itens
          </TableCell>
          <TableCell
            className='py-3 px-4 text-sm text-right text-zinc-300'
            colSpan={3}
          >
            <div className='inline-flex items-center gap-8'>
              <span>Página {page} de {totalPages}</span>
              <div className='flex gap-1.5'>
                <IconButton onClick={goToFirstPage} disabled={page === 1}>
                  <ChevronsLeft className='size-4'/>
                </IconButton>
                <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                  <ChevronLeft className='size-4'/>
                </IconButton>
                <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                  <ChevronRight className='size-4'/>
                </IconButton>
                <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                  <ChevronsRight className='size-4'/>
                </IconButton>
              </div>
            </div>
          </TableCell>
        </tr>
        </tfoot>
      </Table>
    </div>
  );
}
