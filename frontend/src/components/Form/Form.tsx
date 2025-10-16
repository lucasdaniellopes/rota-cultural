import type { ReactNode } from 'react';
import * as S from './style';

interface FormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

function Form({ children, onSubmit }: FormProps) {
  return (
    <S.FormContainer onSubmit={onSubmit}>
      {children}
    </S.FormContainer>
  );
}

export default Form;
