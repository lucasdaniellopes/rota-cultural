import type { ReactNode } from 'react';
import * as S from './style';

interface HeaderProps {
  children: ReactNode;
}

function Header({ children }: HeaderProps) {
  return (
    <S.HeaderContainer>
      <S.HeaderTitle>{children}</S.HeaderTitle>
    </S.HeaderContainer>
  );
}

export default Header;
