import * as S from './style';

interface SignUpProps {
  prefix: string;
  linkText: string;
  href: string;
}

function SignUp({ prefix, linkText, href }: SignUpProps) {
  return (
    <S.SignUpContainer>
      {prefix}{' '}
      <S.SignUpLink href={href}>{linkText}</S.SignUpLink>
    </S.SignUpContainer>
  );
}

export default SignUp;
