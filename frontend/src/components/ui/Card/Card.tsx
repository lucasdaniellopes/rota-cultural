import styles from './Card.module.css';
import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`${styles.cardContent} ${className}`}>
      {children}
    </div>
  );
}