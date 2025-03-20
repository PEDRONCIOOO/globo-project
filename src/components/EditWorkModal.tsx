import React, { useState, useEffect } from "react";

interface EditWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: {
    _id: string;
    name: string;
    cpf: string;
    nascimento: string;
    admissao: string;
    salario: string;
    numero: string;
    email: string;
    address: string;
    contract: string;
    role: string;
  } | null;
  onSave: (updatedWorker: any) => void;
}

const EditWorkerModal: React.FC<EditWorkerModalProps> = ({
  isOpen,
  onClose,
  worker,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    nascimento: "",
    admissao: "",
    salario: "",
    numero: "",
    email: "",
    address: "",
    contract: "",
    role: "",
  });

  useEffect(() => {
    if (worker) {
      setFormData(worker); // Update formData when worker changes
    }
  }, [worker]);

  if (!isOpen || !worker) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Pass updated worker data to the parent
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Funcionário:</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="CPF"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="nascimento"
            value={formData.nascimento}
            onChange={handleChange}
            placeholder="Nascimento"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="admissao"
            value={formData.admissao}
            onChange={handleChange}
            placeholder="Admissao"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="salario"
            value={formData.salario}
            onChange={handleChange}
            placeholder="Salario"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            placeholder="Numero"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Endereço"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="contract"
            value={formData.contract}
            onChange={handleChange}
            placeholder="Tipo de Contrato"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Cargo"
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 rounded cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkerModal;