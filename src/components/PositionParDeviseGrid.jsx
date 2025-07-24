import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Badge, Button } from 'react-bootstrap';
import './PositionParDeviseGrid.css';

const rowKeys = [
  "totalPosition","totalOrphelinsPending","totalOrphelinsBack","totalOrphelinsFront","totalEcart","totalEcartGpTerme","totalEcartGpComptant","totalRejet","totalRegul","totalA","totalDealManuel","totalACor","totalPositionLibre","totalPositionLibreGL"
];
const rowDisplayNames = [
  "Position comptable","Opération pending (*)","Présente au Back (absente au Front)","Présente au Front (absente au Back)","Ecart après matching","Ecart ordre groupé (change à terme)","Ecart ordre groupé (change comptant)","Articles comptables rejetés","Ecritures en régularisation","Total","Correction Manuelle","Total corrigé","Position marchés libre","GL Position marchés libre"
];
const groups = [
  [0],[1,2,3],[4],[5,6],[7,8],[9],[10],[11],[12,13]
];
const boldRows = [
  'Position comptable',
  'Total',
  'Total corrigé',
  'Total A + B + C'
];

function buildGridData(financialData, selectedCurrency) {
  if (!financialData) return [];
  let id = 1;
  const gridData = [
    { id: id++, description: `Devise : ${selectedCurrency}`, montantBack: 'GL', montantFront: 'K+', difference: '', isHeader: true }
  ];
  groups.forEach((group, groupIdx) => {
    group.forEach((rowIdx, idx) => {
      const key = rowKeys[rowIdx];
      const pos = financialData.positions[key];
      if (!pos) return;
      const displayName = rowDisplayNames[rowIdx];
      let detailsKey = null;
      if (key === 'totalPosition') detailsKey = 'totalPosition';
      if (key === 'totalPositionLibre' || key === 'totalPositionLibreGL') detailsKey = 'totalPositionLibre';
      if (key === 'totalEcartGpTerme') detailsKey = 'totalEcartGpTerme';
      gridData.push({
        id: id++,
        description: displayName,
        montantBack: pos.montantBack,
        montantFront: pos.montantFront,
        difference: Math.abs(pos.montantBack - pos.montantFront) > 0.001 ? pos.montantBack - pos.montantFront : null,
        detailsKey,
        key,
        isHeader: false,
        isFirstInGroup: idx === 0
      });
    });
  });
  const totalAB = financialData.positions["totalAB"] || { montantBack: '', montantFront: '' };
  gridData.push({
    id: id++,
    description: 'Total A + B + C',
    montantBack: totalAB.montantBack,
    montantFront: totalAB.montantFront,
    difference: (typeof totalAB.montantBack === 'number' && typeof totalAB.montantFront === 'number' && Math.abs(totalAB.montantBack - totalAB.montantFront) > 0.001) ? totalAB.montantBack - totalAB.montantFront : null,
    key: 'finalTotal',
    isHeader: false,
    isFirstInGroup: true
  });
  return gridData;
}

