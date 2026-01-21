'use client';

import { useState } from 'react';

export default function ImageUpload({ onUploadComplete, currentImage }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || '');
    const [useUrl, setUseUrl] = useState(false);

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

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setPreview(url);
        onUploadComplete(url);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {preview && (
                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Imagem+Invalida'; }}
                    />
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                <button
                    type="button"
                    onClick={() => setUseUrl(false)}
                    style={{ fontWeight: !useUrl ? 'bold' : 'normal', color: !useUrl ? '#2563eb' : '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Executar Upload
                </button>
                <span>|</span>
                <button
                    type="button"
                    onClick={() => setUseUrl(true)}
                    style={{ fontWeight: useUrl ? 'bold' : 'normal', color: useUrl ? '#2563eb' : '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Usar URL Externa
                </button>
            </div>

            {!useUrl ? (
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
            ) : (
                <input
                    type="text"
                    placeholder="Cole aqui a URL da imagem (https://...)"
                    value={preview === currentImage ? '' : preview}
                    onChange={handleUrlChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                    }}
                />
            )}
        </div>
    );
}
