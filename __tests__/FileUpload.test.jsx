import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '../src/components/forms/FileUpload';

describe('FileUpload', () => {
  it('renders label', () => {
    render(<FileUpload name="file" label="Upload File" onChange={() => {}} />);
    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  it('renders dropzone text', () => {
    render(<FileUpload name="file" onChange={() => {}} />);
    expect(screen.getByText(/Drag and drop files here/)).toBeInTheDocument();
  });

  it('shows accepted file types', () => {
    render(<FileUpload name="file" accept=".pdf,.doc" onChange={() => {}} />);
    expect(screen.getByText(/Accepted: .pdf,.doc/)).toBeInTheDocument();
  });

  it('shows max size when provided', () => {
    render(<FileUpload name="file" maxSize={5} onChange={() => {}} />);
    expect(screen.getByText(/Max: 5MB/)).toBeInTheDocument();
  });

  it('handles file upload via click', async () => {
    const onChange = jest.fn();
    render(<FileUpload name="file" onChange={onChange} />);
    const input = document.querySelector('input[type="file"]');
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('displays uploaded file in file list', async () => {
    render(<FileUpload name="file" onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]');
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(screen.getByText('hello.txt')).toBeInTheDocument();
  });

  it('removes file from list on remove button click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<FileUpload name="file" onChange={onChange} />);
    const input = document.querySelector('input[type="file"]');
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(screen.getByText('hello.txt')).toBeInTheDocument();

    // Click the remove button (X icon button)
    const removeButton = screen.getByText('hello.txt').closest('li').querySelector('button');
    await user.click(removeButton);
    expect(screen.queryByText('hello.txt')).toBeNull();
  });

  it('handles drag and drop', () => {
    const onChange = jest.fn();
    const { container } = render(<FileUpload name="file" onChange={onChange} />);
    const dropzone = container.querySelector('[style*="dashed"]');

    const file = new File(['content'], 'dropped.txt', { type: 'text/plain' });
    fireEvent.dragOver(dropzone, { dataTransfer: { files: [file] } });
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onChange).toHaveBeenCalled();
  });

  it('filters files exceeding maxSize', async () => {
    const onChange = jest.fn();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    render(<FileUpload name="file" maxSize={0.001} onChange={onChange} />);
    const input = document.querySelector('input[type="file"]');
    // Create a file larger than 0.001MB (about 1KB)
    const bigContent = 'x'.repeat(2000);
    const file = new File([bigContent], 'big.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('exceed'));
    warnSpy.mockRestore();
  });

  it('supports multiple file upload', async () => {
    const onChange = jest.fn();
    render(<FileUpload name="files" multiple onChange={onChange} />);
    const input = document.querySelector('input[type="file"]');
    const files = [
      new File(['a'], 'a.txt', { type: 'text/plain' }),
      new File(['b'], 'b.txt', { type: 'text/plain' }),
    ];
    await userEvent.upload(input, files);
    expect(onChange).toHaveBeenCalledWith(files);
  });

  it('handles drag leave', () => {
    const { container } = render(<FileUpload name="file" onChange={() => {}} />);
    const dropzone = container.querySelector('[style*="dashed"]');
    fireEvent.dragOver(dropzone, { dataTransfer: { files: [] } });
    fireEvent.dragLeave(dropzone);
    // After drag leave, dragActive should be false (no highlighted background)
    expect(dropzone.style.background).not.toContain('#f5f3ff');
  });

  it('shows error message', () => {
    render(<FileUpload name="file" error="File required" onChange={() => {}} />);
    expect(screen.getByText('File required')).toBeInTheDocument();
  });

  it('shows help text', () => {
    render(<FileUpload name="file" helpText="Upload a document" onChange={() => {}} />);
    expect(screen.getByText('Upload a document')).toBeInTheDocument();
  });

  it('shows required asterisk', () => {
    render(<FileUpload name="file" label="Document" required onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
