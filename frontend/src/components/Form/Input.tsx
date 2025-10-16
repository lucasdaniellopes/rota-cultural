import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import * as S from './style';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

function Input({ icon, type = 'text', ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <S.InputGroupContainer>
      {icon && <S.InputIcon>{icon}</S.InputIcon>}
      <S.InputElement type={inputType} {...props} />
      {isPassword && (
        <S.PasswordToggleButton onClick={togglePasswordVisibility} type="button">
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </S.PasswordToggleButton>
      )}
    </S.InputGroupContainer>
  );
}

export default Input;
