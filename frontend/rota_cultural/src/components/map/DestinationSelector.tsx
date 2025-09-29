import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, X } from "lucide-react";
import type { Location } from "@/services/api";

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
    <div className="absolute top-4 left-4 z-[1000] space-y-2">
      {/* Card de Partida */}
      <Card className="w-80 shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-xs text-gray-500">Partida</p>
                <p className="font-medium">
                  {selectedStart ? selectedStart.name : "Nenhum ponto selecionado"}
                </p>
              </div>
            </div>
            
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearStart}
              >
                <X className="h-4 w-4" />
              </Button>
            
          </div>
        </CardContent>
      </Card>

      {/* Card de Destino */}
      <Card className="w-80 shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-xs text-gray-500">Destino</p>
                <p className="font-medium">
                  {selectedEnd ? selectedEnd.name : "Nenhum ponto selecionado"}
                </p>
              </div>
            </div>
            {selectedEnd && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearEnd}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botão Calcular Rota (só quando tiver ambos os pontos) */}
      {selectedStart && selectedEnd && (
        <Button
          onClick={onCalculateRoute}
          className="w-80 shadow-lg"
          size="lg"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Calcular Rota
        </Button>
      )}
    </div>
  );

}
