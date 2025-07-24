import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { postAjoutCorrection } from '../httpService';

const AjoutCorrectionModal = ({ show, onHide, onSuccess }) => {
  const [form, setForm] = useState({
    type: 'Back',
    reference: '',
    dateValeur: '',
    coursClient: '',
    coursBase: '',
    deviseAchat: '',
    montantAchat: '',
    montantBaseAchat: '',
    deviseVente: '',
    montantVente: '',
    montantBaseVente: '',
    commentaire: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setForm((f) => ({ ...f, type: e.target.value }));
  };

  const handleCommentChange = (e) => {
    const value = e.target.value.slice(0, 255);
    setForm((f) => ({ ...f, commentaire: value }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await postAjoutCorrection(form);
      alert('Correction ajoutée avec succès (dummy response)');
      setSubmitting(false);
      if (onSuccess) onSuccess();
      onHide();
    } catch (e) {
      alert('Erreur lors de la sauvegarde');
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ajout/modification opération manuelle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-2">
            <Col md={3}><Form.Label>Type d'opération :</Form.Label></Col>
            <Col md={9}>
              <Form.Check inline label="Back" name="type" value="Back" type="radio" checked={form.type === 'Back'} onChange={handleRadioChange} />
              <Form.Check inline label="Front" name="type" value="Front" type="radio" checked={form.type === 'Front'} onChange={handleRadioChange} />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group controlId="reference">
                <Form.Label>Référence :</Form.Label>
                <Form.Control name="reference" value={form.reference} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="dateValeur">
                <Form.Label>Date valeur :</Form.Label>
                <Form.Control name="dateValeur" value={form.dateValeur} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group controlId="coursClient">
                <Form.Label>Cours client :</Form.Label>
                <Form.Control name="coursClient" value={form.coursClient} onChange={handleChange} type="number" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="coursBase">
                <Form.Label>Cours base :</Form.Label>
                <Form.Control name="coursBase" value={form.coursBase} onChange={handleChange} type="number" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={3}></Col>
            <Col md={4}><strong>Achat</strong></Col>
            <Col md={4}><strong>Vente</strong></Col>
          </Row>
          <Row className="mb-2">
            <Col md={3}><Form.Label>Devise :</Form.Label></Col>
            <Col md={4}>
              <Form.Control name="deviseAchat" value={form.deviseAchat} onChange={handleChange} />
            </Col>
            <Col md={4}>
              <Form.Control name="deviseVente" value={form.deviseVente} onChange={handleChange} />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={3}><Form.Label>Montant :</Form.Label></Col>
            <Col md={4}>
              <Form.Control name="montantAchat" value={form.montantAchat} onChange={handleChange} type="number" />
            </Col>
            <Col md={4}>
              <Form.Control name="montantVente" value={form.montantVente} onChange={handleChange} type="number" />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={3}><Form.Label>Montant Base :</Form.Label></Col>
            <Col md={4}>
              <Form.Control name="montantBaseAchat" value={form.montantBaseAchat} onChange={handleChange} type="number" />
            </Col>
            <Col md={4}>
              <Form.Control name="montantBaseVente" value={form.montantBaseVente} onChange={handleChange} type="number" />
            </Col>
          </Row>
          <Form.Group controlId="commentaire" className="mb-2">
            <Form.Label>Commentaire :</Form.Label>
            <Form.Control as="textarea" rows={3} name="commentaire" value={form.commentaire} onChange={handleCommentChange} maxLength={255} />
            <div style={{ fontSize: 12 }}>{255 - form.commentaire.length} restant(s)</div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleSave} disabled={submitting}>Sauvegarder</Button>
        <Button variant="secondary" onClick={onHide}>Annuler</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AjoutCorrectionModal; 