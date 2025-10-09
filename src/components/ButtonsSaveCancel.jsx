export default function ButtonsSaveCancel({ onSave, onCancel }) {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        type="submit"
        onClick={onSave}
        className="focus:outline-none text-white font-medium rounded-md text-sm px-5 py-2.5 bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300"
      >
        Speichern
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="focus:outline-none text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-md text-sm px-5 py-2.5"
      >
        Abbrechen
      </button>
    </div>
  );
}
