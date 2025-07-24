import { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Alert, Button, Spinner } from 'react-bootstrap';
import { fetchCurrencies, fetchFinancialData, fetchDetails } from './httpService';
import './App.css';
import DetailsModal from './components/DetailsModal';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import PositionParDeviseGrid from './components/PositionParDeviseGrid';
import AjoutCorrectionModal from './components/AjoutCorrectionModal';
ModuleRegistry.registerModules([AllCommunityModule]);

const App = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    currencies: [],
    selectedCurrency: null,
    financialData: null,
    showDetailModal: false,
    selectedDetails: null,
    selectedRowDescription: '',
    selectedDetailsKey: null,
    showAjoutCorrection: false,
  });

  // On mount, check for devise param in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlDevise = params.get('devise');
    fetchCurrencies()
      .then((currencies) => {
        let selectedCurrency;
        if (urlDevise && currencies.includes(urlDevise)) {
          selectedCurrency = urlDevise;
        } else {
          selectedCurrency = currencies[0] || null;
          // Update the URL to reflect the default selection
          if (selectedCurrency) {
            const newParams = new URLSearchParams(window.location.search);
            newParams.set('devise', selectedCurrency);
            window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
          }
        }
        setState((s) => ({ ...s, currencies, selectedCurrency, loading: false }));
      })
      .catch(() => setState((s) => ({ ...s, error: 'Failed to load currencies', loading: false })));
  }, []);

  // When selectedCurrency changes, update URL param and fetch data
  useEffect(() => {
    if (!state.selectedCurrency) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('devise') !== state.selectedCurrency) {
      params.set('devise', state.selectedCurrency);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchFinancialData(state.selectedCurrency)
      .then((positions) => setState((s) => ({ ...s, financialData: { positions }, loading: false, error: null })))
      .catch(() => setState((s) => ({ ...s, error: 'Failed to load financial data', loading: false })));
  }, [state.selectedCurrency]);

  const setSelectedCurrency = (currency) => setState((s) => ({ ...s, selectedCurrency: currency }));
  const handleShowDetails = async (detailsKey, description) => {
    const details = await fetchDetails(detailsKey);
    setState((s) => ({ ...s, showDetailModal: true, selectedDetails: details, selectedRowDescription: description, selectedDetailsKey: detailsKey }));
  };
  const handleCloseModal = () => setState((s) => ({ ...s, showDetailModal: false, selectedDetails: null, selectedRowDescription: '', selectedDetailsKey: null }));
  const reload = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchCurrencies()
      .then((currencies) => setState((s) => ({ ...s, currencies, selectedCurrency: currencies[0] || 'AED' })))
      .catch(() => setState((s) => ({ ...s, error: 'Failed to load currencies', loading: false })));
  };
  const handleShowAjoutCorrection = () => setState((s) => ({ ...s, showAjoutCorrection: true }));
  const handleCloseAjoutCorrection = () => setState((s) => ({ ...s, showAjoutCorrection: false }));

  // Add a handler to refetch financial data after correction
  const handleCorrectionSuccess = () => {
    if (state.selectedCurrency) {
      setState((s) => ({ ...s, loading: true, error: null }));
      fetchFinancialData(state.selectedCurrency)
        .then((positions) => setState((s) => ({ ...s, financialData: { positions }, loading: false, error: null })))
        .catch(() => setState((s) => ({ ...s, error: 'Failed to load financial data', loading: false })));
    }
  };

  if (state.loading) return (
      <div className="loading-container">
      <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
        <div className="loading-text">Loading financial data...</div>
      </div>
    );
  if (state.error) return (
      <Container className="error-container">
        <Alert variant="danger">
        {state.error}
          <div className="error-retry-button">
          <Button variant="outline-danger" onClick={reload}>Try Again</Button>
          </div>
        </Alert>
      </Container>
    );

  return (
    <div className="main-container">
      <Container fluid>
        <Row>
          <Col>
            <div className="currency-container">
              <div className="currency-list-header"><h6>Liste des devises:</h6></div>
              <div className="currency-list">
                {state.currencies.map((currency, i) => (
                  <Badge key={i} className={`currency-badge ${currency === state.selectedCurrency ? 'selected' : 'unselected'}`} onClick={() => setSelectedCurrency(currency)}>{currency}</Badge>
                ))}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="financial-table-container">
              {state.selectedCurrency && state.financialData && (
                <PositionParDeviseGrid
                  financialData={state.financialData}
                  selectedCurrency={state.selectedCurrency}
                  handleShowDetails={handleShowDetails}
                  handleShowAjoutCorrection={handleShowAjoutCorrection}
                />
              )}
            </div>
          </Col>
        </Row>
        <DetailsModal
          show={state.showDetailModal}
          onHide={handleCloseModal}
          details={state.selectedDetails}
          description={state.selectedRowDescription}
        />
        <AjoutCorrectionModal show={state.showAjoutCorrection} onHide={handleCloseAjoutCorrection} onSuccess={handleCorrectionSuccess} />
      </Container>
    </div>
  );
};

export default App;