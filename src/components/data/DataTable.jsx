import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStrapi } from '../../context/StrapiContext';

/**
 * Data Table Section Component
 */
const DataTable = ({
  title,
  description,
  dataSource = 'static',
  apiEndpoint,
  strapiCollection,
  columns = [],
  staticData = [],
  enableSearch = true,
  enableSort = true,
  enablePagination = true,
  pageSize = 10,
  className = '',
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const { fetchFromStrapi } = dataSource === 'strapi' ? useStrapi() : { fetchFromStrapi: null };

  // Load data based on source
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        switch (dataSource) {
          case 'static':
            setData(staticData || []);
            break;
          case 'api':
            if (apiEndpoint) {
              const response = await fetch(apiEndpoint);
              const result = await response.json();
              setData(Array.isArray(result) ? result : result.data || []);
            }
            break;
          case 'strapi':
            if (strapiCollection && fetchFromStrapi) {
              const result = await fetchFromStrapi(strapiCollection);
              const items = result?.data?.map(item => ({
                id: item.id,
                ...item.attributes,
              })) || [];
              setData(items);
            }
            break;
          default:
            setData([]);
        }
      } catch (error) {
        console.error('Error loading table data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataSource, apiEndpoint, strapiCollection, staticData, fetchFromStrapi]);

  // Filter data by search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => 
      columns.some(col => {
        const value = row[col.key];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, enablePagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    if (!enableSort) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const formatValue = (value, column) => {
    if (value === null || value === undefined) return '-';

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(value);
      case 'boolean':
        return value ? '✓' : '✗';
      case 'link':
        return <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
      case 'badge':
        return (
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            background: '#e0e7ff',
            color: '#4338ca',
          }}>
            {value}
          </span>
        );
      default:
        return String(value);
    }
  };

  return (
    <section className={clsx('data-table-section', className)} style={{ padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {(title || description) && (
          <div style={{ marginBottom: '2rem' }}>
            {title && <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>}
            {description && <p style={{ color: '#6b7280' }}>{description}</p>}
          </div>
        )}

        {/* Search */}
        {enableSearch && (
          <div style={{ marginBottom: '1.5rem', maxWidth: '300px' }}>
            <div style={{ position: 'relative' }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }} 
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb',
                      cursor: enableSort && column.sortable !== false ? 'pointer' : 'default',
                      whiteSpace: 'nowrap',
                      width: column.width,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {column.label}
                      {enableSort && column.sortable !== false && sortConfig.key === column.key && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp size={16} /> : 
                          <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center' }}>
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr 
                    key={row.id || rowIndex}
                    style={{ 
                      background: rowIndex % 2 === 0 ? '#fff' : '#f9fafb',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = rowIndex % 2 === 0 ? '#fff' : '#f9fafb'}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid #e5e7eb',
                          color: '#4b5563',
                        }}
                      >
                        {formatValue(row[column.key], column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enablePagination && totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.5rem',
          }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={18} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    background: currentPage === i + 1 ? '#4f46e5' : '#fff',
                    color: currentPage === i + 1 ? '#fff' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, currentPage - 3), currentPage + 2)}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DataTable;

