import { useState } from 'react';

const ItineraryCard = ({ day, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState('');

  const handleEditSubmit = (sectionType) => {
    onEdit(sectionType, day.day, edits);
    setIsEditing(false);
    setEdits('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">Day {day.day}</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-accent hover:text-accent-dark"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Hotel */}
        <div>
          <h4 className="font-medium text-gray-700">Hotel</h4>
          <p className="mt-1">{day.hotel}</p>
          {isEditing && (
            <div className="mt-2">
              <textarea
                value={edits}
                onChange={(e) => setEdits(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter new hotel details..."
              />
              <button
                onClick={() => handleEditSubmit('hotel')}
                className="mt-2 px-3 py-1 bg-accent text-white rounded hover:bg-opacity-90"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Activities */}
        <div>
          <h4 className="font-medium text-gray-700">Activities</h4>
          <ul className="mt-1 list-disc list-inside">
            {day.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
          {isEditing && (
            <div className="mt-2">
              <textarea
                value={edits}
                onChange={(e) => setEdits(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter new activities (one per line)..."
              />
              <button
                onClick={() => handleEditSubmit('activities')}
                className="mt-2 px-3 py-1 bg-accent text-white rounded hover:bg-opacity-90"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Transport */}
        <div>
          <h4 className="font-medium text-gray-700">Transport</h4>
          <p className="mt-1">{day.transport}</p>
          {isEditing && (
            <div className="mt-2">
              <textarea
                value={edits}
                onChange={(e) => setEdits(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter new transport details..."
              />
              <button
                onClick={() => handleEditSubmit('transport')}
                className="mt-2 px-3 py-1 bg-accent text-white rounded hover:bg-opacity-90"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Estimated Cost */}
        <div>
          <h4 className="font-medium text-gray-700">Estimated Cost</h4>
          <p className="mt-1">${day.estimated_cost}</p>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard; 