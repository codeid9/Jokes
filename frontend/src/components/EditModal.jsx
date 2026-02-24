const EditModal = ({ isOpen, onClose, title, value, onSave, name }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-4">Edit {title}</h2>
        
        <input
          type={name === "email" ? "email" : "text"}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
          defaultValue={value}
          id="modal-input"
        />

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(document.getElementById("modal-input").value)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;