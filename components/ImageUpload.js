'use client';

import { useState } from 'react';

export default function ImageUpload({ onUploadComplete, currentImage }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || '');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            if (data.success) {
                onUploadComplete(data.url);
            }
        } catch (error) {
            console.error(error);
            alert('Falha no upload da imagem');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {preview && (
                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            )}

            <label
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem',
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: uploading ? '#e5e7eb' : 'transparent',
                    color: '#4b5563',
                    fontWeight: '500'
                }}
            >
                {uploading ? 'Enviando...' : '📷 Escolher Imagem de Capa'}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    disabled={uploading}
                />
            </label>
        </div>
    );
}
