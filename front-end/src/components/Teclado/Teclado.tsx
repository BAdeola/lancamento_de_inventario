import { Delete } from 'lucide-react'; 

interface TecladoProps {
  onKeyPress: (key: string) => void;
}

export function Teclado({ onKeyPress }: TecladoProps) {

  // Tamanho do botão baseado em vmin: em paisagem, vmin = vh (altura), então encolhe automaticamente
  const btnSize = 'clamp(36px, 7.5vmin, 66px)';

  const btnStyle = [
    "rounded-full flex items-center justify-center shrink-0",
    "bg-white shadow-sm border border-gray-200 text-gray-700",
    "active:bg-orange-100 active:text-orange-600 active:border-orange-300",
    "transition-all select-none font-bold",
  ].join(" ");

  const renderBtn = (
    content: React.ReactNode,
    key: string,
    extraClass = ""
  ) => (
    <button
      key={key}
      onClick={() => onKeyPress(key)}
      className={`${btnStyle} ${extraClass}`}
      style={{
        width: btnSize,
        height: btnSize,
        fontSize: `calc(${btnSize} * 0.38)`,
      }}
    >
      {content}
    </button>
  );

  return (
    <div className="flex items-center justify-center w-full h-full min-w-0 min-h-0 overflow-hidden">
      <div
        className="grid grid-cols-3 justify-items-center"
        style={{ gap: 'clamp(8px, 2vmin, 18px)' }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) =>
          renderBtn(num, String(num))
        )}
        {renderBtn('C', 'C', 'text-red-500')}
        {renderBtn('0', '0')}
        {renderBtn(
          <Delete style={{ width: `calc(${btnSize} * 0.45)`, height: `calc(${btnSize} * 0.45)` }} />,
          'DEL',
          'text-orange-500'
        )}
      </div>
    </div>
  );
}