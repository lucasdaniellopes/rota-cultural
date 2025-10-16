import type { ReactNode } from 'react';
import * as S from './style';

interface DescriptionProps {
  children: ReactNode;
}

function Description({ children }: DescriptionProps) {
  return <S.DescriptionText>{children}</S.DescriptionText>;
}

export default Description;
