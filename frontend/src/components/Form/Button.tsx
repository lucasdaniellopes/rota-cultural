import type { ReactNode } from 'react';
import * as S from './style';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: 'submit' | 'button' | 'reset';
}

function Button({ children, type = 'submit', ...props }: ButtonProps) {
  return (
    <S.PrimaryButton type={type} {...props}>
      {children}
    </S.PrimaryButton>
  );
}

export default Button;
