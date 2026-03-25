import React, { useState } from 'react';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import Button from '../forms/Button';

/**
 * Pricing Table Section Component
 */
const PricingTable = ({
  title,
  subtitle,
  plans = [],
  showToggle = true,
  monthlyLabel = 'Monthly',
  yearlyLabel = 'Yearly',
  backgroundColor = '#ffffff',
  className = '',
}) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const containerStyle = {
    background: backgroundColor,
    padding: '4rem 2rem',
  };

  return (
    <section className={clsx('pricing-table-section', className)} style={containerStyle}>
      {(title || subtitle) && (
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {title && <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{title}</h2>}
          {subtitle && <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>{subtitle}</p>}
        </div>
      )}

      {showToggle && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '3rem',
        }}>
          <span style={{ 
            fontWeight: billingPeriod === 'monthly' ? 600 : 400,
            color: billingPeriod === 'monthly' ? '#1f2937' : '#9ca3af',
          }}>
            {monthlyLabel}
          </span>
          
          <button
            onClick={() => setBillingPeriod(p => p === 'monthly' ? 'yearly' : 'monthly')}
            style={{
              width: '56px',
              height: '28px',
              borderRadius: '14px',
              background: '#4f46e5',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: 0,
            }}
          >
            <span style={{
              position: 'absolute',
              top: '2px',
              left: billingPeriod === 'yearly' ? '30px' : '2px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s',
            }} />
          </button>
          
          <span style={{ 
            fontWeight: billingPeriod === 'yearly' ? 600 : 400,
            color: billingPeriod === 'yearly' ? '#1f2937' : '#9ca3af',
          }}>
            {yearlyLabel}
          </span>
        </div>
      )}

      <div 
        className="pricing-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(plans.length, 4)}, 1fr)`,
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          alignItems: 'stretch',
        }}
      >
        {plans.map((plan, index) => (
          <PricingCard 
            key={plan.id || index} 
            {...plan} 
            billingPeriod={billingPeriod}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * Pricing Card Component
 */
const PricingCard = ({
  name,
  description,
  monthlyPrice,
  yearlyPrice,
  currency = '$',
  billingPeriod,
  features = [],
  ctaButton,
  highlighted = false,
  badge,
}) => {
  const price = billingPeriod === 'yearly' && yearlyPrice ? yearlyPrice : monthlyPrice;
  const period = billingPeriod === 'yearly' ? '/year' : '/month';

  const cardStyle = {
    background: highlighted ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : '#fff',
    color: highlighted ? '#fff' : '#1f2937',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: highlighted 
      ? '0 20px 40px rgba(79, 70, 229, 0.3)' 
      : '0 4px 20px rgba(0,0,0,0.08)',
    position: 'relative',
    transform: highlighted ? 'scale(1.05)' : 'scale(1)',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div className="pricing-card" style={cardStyle}>
      {badge && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: highlighted ? '#fff' : '#4f46e5',
          color: highlighted ? '#4f46e5' : '#fff',
          padding: '0.25rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}>
          {badge}
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>{name}</h3>
        {description && (
          <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{description}</p>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '3rem', fontWeight: 700 }}>
          {currency}{price}
        </span>
        <span style={{ opacity: 0.8 }}>{period}</span>
      </div>

      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0,
        marginBottom: '2rem',
        flex: 1,
      }}>
        {features.map((feature, idx) => (
          <li 
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0',
              opacity: feature.included !== false ? 1 : 0.5,
            }}
          >
            {feature.included !== false ? (
              <Check size={18} color={highlighted ? '#fff' : '#22c55e'} />
            ) : (
              <X size={18} color={highlighted ? 'rgba(255,255,255,0.5)' : '#ef4444'} />
            )}
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>

      {ctaButton && (
        <Button 
          {...ctaButton}
          variant={highlighted ? 'secondary' : 'primary'}
          size="large"
          style={{
            width: '100%',
            background: highlighted ? '#fff' : undefined,
            color: highlighted ? '#4f46e5' : undefined,
          }}
        />
      )}
    </div>
  );
};

export default PricingTable;

