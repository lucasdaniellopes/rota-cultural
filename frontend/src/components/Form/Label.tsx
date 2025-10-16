import type { ReactNode } from 'react';
import * as S from './style';

interface LabelProps {
  htmlFor: string;
  children: ReactNode;
}

function Label({ htmlFor, children }: LabelProps) {
  return <S.LabelText htmlFor={htmlFor}>{children}</S.LabelText>;
}

export default Label;
