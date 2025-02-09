import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Building2, Store, MapPin, Globe, MessageSquare, Calendar, ChevronDown, Plus, X } from 'lucide-react';
import { submitApplication } from '../store/slices/producerApplicationSlice';
import Button from './ui/Button';
import { fetchCategories } from '../store/slices/categorySlice';
import { useDebounce } from '../hooks/useDebounce';

const SellerApplication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector(state => state.categories);
  const { loading, error, success } = useSelector(state => state.producerApplication);
  const { cities, loading: citiesLoading } = useSelector(state => state.address);

  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    categoryIds: [],
    customCategory: null,
    businessAddress: '',
    businessPhoneNumber: '',
    cityRegion: '',
    customCityRegion: '',
    yearsOfExperience: '',
    websiteOrSocialLink: '',
    messageToAdmin: ''
  });

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomCityRegion, setShowCustomCityRegion] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      yearsOfExperience: parseInt(formData.yearsOfExperience),
      customCategory: showCustomCategory ? formData.customCategory : null,
      customCityRegion: showCustomCityRegion ? formData.customCityRegion : null
    };
    await dispatch(submitApplication(submitData));
    if (success) {
      navigate('/account');
    }
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  const handleCityRegionChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      cityRegion: value
    }));
    setShowCustomCityRegion(value === 'Other');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-text">Become a Seller</h1>
            <p className="mt-2 text-textSecondary">Fill out the form below to apply as a seller on our platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Information */}
            <div className="space-y-6 bg-cardBg p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold text-text flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Business Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">
                    Business Description *
                  </label>
                  <textarea
                    required
                    value={formData.businessDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">
                    Business Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.businessPhoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessPhoneNumber: e.target.value }))}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your business phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your business address"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">
                      City/Region *
                    </label>
                    <div className="space-y-2">
                      <select
                        required
                        value={formData.cityRegion}
                        onChange={handleCityRegionChange}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select a city</option>
                        {cities.map(city => (
                          <option key={city.name} value={city.name}>
                            {city.name} ({city.adminName1})
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                      {showCustomCityRegion && (
                        <input
                          type="text"
                          required
                          placeholder="Enter your city/region"
                          value={formData.customCityRegion || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, customCityRegion: e.target.value }))}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-6 bg-cardBg p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold text-text flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Product Categories *
              </h2>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {categories?.map(category => (
                    <button
                      key={category.categoryId}
                      type="button"
                      onClick={() => handleCategoryChange(category.categoryId)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        formData.categoryIds.includes(category.categoryId)
                          ? 'bg-primary text-white'
                          : 'bg-background text-textSecondary border border-border'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(!showCustomCategory)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      showCustomCategory
                        ? 'bg-primary text-white'
                        : 'bg-background text-textSecondary border border-border'
                    }`}
                  >
                    Other
                  </button>
                </div>

                {showCustomCategory && (
                  <input
                    type="text"
                    placeholder="Enter custom category"
                    value={formData.customCategory || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6 bg-cardBg p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold text-text flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Additional Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                    className="w-full hide-spinner px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">
                    Website or Social Media Link
                  </label>
                  <input
                    type="url"
                    value={formData.websiteOrSocialLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, websiteOrSocialLink: e.target.value }))}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">
                    Message to Admin
                  </label>
                  <textarea
                    value={formData.messageToAdmin}
                    onChange={(e) => setFormData(prev => ({ ...prev, messageToAdmin: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primaryHover text-white"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerApplication; 