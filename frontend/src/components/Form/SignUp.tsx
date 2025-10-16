import * as S from './style';

interface SignUpProps {
  prefix: string;
  linkText: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function SignUp({ prefix, linkText, href, onClick }: SignUpProps) {
  return (
    <S.SignUpContainer>
      {prefix}{' '}
      <S.SignUpLink href={href} onClick={onClick}>{linkText}</S.SignUpLink>
    </S.SignUpContainer>
  );
}

export default SignUp;
