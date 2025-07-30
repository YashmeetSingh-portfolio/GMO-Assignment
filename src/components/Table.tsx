import { useEffect, useState } from 'react';
import { DataTable, type DataTableStateEvent } from 'primereact/datatable'; 
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import '../styles/table.css';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const API_ENDPOINT = 'https://api.artic.edu/api/v1/artworks';
const fields = 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end';

export default function Table() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 12;

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_ENDPOINT}?page=${currentPage}&limit=${rowsPerPage}&fields=${fields}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setArtworks(data.data);
        setTotalRecords(data.pagination.total);
      } catch (err) {
        setError('Failed to fetch artworks. Please try refreshing the page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [currentPage]);

  const onPageChange = (event: DataTableStateEvent) => {
    const newPage = (event.page ?? 0) + 1;
    setCurrentPage(newPage);
  };
  
  if (error) {
    return <div className="table-wrapper error-message">{error}</div>;
  }

  return (
    <div className="table-wrapper">
      <h2 className="title">Artworks Catalog</h2>
      <DataTable
        value={artworks}
        loading={loading}
        paginator
        first={(currentPage - 1) * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPage={onPageChange}
        lazy
        showGridlines
        tableStyle={{ minWidth: '60rem' }}
        scrollable
        scrollHeight="calc(100vh - 250px)"
        
      >
        <Column field="title" header="Title" style={{ width: '25%' }} sortable />
        <Column field="artist_display" header="Artist" style={{ width: '25%' }} sortable />
        <Column field="place_of_origin" header="Origin" style={{ width: '15%' }} />
        <Column field="date_start" header="Year" style={{ width: '10%' }} />
        <Column field="inscriptions" header="Inscriptions" style={{ width: '25%' }} />
      </DataTable>
    </div>
  );
}