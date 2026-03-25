import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { Upload, X, File } from 'lucide-react';

/**
 * File Upload Component
 */
const FileUpload = ({
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  value,
  error,
  onChange,
  onBlur,
  accept,
  multiple = false,
  maxSize, // in MB
  className = '',
}) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    
    // Validate file size if maxSize is set
    if (maxSize) {
      const maxBytes = maxSize * 1024 * 1024;
      const validFiles = newFiles.filter(file => file.size <= maxBytes);
      if (validFiles.length !== newFiles.length) {
        console.warn(`Some files exceed the ${maxSize}MB limit`);
      }
      setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
      onChange?.(multiple ? validFiles : validFiles[0]);
    } else {
      setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
      onChange?.(multiple ? newFiles : newFiles[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(multiple ? newFiles : newFiles[0] || null);
  };

  const dropzoneStyle = {
    border: `2px dashed ${error ? '#ef4444' : dragActive ? '#4f46e5' : '#d1d5db'}`,
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: dragActive ? '#f5f3ff' : disabled ? '#f9fafb' : '#fff',
    transition: 'all 0.2s',
  };

  return (
    <div className={clsx('form-field file-upload', className)}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}

      <div
        style={dropzoneStyle}
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          id={name}
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          onBlur={onBlur}
          style={{ display: 'none' }}
        />

        <Upload size={40} color="#9ca3af" style={{ marginBottom: '1rem' }} />
        <p style={{ color: '#374151', marginBottom: '0.5rem' }}>
          Drag and drop files here, or click to browse
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          {accept ? `Accepted: ${accept}` : 'Any file type'}
          {maxSize && ` (Max: ${maxSize}MB)`}
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: '1rem 0 0 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {files.map((file, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: '#f9fafb',
                borderRadius: '6px',
              }}
            >
              <File size={20} color="#6b7280" />
              <span style={{ flex: 1, color: '#374151' }}>{file.name}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={18} color="#ef4444" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {(error || helpText) && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: error ? '#ef4444' : '#6b7280',
        }}>
          {error || helpText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;

