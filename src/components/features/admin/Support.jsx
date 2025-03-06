import React, { useState, useEffect, useRef , Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MessageCircle, Clock, AlertTriangle, 
  Send, ChevronRight, ArrowLeft, UserCircle2, X,
  Filter, Search, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { 
  fetchAdminTickets, fetchUnassignedTickets, assignTicket,
  fetchMessages, addMessage, setCurrentTicket, clearCurrentTicket,
  closeTicket, forwardTicket, updatePagination, updateSorting
} from '../../../store/slices/common/supportTicketSlice';
import { fetchUsers } from '../../../store/slices/admin/userSlice';
import Button from '../../common/ui/Button';
import { useTheme } from '../../../context/ThemeContext';

const Support = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { tickets, unassignedTickets, currentTicket, messages, loading, pagination, sorting } = useSelector(state => state.supportTickets);
  const { users } = useSelector(state => state.users);
  const [viewMode, setViewMode] = useState('assigned');
  const [status, setStatus] = useState('ASSIGNED');
  const [newMessage, setNewMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showCloseTicketModal, setShowCloseTicketModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    direction: 'desc',
    pageSize: 10
  });

  useEffect(() => {
    if (viewMode === 'assigned') {
      dispatch(fetchAdminTickets({ 
        status,
        page: pagination.currentPage,
        size: filters.pageSize,
        sortBy: filters.sortBy,
        direction: filters.direction
      }));
    } else {
      dispatch(fetchUnassignedTickets({
        page: pagination.currentPage,
        size: filters.pageSize,
        sortBy: filters.sortBy,
        direction: filters.direction
      }));
    }
  }, [dispatch, viewMode, status, pagination.currentPage, filters]);

  useEffect(() => {
    if (currentTicket) {
      dispatch(fetchMessages(currentTicket.ticketId));
    }
  }, [dispatch, currentTicket]);

  useEffect(() => {
    // Fetch admin users
    dispatch(fetchUsers({ role: 'ADMIN' }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAssignTicket = async (ticketId) => {
    await dispatch(assignTicket(ticketId));
    dispatch(fetchUnassignedTickets());
  };

  const handleForwardTicket = async () => {
    if (!selectedAdmin) return;
    
    try {
      await dispatch(forwardTicket({ 
        ticketId: currentTicket.ticketId, 
        newAdminId: selectedAdmin 
      })).unwrap();
      setShowForwardModal(false);
      setShowChatModal(false);
      setSelectedAdmin('');
      dispatch(fetchAdminTickets());
    } catch (error) {
      console.error('Failed to forward ticket:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await dispatch(addMessage({
      ticketId: currentTicket.ticketId,
      messageData: { message: newMessage, internalNote: isInternalNote }
    }));
    setNewMessage('');
  };

  const handleCloseTicket = async () => {
    try {
      await dispatch(closeTicket(currentTicket.ticketId));
      setShowCloseTicketModal(false);
      setShowChatModal(false);
      dispatch(clearCurrentTicket());
      if (viewMode === 'assigned') {
        dispatch(fetchAdminTickets());
      }
    } catch (error) {
      console.error('Failed to close ticket:', error);
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(updatePagination({ currentPage: newPage }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    dispatch(updateSorting({ sortBy: newFilters.sortBy, direction: newFilters.direction }));
  };

  const filteredTickets = (viewMode === 'assigned' ? tickets : unassignedTickets)
    .filter(ticket => 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${ticket.createdBy?.firstname} ${ticket.createdBy?.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2.5 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'OPEN':
        return `${baseClasses} ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800'}`;
      case 'CLOSED':
        return `${baseClasses} ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800'}`;
      default:
        return `${baseClasses} ${isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}`;
    }
  };

  if (!currentTicket || !showChatModal) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-text">Support Tickets</h1>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={viewMode === 'assigned' ? 'default' : 'outline'}
              onClick={() => setViewMode('assigned')}
              size="sm"
              className="min-w-[120px] flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>My Tickets</span>
            </Button>
            <Button 
              variant={viewMode === 'unassigned' ? 'default' : 'outline'}
              onClick={() => setViewMode('unassigned')}
              size="sm"
              className="min-w-[120px] flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4" />
              <span>Unassigned</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-cardBg p-4 rounded-lg border border-border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-text pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          {viewMode === 'assigned' && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-text"
            >
              <option value="ASSIGNED">Assigned</option>
              <option value="CLOSED">Closed</option>
            </select>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-cardBg p-6 rounded-xl border border-border animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-primary/10 rounded" />
                      <div className="h-3 w-24 bg-primary/10 rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-primary/10 rounded-full" />
                </div>
                <div className="border-t border-border pt-4">
                  <div className="h-3 w-20 bg-primary/10 rounded" />
                </div>
              </div>
            ))
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <div
                key={ticket.ticketId}
                className={`bg-cardBg p-6 rounded-xl cursor-pointer border border-border hover:border-primary/50 transition-all duration-200 ${
                  loading ? 'opacity-50 pointer-events-none' : ''
                }`}
                onClick={() => {
                  if (loading) return;
                  dispatch(setCurrentTicket(ticket));
                  setShowChatModal(true);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-text line-clamp-1">{ticket.subject}</h3>
                        <p className="text-sm text-textSecondary">
                          {ticket.createdBy?.firstname} {ticket.createdBy?.lastname}
                        </p>
                      </div>
                    </div>
                    <span className={getStatusBadge(ticket.status)}>
                      {ticket.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="text-sm text-textSecondary">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    {viewMode === 'unassigned' && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignTicket(ticket.ticketId);
                        }}
                        className="ml-auto"
                      >
                        Assign to Me
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-primary/5' : 'bg-primary-50'
              }`}>
                <MessageCircle className={`w-8 h-8 ${
                  isDark ? 'text-primary opacity-50' : 'text-primary-600'
                }`} />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">No tickets found</h3>
              <p className="text-textSecondary max-w-md">
                {viewMode === 'assigned' 
                  ? `No ${status.toLowerCase()} tickets assigned to you at the moment.`
                  : 'There are no unassigned tickets at the moment.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination - Only show if there are tickets and more than one page */}
        {filteredTickets.length > 0 && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-textSecondary">
                Showing {pagination.currentPage * pagination.pageSize + 1} to{' '}
                {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} of{' '}
                {pagination.totalElements} results
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.isFirst}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    variant={pagination.currentPage === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(index)}
                    className="w-8 h-8"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.isLast}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="fixed inset-0 bg-black/95 z-[9998]" onClick={() => setShowFilterModal(false)} />
            <div className="relative bg-cardBg rounded-xl w-full max-w-md mx-4 shadow-xl border border-border p-6 z-[9999]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-text">Filter Options</h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-textSecondary hover:text-text transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="w-full text-text p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="updatedAt">Last Updated</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">
                    Sort Direction
                  </label>
                  <select
                    value={filters.direction}
                    onChange={(e) => handleFilterChange({ direction: e.target.value })}
                    className="w-full text-text p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">
                    Items per Page
                  </label>
                  <select
                    value={filters.pageSize}
                    onChange={(e) => handleFilterChange({ pageSize: Number(e.target.value) })}
                    className="w-full text-text p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilterModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      dispatch(updatePagination({ currentPage: 0 }));
                      setShowFilterModal(false);
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => {
        setShowChatModal(false);
        dispatch(clearCurrentTicket());
      }} />
      <div className={`relative ${
        isDark ? 'bg-cardBg' : 'bg-white'
      } rounded-lg w-full max-w-4xl mx-4 shadow-xl border border-border flex flex-col h-[90vh]`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 ${
          isDark ? 'bg-cardBg/95' : 'bg-white'
        } backdrop-blur-sm z-10 rounded-t-lg`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowChatModal(false);
                dispatch(clearCurrentTicket());
              }}
              className="hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-text truncate">{currentTicket.subject}</h3>
                <span className={getStatusBadge(currentTicket.status)}>
                  {currentTicket.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-textSecondary mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle2 className="w-3 h-3 text-primary" />
                  </div>
                  <span className="truncate">{currentTicket.createdBy?.firstname} {currentTicket.createdBy?.lastname}</span>
                </div>
                <span>•</span>
                <span className="whitespace-nowrap">Created {new Date(currentTicket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {currentTicket.status !== 'CLOSED' && (
            <div className="flex items-center gap-2 ml-4">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setShowForwardModal(true)}
                className="flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 text-text" />
                Forward
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => setShowCloseTicketModal(true)}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Close Ticket
              </Button>
            </div>
          )}
        </div>

        <div className={`flex-1 overflow-y-auto px-6 py-4 space-y-6 ${
          isDark ? 'bg-cardBg' : 'bg-gray-50/50'
        }`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : messages[currentTicket.ticketId]?.length > 0 ? (
            messages[currentTicket.ticketId].map((message, index) => {
              const isAdminMessage = message.sender?.role !== 'PRODUCER';
              const messageDate = message.sentAt ? new Date(message.sentAt) : new Date();
              const formattedTime = messageDate.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit'
              });

              const showDateSeparator = index === 0 || (
                new Date(messages[currentTicket.ticketId][index - 1].sentAt).toDateString() !==
                new Date(message.sentAt).toDateString()
              );

              return (
                <Fragment key={message.messageId}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-4">
                      <div className={`px-3 py-1 rounded-md text-xs font-medium ${
                        isDark ? 'bg-primary/5 text-primary' : 'bg-primary/10 text-primary-700'
                      }`}>
                        {new Date(message.sentAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div className={`flex items-end gap-2 group ${isAdminMessage ? 'justify-end' : 'justify-start'}`}>
                    {!isAdminMessage && (
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center self-end ${
                        isDark ? 'bg-primary/10' : 'bg-primary-50'
                      }`}>
                        <UserCircle2 className={`w-5 h-5 ${
                          isDark ? 'text-primary' : 'text-primary-600'
                        }`} />
                      </div>
                    )}
                    <div className={`
                      max-w-[70%] group relative
                      ${isAdminMessage ? 'order-1' : 'order-2'}
                    `}>
                      <div className={`
                        px-4 py-2.5
                        ${message.internalNote
                          ? isDark 
                            ? 'bg-yellow-500/10 border border-yellow-500/20 text-text'
                            : 'bg-yellow-50 border border-yellow-100 text-yellow-800 shadow-sm'
                          : isAdminMessage
                            ? isDark
                              ? 'bg-primary/20 border border-primary/20 text-text'
                              : 'bg-primary-600 text-white shadow-md'
                            : isDark
                              ? 'bg-gray-800/50 border border-border text-text'
                              : 'bg-white text-gray-900 shadow-md'
                        }
                        ${isAdminMessage 
                          ? 'rounded-2xl rounded-tr-md' 
                          : 'rounded-2xl rounded-tl-md'
                        }
                      `}>
                        <p className="whitespace-pre-wrap text-text break-words">
                          {message.content}
                        </p>
                      </div>
                      <div className={`flex items-center gap-3 mt-1.5 text-xs ${isAdminMessage ? 'justify-end' : 'justify-start'} ${
                        isDark ? 'text-textSecondary' : 'text-gray-500'
                      }`}>
                        <span className="font-medium">{message.sender?.firstname} {message.sender?.lastname}</span>
                        <span className="opacity-75">{formattedTime}</span>
                        {message.internalNote && (
                          <span className={`
                            px-2 py-0.5 rounded-md  text-[10px] uppercase tracking-wider font-medium
                            ${isDark
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-yellow-100 text-yellow-700'
                            }
                          `}>
                            Internal
                          </span>
                        )}
                      </div>
                    </div>
                    {isAdminMessage && (
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center self-end order-3 ${
                        isDark ? 'bg-primary/10' : 'bg-primary-50'
                      }`}>
                        <UserCircle2 className={`w-5 h-5 ${
                          isDark ? 'text-red-500' : 'text-red-500'
                        }`} />
                      </div>
                    )}
                  </div>
                </Fragment>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDark ? 'bg-primary/5' : 'bg-primary-50'
              }`}>
                <MessageCircle className={`w-8 h-8 ${
                  isDark ? 'text-primary opacity-50' : 'text-primary-600'
                }`} />
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-text' : 'text-gray-900'}`}>
                  No messages yet
                </p>
                {currentTicket?.status === 'OPEN' && (
                  <p className={`text-sm mt-1 ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>
                    Start the conversation by sending a message
                  </p>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {currentTicket.status !== 'CLOSED' && (
          <form onSubmit={handleSendMessage} className={`p-4 border-t border-border sticky bottom-0 ${
            isDark ? 'bg-cardBg/95' : 'bg-white'
          } backdrop-blur-sm rounded-b-lg`}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
                  isDark ? 'bg-primary/5' : 'bg-primary-50'
                }`}>
                  <input
                    type="checkbox"
                    id="internalNote"
                    checked={isInternalNote}
                    onChange={e => setIsInternalNote(e.target.checked)}
                    className={`rounded-sm border-2 ${
                      isDark ? 'border-border bg-background' : 'border-primary-200 bg-white'
                    }`}
                  />
                  <label htmlFor="internalNote" className={`text-sm font-medium cursor-pointer select-none ${
                    isDark ? 'text-primary' : 'text-primary-700'
                  }`}>
                    Internal Note
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'border-border bg-background text-text' 
                      : 'border-gray-200 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400`}
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  size="sm"
                  className={`rounded-lg px-6 h-[46px] ${
                    isDark ? '' : 'shadow-md'
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Forward Modal */}
        {showForwardModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="fixed inset-0 bg-black/95 z-[9998]" onClick={() => setShowForwardModal(false)} />
            <div className="relative bg-cardBg rounded-xl w-full max-w-md mx-4 shadow-xl border border-border p-6 z-[9999]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-text">Forward Ticket</h3>
                <button
                  onClick={() => setShowForwardModal(false)}
                  className="text-textSecondary hover:text-text transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text font-medium text-textSecondary mb-2">
                    Select Admin
                  </label>
                  <select
                    value={selectedAdmin}
                    onChange={(e) => setSelectedAdmin(e.target.value)}
                    className="w-full p-2.5 text-text rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option className='text-text' value="">Select an admin</option>
                    {users.map(user => (
                      <option className='text-text' key={user.userId} value={user.userId}>
                        {user.firstname} {user.lastname}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowForwardModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleForwardTicket}
                    disabled={!selectedAdmin}
                  >
                    Forward Ticket
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Close Ticket Confirmation Modal */}
        {showCloseTicketModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="fixed inset-0 bg-black/95 z-[9998]" onClick={() => setShowCloseTicketModal(false)} />
            <div className="relative bg-cardBg rounded-xl w-full max-w-md mx-4 shadow-xl border border-border p-6 z-[9999]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Close Ticket</h3>
                </div>
                <button
                  onClick={() => setShowCloseTicketModal(false)}
                  className="text-textSecondary hover:text-text transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-textSecondary">
                  Are you sure you want to close this ticket permanently? This action cannot be undone, and the producer will no longer be able to send messages.
                </p>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCloseTicketModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCloseTicket}
                  >
                    Close Permanently
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support; 