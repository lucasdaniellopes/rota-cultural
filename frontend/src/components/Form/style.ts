import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  padding: 2rem;
`;

export const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const HeaderTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  margin-bottom: 0.5rem;
`;

export const DescriptionText = styled.p`
  font-size: 0.875rem;
  color: #666666;
  margin: 0;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LabelText = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
`;

export const InputGroupContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #3b82f6;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #d0d0d0;
  }
`;

export const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  margin-right: 0.75rem;
  flex-shrink: 0;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const InputElement = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #1a1a1a;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: #999999;
  }

  &:disabled {
    cursor: not-allowed;
    color: #cccccc;
  }
`;

export const PasswordToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #999999;
  padding: 0;
  margin-left: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #1a1a1a;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const ForgotPasswordLink = styled.a`
  align-self: flex-end;
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: #1e40af;
    text-decoration: underline;
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #1e40af;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #bfdbfe;
    cursor: not-allowed;
  }
`;

export const SignUpContainer = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #666666;
  margin: 0;
`;

export const SignUpLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #1e40af;
    text-decoration: underline;
  }
`;
