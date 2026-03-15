/**
 * Face uploader component for adding images to templates
 */

'use client';

import { useState, useEffect } from 'react';
import { Face, FaceType } from '@/types';

interface FaceUploaderProps {
  templateId: string;
}

export function FaceUploader({ templateId }: FaceUploaderProps) {
  const [faces, setFaces] = useState<Face[]>([]);
  const [url, setUrl] = useState('');
  const [faceType, setFaceType] = useState<FaceType>('image');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFaces();
  }, [templateId]);

  const loadFaces = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}`);
      if (response.ok) {
        const data = (await response.json()) as { success: boolean; data?: { faces?: Face[] } };
        if (data.success && data.data?.faces) {
          setFaces(data.data.faces);
        }
      }
    } catch (err) {
      console.error('Failed to load faces:', err);
    }
  };

  const handleAddFace = async () => {
    if (!url) {
      setError('URL is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/faces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          face: { type: faceType, url },
        }),
      });

      if (response.ok) {
        setUrl('');
        await loadFaces();
      } else {
        setError('Failed to add face');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFace = async (index: number) => {
    const newFaces = faces.filter((_, i) => i !== index);
    setFaces(newFaces);
    // In a real app, would call API to persist
  };

  return (
    <div className="face-uploader">
      <h3>Template Faces</h3>

      <div className="add-face">
        <input
          type="url"
          placeholder="Enter face URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          disabled={loading}
        />

        <select value={faceType} onChange={e => setFaceType(e.target.value as FaceType)}>
          <option value="image">Image</option>
          <option value="3d">3D Model</option>
          <option value="web">Web</option>
        </select>

        <button onClick={handleAddFace} disabled={loading}>
          {loading ? 'Adding...' : 'Add Face'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="faces-list">
        {faces.length === 0 ? (
          <p className="empty">No faces added yet</p>
        ) : (
          faces.map((face, index) => (
            <div key={index} className="face-item">
              <img src={face.url} alt={`Face ${index}`} className="face-preview" />
              <div>
                <span className="face-type">{face.type}</span>
                <button
                  onClick={() => handleRemoveFace(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .face-uploader {
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fafafa;
        }

        h3 {
          margin: 0 0 16px 0;
        }

        .add-face {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        input,
        select,
        button {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        button {
          background: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.5;
        }

        .error {
          color: #d32f2f;
          margin-bottom: 12px;
        }

        .faces-list {
          display: grid;
          gap: 12px;
        }

        .empty {
          color: #999;
          text-align: center;
        }

        .face-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: white;
          border-radius: 4px;
        }

        .face-preview {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        }

        .face-type {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .remove-btn {
          background: #f44336;
          padding: 4px 8px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
