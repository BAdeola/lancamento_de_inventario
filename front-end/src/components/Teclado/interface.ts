export interface TecladoProps {
  visor: string;
  onKeyPress: (key: string) => void;
  onConfirmar: () => void;
}