import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const DynamicTable = ({ title, headers, fields, data, onChange }) => {
  const addRow = () => {
    const newRow = fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {});
    onChange([...data, newRow]);
  };

  const removeRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const updateRow = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    onChange(newData);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest">{title}</h4>
        <Button variant="secondary" className="p-1.5 h-auto text-[10px] rounded-lg gap-1" onClick={addRow}>
          <Plus size={12} /> Agregar
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              {headers.map((h, i) => <th key={i} className="px-4 py-2">{h}</th>)}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {fields.map((field, j) => (
                  <td key={j} className="px-2 py-1">
                    <input 
                      className="w-full px-2 py-1.5 bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                      value={row[field]}
                      onChange={(e) => updateRow(i, field, e.target.value)}
                      placeholder="..."
                    />
                  </td>
                ))}
                <td className="px-2 py-1 text-center">
                  <button onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
