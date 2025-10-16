import type { ReactNode } from 'react';
import * as S from './style';

interface FieldProps {
  children: ReactNode;
}

function Field({ children }: FieldProps) {
  return <S.FieldWrapper>{children}</S.FieldWrapper>;
}

export default Field;
