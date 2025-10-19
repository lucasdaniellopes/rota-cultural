import styled from 'styled-components';

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f0f0f0;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

export const CardFavoriteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #cccccc;
  transition: color 0.2s ease;
  flex-shrink: 0;

  &:hover {
    color: #ff4444;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #666666;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1rem;
  font-size: 0.8rem;
  color: #999999;
`;

export const CardMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 1rem;
    height: 1rem;
  }

  &:nth-child(2n) {
    justify-content: flex-end;
    text-align: right;
  }
`;

export const CardAction = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #ffffff;
  color: #1a1a1a;
  border: 1px solid #e0e0e0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #f0f0f0;
    color: #cccccc;
    cursor: not-allowed;
  }
`;
