import { useState } from "react";
import { Button, Spinner, Alert, Card } from "react-bootstrap";
import { rephraseTextAPI } from "../../services/aiService";
import "./RephraseWidget.css";

export default function RephraseWidget({ text, onAccept, fieldType, disabled }) {
  const [rephrasing, setRephrasing] = useState(false);
  const [rephrased, setRephrased] = useState(null);
  const [error, setError] = useState(null);

  const handleRephrase = async () => {
    setRephrasing(true);
    setRephrased(null);
    setError(null);
    try {
      const result = await rephraseTextAPI(text, fieldType);
      setRephrased(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to rephrase text");
    } finally {
      setRephrasing(false);
    }
  };

  const handleAccept = () => {
    onAccept(rephrased);
    setRephrased(null);
  };

  const handleReject = () => setRephrased(null);

  return (
    <div className="rephrase-widget mt-2">
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={handleRephrase}
        disabled={disabled || rephrasing || !text?.trim()}
        className="rephrase-btn"
      >
        {rephrasing ? (
          <>
            <Spinner animation="border" size="sm" className="me-1" />
            Rephrasing...
          </>
        ) : (
          "✨ Rephrase with AI"
        )}
      </Button>

      {error && (
        <Alert
          variant="danger"
          dismissible
          className="mt-2 mb-0 py-2"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {rephrased && (
        <Card className="rephrase-preview mt-2">
          <Card.Body className="py-2 px-3">
            <p className="rephrase-label">Rephrased version:</p>
            <p className="rephrase-text mb-2">{rephrased}</p>
            <div className="d-flex gap-2">
              <Button variant="success" size="sm" onClick={handleAccept}>
                ✓ Accept
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={handleReject}>
                ✕ Reject
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
