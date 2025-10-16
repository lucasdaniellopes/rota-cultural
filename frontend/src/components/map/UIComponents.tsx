import styled from 'styled-components';

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #ffffff;
  font-size: 0.875rem;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const Button = styled.button<{ variant?: 'default' | 'ghost'; size?: 'sm' | 'md' | 'lg' }>`
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '0.375rem 0.75rem';
      case 'lg': return '0.75rem 1.5rem';
      default: return '0.5rem 1rem';
    }
  }};

  background-color: ${props =>
    props.variant === 'ghost' ? 'transparent' : '#3b82f6'
  };
  color: ${props =>
    props.variant === 'ghost' ? '#1f2937' : '#ffffff'
  };
  border: none;
  border-radius: 0.375rem;
  font-size: ${props =>
    props.size === 'sm' ? '0.875rem' : '1rem'
  };
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props =>
      props.variant === 'ghost' ? '#f3f4f6' : '#1e40af'
    };
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 20rem;
`;

export const CardContent = styled.div`
  padding: 0.75rem;
`;

export const DestinationContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DestinationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const DestinationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatusDot = styled.div<{ color: 'green' | 'red' }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${props => props.color === 'green' ? '#10b981' : '#ef4444'};
`;

export const DestinationText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DestinationLabel = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

export const DestinationName = styled.p`
  font-weight: 500;
  margin: 0;
`;