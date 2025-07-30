import { useState, useRef } from 'react'
import { DataTable, type DataTableStateEvent } from 'primereact/datatable'
import { Column, type ColumnHeaderOptions } from 'primereact/column'
import { Button } from 'primereact/button'
import { OverlayPanel } from 'primereact/overlaypanel'

import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import '../styles/table.css'

import { type ArtPiece } from '../types/art'
import { useArtworks } from '../hooks/useArtworks'
import { fetchBulkArtworks } from '../services/artworkService'

import CustomSelectionPanel from './CustomSelectionPanel'

const PAGE_SIZE = 12

export default function ArtTable() {
    const [page, setPage] = useState(1)
    const [selectedRows, setSelectedRows] = useState<ArtPiece[]>([])
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const popupRef = useRef<OverlayPanel>(null!)
    const { artList, totalItems, isBusy, fetchError } = useArtworks(page)

    const fetchCustomRows = async (qty: number) => {
        setErrorMsg(null)
        try {
            const pulled = await fetchBulkArtworks(Math.min(qty, totalItems))
            setSelectedRows(pulled)
            if (page !== 1) setPage(1)
        } catch (err) {
            console.error('Failed to fetch bulk data', err)
            setErrorMsg('Could not perform bulk selection. Please try again.')
        }
    }

    const onPageChange = (e: DataTableStateEvent) => {
        const pageNum = (e.first ?? 0) / PAGE_SIZE + 1
        setPage(pageNum)
    }

    const renderCustomHeader = (opts: ColumnHeaderOptions) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {opts.props?.children}
            <Button
                icon="pi pi-chevron-down"
                type="button"
                className="p-button-text p-button-sm"
                onClick={(e) => popupRef.current?.toggle(e)}
                aria-haspopup
                aria-controls="overlay_panel"
            />
            <span>title</span>
        </div>
    )

    if (fetchError || errorMsg) {
        return (
            <div className="table-wrapper error-message">
                {fetchError || errorMsg}
            </div>
        )
    }

    return (
        <div className="full-screen-table-container">
            <CustomSelectionPanel
                opRef={popupRef}
                totalItems={totalItems}
                onCustomSelection={fetchCustomRows}
            />

            <DataTable
                value={artList}
                loading={isBusy}
                paginator
                first={(page - 1) * PAGE_SIZE}
                rows={PAGE_SIZE}
                totalRecords={totalItems}
                onPage={onPageChange}
                lazy
                showGridlines
                tableStyle={{ minWidth: '100%' }}
                scrollable
                scrollHeight="92vh"
                selectionMode="checkbox"
                selection={selectedRows}
                onSelectionChange={(e) => setSelectedRows(e.value as ArtPiece[])}
                dataKey="id"
            >
                <Column selectionMode="multiple" />
                <Column field="title" header={renderCustomHeader} style={{ width: '25%' }} />
                <Column field="artist_display" header="Artist" style={{ width: '25%' }} />
                <Column field="place_of_origin" header="Origin" style={{ width: '15%' }} />
                <Column field="date_start" header="Year" style={{ width: '10%' }} />
                <Column field="inscriptions" header="Inscriptions" style={{ width: '25%' }} />
            </DataTable>
        </div>
    )
}
