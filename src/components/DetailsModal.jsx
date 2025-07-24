import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';

const DetailsModal = ({ show, onHide, details, description }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Position Details - {description}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {details && (
          <div className="ag-theme-alpine" style={{ width: '100%', height: 350 }}>
            <AgGridReact
              columnDefs={[
                { headerName: 'Lot', field: 'lot' },
                { headerName: 'Devise', field: 'devise' },
                { headerName: 'Montant Back', field: 'montantBack', cellClass: 'text-end', valueFormatter: params => params.value },
                { headerName: 'Montant Front', field: 'montantFront', cellClass: 'text-end', valueFormatter: params => params.value },
                { headerName: 'Reference', field: 'reference' },
                { headerName: 'Libelle', field: 'libelle' }
              ]}
              defaultColDef={{ flex: 1 }}
              rowData={details}
              domLayout="autoHeight"
              suppressHorizontalScroll={true}
              pinnedBottomRowData={[
                {
                  lot: 'Total',
                  devise: '',
                  montantBack: details.reduce((sum, d) => sum + (d.montantBack || 0), 0),
                  montantFront: details.reduce((sum, d) => sum + (d.montantFront || 0), 0),
                  reference: '',
                  libelle: ''
                }
              ]}
              getRowStyle={params => params.node.rowPinned ? { background: '#f3f3f3', fontWeight: 'bold' } : {}}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetailsModal; 