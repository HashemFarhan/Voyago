import { useState } from 'react';

const TripForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    destinations: [''],
    duration: 7,
    budget: 1000,
    interests: [],
    optional: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDestinationChange = (index, value) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = value;
    setFormData(prev => ({
      ...prev,
      destinations: newDestinations,
    }));
  };

  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, ''],
    }));
  };

  const removeDestination = (index) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Plan Your Trip</h2>
        
        {/* Destinations */}
        <div className="space-y-2">
          <label className="block font-medium">Destinations</label>
          {formData.destinations.map((destination, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestinationChange(index, e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Enter destination"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDestination(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDestination}
            className="text-accent hover:text-accent-dark"
          >
            + Add Another Destination
          </button>
        </div>

        {/* Duration */}
        <div>
          <label className="block font-medium">Trip Duration (days)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block font-medium">Budget ($)</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block font-medium">Interests</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Adventure', 'Culture', 'Food', 'Nature', 'Shopping', 'Relaxation'].map(interest => (
              <label key={interest} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                  className="rounded text-accent"
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block font-medium">Additional Notes</label>
          <textarea
            name="optional"
            value={formData.optional}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Any specific landmarks, cities, or preferences..."
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-accent text-white py-3 rounded hover:bg-opacity-90"
      >
        Generate Itinerary
      </button>
    </form>
  );
};

export default TripForm; 