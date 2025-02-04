import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPendingApplications, 
  approveApplication, 
  declineApplication 
} from '../../store/slices/producerApplicationsSlice';
import { 
  CheckCircle, XCircle, Building2, Globe, MapPin, 
  Calendar, Search, Filter, ChevronDown, Phone,
  User, MessageSquare, Link as LinkIcon, Clock,
  ChevronRight, Store, Info
} from 'lucide-react';

const ApplicationCard = ({ app, onApprove, onDecline }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details', icon: Info },
    { id: 'message', label: 'Admin Message', icon: MessageSquare },
    { id: 'business', label: 'Business Info', icon: Store }
  ];

  return (
    <div className="bg-cardBg border border-border rounded-2xl overflow-hidden transition-all duration-300">
      {/* Main Card Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-text group-hover:text-primary">
              {app.businessName}
            </h3>
            <div className="flex items-center gap-4 text-sm text-textSecondary">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {app.customerUsername}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {app.customerEmail}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {app.businessPhoneNumber}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(app)}
              className="bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white p-3 rounded-xl transition-all duration-300 hover:scale-105"
              title="Approve Application"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDecline(app)}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-xl transition-all duration-300 hover:scale-105"
              title="Decline Application"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-textSecondary">
              <MapPin className="w-4 h-4" />
              <span>{app.businessAddress}, {app.cityRegion}</span>
            </div>
            <div className="flex items-center gap-2 text-textSecondary">
              <Clock className="w-4 h-4" />
              <span>{app.yearsOfExperience} years of experience</span>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {app.categories.map((cat, index) => (
                <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {cat}
                </span>
              ))}
              {app.customCategory && (
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm">
                  {app.customCategory} (Custom)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 text-textSecondary hover:text-primary transition-colors mt-2"
        >
          <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-textSecondary hover:text-primary'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-text mb-2">Business Description</h4>
                  <p className="text-textSecondary">{app.businessDescription}</p>
                </div>
                {app.websiteOrSocialLink && (
                  <div className="flex items-center gap-2 text-primary">
                    <LinkIcon className="w-4 h-4" />
                    <a href={app.websiteOrSocialLink} target="_blank" rel="noopener noreferrer" 
                       className="hover:underline">
                      Website/Social Link
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'message' && (
              <div className="bg-primary/5 rounded-xl p-4">
                <h4 className="font-medium text-text mb-2">Message to Admin</h4>
                <p className="text-textSecondary">{app.messageToAdmin}</p>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-text mb-2">Location Details</h4>
                    <p className="text-textSecondary">
                      {app.businessAddress}<br />
                      {app.cityRegion}
                      {app.customCityRegion && ` (${app.customCityRegion})`}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-text mb-2">Experience</h4>
                    <p className="text-textSecondary">{app.yearsOfExperience} years in business</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ApplicationManagement = () => {
  const dispatch = useDispatch();
  const { applications, status, error } = useSelector(state => state.producerApplications);
  const declineReasonRef = useRef('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchPendingApplications());
  }, [dispatch]);

  const handleApprove = async (application) => {
    if (application.customCategory) {
      if (window.confirm(`This application has a custom category: ${application.customCategory}. Do you want to add it to the category list?`)) {
        await dispatch(approveApplication({ applicationId: application.applicationId, approveCC: true }));
      } else {
        await dispatch(approveApplication({ applicationId: application.applicationId, approveCC: false }));
      }
    } else {
      await dispatch(approveApplication({ applicationId: application.applicationId }));
    }
  };

  const handleDecline = async () => {
    const reason = declineReasonRef.current.value.trim();
    if (reason) {
      await dispatch(declineApplication({
        applicationId: selectedApp.applicationId,
        reason: reason
      }));
      setShowDeclineModal(false);
      declineReasonRef.current.value = '';
      setSelectedApp(null);
    }
  };

  const filteredApplications = useMemo(() => 
    applications.filter(app => 
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [applications, searchTerm]
  );

  const MemoizedApplicationCard = useMemo(() => React.memo(ApplicationCard), []);

  if (status === 'loading') {
    return (
      <>
      <p>Loading...</p>
      </>
    );

  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-cardBg border border-border rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text">Producer Applications</h2>
            <p className="text-textSecondary mt-1">Manage and review seller applications</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl bg-inputBg border border-border text-text placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      {applications.length === 0 ? (
        <div className="bg-cardBg border border-border rounded-2xl p-12 text-center">
          <Building2 className="w-16 h-16 text-textSecondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">No Applications Yet</h3>
          <p className="text-textSecondary">When sellers apply, their applications will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredApplications.map((app) => (
            <MemoizedApplicationCard 
              key={app.applicationId} 
              app={app}
              onApprove={handleApprove}
              onDecline={() => {
                setSelectedApp(app);
                setShowDeclineModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop with opacity instead of blur (Blur HIT PERFORMANCE hard soo so much ISSUES) */}
          <div className="fixed inset-0 bg-black/70" />
          
          {/* Modal content */}
          <div className="relative bg-cardBg p-6 rounded-2xl w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 text-text">Decline Application</h3>
            <textarea
              ref={declineReasonRef}
              placeholder="Enter reason for declining..."
              className="w-full p-3 border border-border rounded-xl bg-inputBg text-text placeholder:text-textSecondary resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  declineReasonRef.current.value = '';
                  setSelectedApp(null);
                }}
                className="px-4 py-2 border border-border rounded-xl text-text hover:bg-inputBg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement; 