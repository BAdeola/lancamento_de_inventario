import type { TouchInputProps } from "./interface";


export function TouchInput({ label, valor, isAtivo, onClick }: TouchInputProps) {
  return (
    // max-w-xs impede que o input fique largo demais no tablet paisagem
    <div className="w-full max-w-xs flex flex-col items-center mx-auto">
      <label className="text-sm md:text-base font-semibold text-gray-600 mb-2">{label}</label>
      <div 
        onClick={onClick}
        // h-12 no mobile -> h-14 no tablet maior (md:)
        className={`w-full h-12 md:h-14 bg-white rounded-xl border-2 flex items-center justify-center text-xl md:text-2xl font-bold cursor-pointer transition-all shadow-sm
          ${isAtivo 
            ? 'border-orange-500 ring-4 ring-orange-100 text-orange-600' 
            : 'border-gray-200 text-gray-800 hover:border-orange-300'
          }`}
      >
        {valor}
      </div>
    </div>
  );
}