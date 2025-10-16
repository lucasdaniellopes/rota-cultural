import type { ReactNode } from 'react';
import * as S from './style';

interface ForgotPasswordProps {
  href: string;
  children: ReactNode;
}

function ForgotPassword({ href, children }: ForgotPasswordProps) {
  return <S.ForgotPasswordLink href={href}>{children}</S.ForgotPasswordLink>;
}

export default ForgotPassword;
