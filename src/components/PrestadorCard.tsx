import { motion, AnimatePresence } from "framer-motion";
import { XCircleIcon } from "@heroicons/react/16/solid";

const itemVariants = {
  hidden: { 
    opacity: 0,
    x: Math.random() < 0.5 ? -100 : 100,
    y: Math.random() * 40 - 20,
  },
  visible: { 
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

const PrestadorCard = ({
  prestador,
  buttonState,
  onCheckIn,
  onCheckOut,
  onDelete
}: {
  prestador: { _id: string; name: string; company: string; address: string; phone: string; service: string; rg: string; cpf: string; cnpj: string; logs: { entryTime: string; leaveTime?: string }[] };
  buttonState: Map<string, { checkInDisabled: boolean; checkOutDisabled: boolean }>;
  onCheckIn: (id: string) => void;
  onCheckOut: (id: string) => void;
  onDelete: (id: string) => void;
}) => (
  <motion.div
    variants={itemVariants}
    className="relative p-4 mb-4 bg-gray-800 rounded-lg shadow-md max-w-xs w-full"
    layout
  >
    <button
      onClick={() => onDelete(prestador._id)}
      className="absolute top-2 right-2 p-1 bg-red-400 hover:bg-red-700 rounded-full transition-colors"
    >
      <XCircleIcon className="h-4 w-4 text-white" />
    </button>
  
    <h3 className="font-semibold text-lg mb-2 text-white">{prestador.name}</h3>
    <p className="text-sm text-gray-400 mb-2">Empresa: {prestador.company}</p>
    <p className="text-sm text-gray-400 mb-2">Telefone: {prestador.phone}</p>
    <p className="text-sm text-gray-400 mb-2">Serviço: {prestador.service}</p>
    <p className="text-sm text-gray-400 mb-2">RG: {prestador.rg}</p>
    <p className="text-sm text-gray-400 mb-2">CPF: {prestador.cpf}</p>
    <p className="text-sm text-gray-400 mb-2">CNPJ: {prestador.cnpj}</p>
    <p className="text-sm text-gray-400 mb-4">Endereço: {prestador.address}</p>
  
    <div className="flex gap-3 mb-3">
      <button
        onClick={() => onCheckIn(prestador._id)}
        disabled={buttonState.get(prestador._id)?.checkInDisabled}
        className="flex-1 px-3 py-1.5 rounded-md bg-green-500 hover:bg-green-700 disabled:bg-green-900 transition-colors"
      >
        Chegada
      </button>
      <button
        onClick={() => onCheckOut(prestador._id)}
disabled={buttonState.get(prestador._id)?.checkOutDisabled}
        className="flex-1 px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-700 disabled:bg-red-900 transition-colors"
      >
        Saída
      </button>
    </div>
    <div className="space-y-1 text-sm text-gray-400">
      <AnimatePresence>
        {prestador.logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-between"
          >
            <span>
              ✅ Entrou: {new Date(log.entryTime).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
            {log.leaveTime && (
              <span>
                ➡️ Saiu: {new Date(log.leaveTime).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </motion.div>
);

export default PrestadorCard;