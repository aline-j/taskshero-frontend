export default function ButtonsSaveCancel({ onSave, onCancel }) {
  return (
    <div className="flex justify-center gap-4">
      <button
        type="submit"
        onClick={onSave}
        className="text-white font-medium rounded-md text-sm px-5 py-2.5 bg-green-500 hover:bg-green-600"
      >
        Speichern
      </button>

      <button
        type="button"
        onClick={onCancel}
        className=" text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-md text-sm px-5 py-2.5"
      >
        Abbrechen
      </button>
    </div>
  );
}
