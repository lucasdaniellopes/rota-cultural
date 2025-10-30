import { Heart } from 'lucide-react';
import type { ReactNode } from 'react';
import * as S from './style';

interface CardProps {
  children: ReactNode;
  image: string;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

function CardRoot({ children, image }: CardProps) {
  return (
    <S.CardContainer>
      <S.CardImage src={image} alt="Card" />
      <S.CardContent>
        {children}
      </S.CardContent>
    </S.CardContainer>
  );
}

interface CardTitleProps {
  children: ReactNode;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

function CardTitleWithFav({ children, onFavorite, isFavorited = false }: CardTitleProps) {
  return (
    <S.CardHeader>
      <S.CardTitle>{children}</S.CardTitle>
      <S.CardFavoriteButton onClick={onFavorite} title="Adicionar aos favoritos">
        <Heart size={20} fill={isFavorited ? '#ff4444' : 'none'} color={isFavorited ? '#ff4444' : 'currentColor'} />
      </S.CardFavoriteButton>
    </S.CardHeader>
  );
}

interface CardTitleProps {
  children: ReactNode;
}

function CardTitle({ children }: CardTitleProps) {
  return <S.CardTitle>{children}</S.CardTitle>;
}

interface CardDescriptionProps {
  children: ReactNode;
}

function CardDescription({ children }: CardDescriptionProps) {
  return <S.CardDescription>{children}</S.CardDescription>;
}

interface CardMetaProps {
  children: ReactNode;
}

function CardMeta({ children }: CardMetaProps) {
  return <S.CardMeta>{children}</S.CardMeta>;
}

interface CardMetaItemProps {
  children: ReactNode;
  icon?: ReactNode;
}

function CardMetaItem({ children, icon }: CardMetaItemProps) {
  return (
    <S.CardMetaItem>
      {icon}
      <span>{children}</span>
    </S.CardMetaItem>
  );
}

interface CardActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function CardAction({ children, ...props }: CardActionProps) {
  return (
    <S.CardAction {...props}>
      {children}
    </S.CardAction>
  );
}

// Compound Component Pattern
const Card = Object.assign(CardRoot, {
  TitleWithFav: CardTitleWithFav,
  Title: CardTitle,
  Description: CardDescription,
  Meta: CardMeta,
  MetaItem: CardMetaItem,
  Action: CardAction,
});

export default Card;
