import { MapPin, X } from "lucide-react";
import type { Location } from "@/services/api";
import {
  Button,
  Card,
  CardContent,
  DestinationContainer,
  DestinationItem,
  DestinationInfo,
  StatusDot,
  DestinationText,
  DestinationLabel,
  DestinationName
} from "./UIComponents";

interface DestinationSelectorProps {
    selectedStart: Location | null;
    selectedEnd: Location | null;
    onClearStart: () => void;
    onClearEnd: () => void;
    onCalculateRoute: () => void;
}

export default function DestinationSelector({
    selectedStart,
    selectedEnd,
    onClearStart,
    onClearEnd,
    onCalculateRoute
}: DestinationSelectorProps) {
    return (
    <DestinationContainer>
      {/* Card de Partida */}
      <Card>
        <CardContent>
          <DestinationItem>
            <DestinationInfo>
              <StatusDot color="green" />
              <DestinationText>
                <DestinationLabel>Partida</DestinationLabel>
                <DestinationName>
                  {selectedStart ? selectedStart.name : "Nenhum ponto selecionado"}
                </DestinationName>
              </DestinationText>
            </DestinationInfo>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearStart}
            >
              <X size={16} />
            </Button>
          </DestinationItem>
        </CardContent>
      </Card>

      {/* Card de Destino */}
      <Card>
        <CardContent>
          <DestinationItem>
            <DestinationInfo>
              <StatusDot color="red" />
              <DestinationText>
                <DestinationLabel>Destino</DestinationLabel>
                <DestinationName>
                  {selectedEnd ? selectedEnd.name : "Nenhum ponto selecionado"}
                </DestinationName>
              </DestinationText>
            </DestinationInfo>
            {selectedEnd && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearEnd}
              >
                <X size={16} />
              </Button>
            )}
          </DestinationItem>
        </CardContent>
      </Card>

      {/* Botão Calcular Rota (só quando tiver ambos os pontos) */}
      {selectedStart && selectedEnd && (
        <Button
          onClick={onCalculateRoute}
          size="lg"
        >
          <MapPin size={16} style={{ marginRight: '0.5rem' }} />
          Calcular Rota
        </Button>
      )}
    </DestinationContainer>
  );

}