const PositionParDeviseGrid = ({ financialData, selectedCurrency, handleShowDetails, handleShowAjoutCorrection }) => {
  const gridData = buildGridData(financialData, selectedCurrency);
  const columnDefs = [
    {
      headerName: '',
      field: 'description',
      flex: 1,
      cellRenderer: (params) => {
        const d = params.data;
        if (d.isHeader) return <span style={{ color: 'white', fontWeight: 'bold' }}>{d.description}</span>;
        if (d.description === 'Total A + B + C') return (
          <div className="cell-symbols"><span>Total</span><Badge bg="danger" className="cell-icon">A</Badge><span>+</span><Badge bg="secondary" className="cell-icon">B</Badge><span>+</span><Badge bg="secondary" className="cell-icon">C</Badge></div>
        );
        if (d.description === 'Total') return <div className="cell-with-icon"><Badge bg="secondary" className="cell-icon">A</Badge><span>{d.description}</span></div>;
        if (d.description === 'Total corrigé') return <div className="cell-with-icon"><Badge bg="danger" className="cell-icon">A</Badge><span>{d.description}</span></div>;
        if (d.description === 'Position marchés libre') return <div className="cell-with-icon"><Badge bg="secondary" className="cell-icon">B</Badge><span>{d.description}</span></div>;
        if (d.description === 'GL Position marchés libre') return <div className="cell-with-icon"><Badge bg="secondary" className="cell-icon">C</Badge><span>{d.description}</span></div>;
        return d.description;
      },
      cellClass: (params) => {
        const d = params.data;
        if (d.isHeader) return 'text-bold text-white';
        if (boldRows.includes(d.description)) return 'text-bold';
        return '';
      }
    },
    {
      headerName: 'GL',
      field: 'montantBack',
      flex: 1,
      cellRenderer: (params) => {
        const d = params.data;
        if (d.detailsKey && (d.key === 'totalPosition' || d.key === 'totalPositionLibre' || d.key === 'totalPositionLibreGL')) {
          return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}><Button variant="link" size="sm" className="magnifying-glass" onClick={() => handleShowDetails(d.detailsKey, d.description)}><i className="bi bi-search"></i></Button><span>{d.montantBack}</span></div>;
        }
        return <span>{d.montantBack}</span>;
      },
      cellClass: (params) => {
        const d = params.data;
        if (boldRows.includes(d.description)) return 'text-right text-bold';
        return 'text-right';
      }
    },
    {
      headerName: 'Front',
      field: 'montantFront',
      flex: 1,
      cellRenderer: (params) => {
        const d = params.data;
        if (d.detailsKey && d.key === 'totalPosition') {
          return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}><Button variant="link" size="sm" className="magnifying-glass" onClick={() => handleShowDetails(d.detailsKey, d.description)}><i className="bi bi-search"></i></Button><span>{d.montantFront}</span></div>;
        }
        return <span>{d.montantFront}</span>;
      },
      cellClass: (params) => {
        const d = params.data;
        if (boldRows.includes(d.description)) return 'text-right text-bold';
        return 'text-right';
      }
    },
    {
      headerName: '',
      field: 'difference',
      flex: 1,
      cellRenderer: (params) => {
        const d = params.data;
        if (d.description === 'Correction Manuelle') {
          return <div className="difference-cell"><Button size="sm" variant="outline-danger" onClick={handleShowAjoutCorrection} style={{ padding: '2px 6px', fontSize: '11px', minWidth: 0 }}>Ajout correction</Button></div>;
        }
        if ((d.description === 'Total' || d.description === 'Total corrigé') && d.difference !== null && d.difference !== undefined) {
          return (
            <div className="difference-cell">
              <Badge bg="danger" className="difference-icon"><i className="bi bi-exclamation-triangle-fill"></i></Badge>
              <span className="difference-text">Différence de {Math.abs(d.difference).toFixed(2)}</span>
            </div>
          );
        }
        return '';
      },
      cellClass: (params) => {
        const d = params.data;
        if (boldRows.includes(d.description)) return 'difference-column text-bold';
        return 'difference-column';
      }
    }
  ];

  const getRowStyle = (params) => {
    if (params.data && params.data.isHeader) {
      return { backgroundColor: '#dc3545', color: 'white', fontWeight: 'bold' };
    }
    return params.data && params.data.isFirstInGroup ? { borderTop: '3px solid #888', background: 'white' } : { background: 'white' };
  };

  return (
    <div className="ag-theme-alpine ag-grid-container">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={gridData}
        headerHeight={0}
        rowHeight={35}
        defaultColDef={{ flex: 1 }}
        suppressHorizontalScroll={true}
        getRowStyle={getRowStyle}
        getRowHeight={params => params.data && params.data.isFirstInGroup ? 38 : 35}
      />
    </div>
  );
};

export default PositionParDeviseGrid; 