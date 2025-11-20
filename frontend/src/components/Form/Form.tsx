import type { ReactNode } from 'react';
import * as S from './style';

interface FormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

function Form({ children, onSubmit, className }: FormProps) {
  return (
    <S.FormContainer onSubmit={onSubmit} className={className}>
      {children}
    </S.FormContainer>
  );
}

export default Form;
