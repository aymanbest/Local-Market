import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, MessageCircle, Clock, AlertTriangle, 
  CheckCircle2, Send, ChevronRight, ArrowLeft, X,
  Filter, Search, ChevronLeft, ChevronRight as ChevronRightIcon, UserCircle2
} from 'lucide-react';
import { 
  createTicket, fetchProducerTickets, 
  fetchMessages, addMessage, setCurrentTicket, clearCurrentTicket,
  updatePagination, updateSorting
} from '../../../store/slices/common/supportTicketSlice';
import Button from '../../common/ui/Button';
import { Card } from '../../common/ui/Card';
import { useTheme } from '../../../context/ThemeContext';
import Toast from '../../common/ui/Toast';

const Support = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { tickets, currentTicket, messages, loading, pagination, sorting } = useSelector(state => state.supportTickets);
  const [status, setStatus] = useState('OPEN');
  const [newMessage, setNewMessage] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'LOW' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    dispatch(fetchProducerTickets({ 
      status,
      page: pagination.currentPage,
      size: pagination.pageSize,
      sortBy: sorting.sortBy,
      direction: sorting.direction
    }));
  }, [dispatch, status, pagination.currentPage, pagination.pageSize, sorting.sortBy, sorting.direction]);

  useEffect(() => {
    if (currentTicket) {
      console.log('Current ticket changed:', currentTicket.ticketId);
      dispatch(fetchMessages(currentTicket.ticketId));
    }
  }, [currentTicket, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;

    try {
      const result = await dispatch(createTicket(newTicket)).unwrap();
      setShowNewTicketModal(false);
      setNewTicket({ subject: '', message: '', priority: 'LOW' });
      dispatch(setCurrentTicket(result));
      setShowChatModal(true);
    } catch (error) {
        console.log(error);
        setToastMessage(error.message || 'You already have an active ticket. Please wait for it to be resolved before creating a new one.');
        setShowToast(true);
        setShowNewTicketModal(false);

    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      await dispatch(addMessage({
        ticketId: currentTicket.ticketId,
        messageData: { 
          message: newMessage,
          internalNote: false
        }
      })).unwrap();
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setToastMessage(error.message || 'Failed to send message. Please try again.');
      setShowToast(true);
    } finally {
      setSendingMessage(false);
    }
  };

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

  const handlePageChange = (newPage) => {
    dispatch(updatePagination({ currentPage: newPage }));
  };

  const handleSortChange = (newSortBy) => {
    const newDirection = sorting.sortBy === newSortBy && sorting.direction === 'asc' ? 'desc' : 'asc';
    dispatch(updateSorting({ sortBy: newSortBy, direction: newDirection }));
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${ticket.createdBy?.firstname} ${ticket.createdBy?.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentTicket || !showChatModal) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-text">Support Tickets</h1>
          <Button 
            onClick={() => setShowNewTicketModal(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            New Ticket
          </Button>
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
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-text"
          >
            <option value="OPEN">Open</option>
            <option value="ASSIGNED">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
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
                    {ticket.status === 'CLOSED' && (
                      <span className="text-sm text-textSecondary">
                        Closed on {new Date(ticket.updatedAt).toLocaleDateString()}
                      </span>
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
                {status === 'OPEN' 
                  ? "You don't have any open tickets. Create a new ticket to get support."
                  : status === 'CLOSED'
                    ? "You don't have any closed tickets."
                    : "You don't have any tickets in progress."}
              </p>
              {status === 'OPEN' && (
                <Button
                  onClick={() => setShowNewTicketModal(true)}
                  size="sm"
                  className="mt-4"
                >
                  Create New Ticket
                </Button>
              )}
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

        {/* New Ticket Modal */}
        {showNewTicketModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowNewTicketModal(false)} />
            <div className="relative bg-cardBg rounded-xl w-full max-w-md mx-4 shadow-xl border border-border">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-semibold text-text">Create New Ticket</h3>
                <button 
                  onClick={() => setShowNewTicketModal(false)}
                  className="text-textSecondary hover:text-text transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={e => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    className={`
                      w-full px-4 py-2 rounded-lg border bg-transparent
                      focus:ring-2 focus:ring-primary focus:border-transparent
                      ${isDark ? 'border-white/10' : 'border-black/10'}
                    `}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">
                    Message
                  </label>
                  <textarea
                    value={newTicket.message}
                    onChange={e => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                    className={`
                      w-full px-4 py-2 rounded-lg border bg-transparent
                      focus:ring-2 focus:ring-primary focus:border-transparent
                      ${isDark ? 'border-white/10' : 'border-black/10'}
                    `}
                    rows={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={e => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                    className={`
                      w-full px-4 py-2 rounded-lg border bg-transparent
                      focus:ring-2 focus:ring-primary focus:border-transparent
                      ${isDark ? 'border-white/10' : 'border-black/10'}
                    `}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewTicketModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Ticket</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {showToast && (
          <Toast
            message={toastMessage}
            type="error"
            onClose={() => setShowToast(false)}
            position="bottom-right"
            duration={5000}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Button onClick={() => setShowNewTicketModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="grid gap-4">
        {tickets.map(ticket => (
          <div
            key={ticket.ticketId}
            className={`bg-cardBg p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow border border-border ${
              loading ? 'opacity-50 pointer-events-none' : ''
            }`}
            onClick={async () => {
              if (loading) return;
              console.log('Opening ticket:', ticket.ticketId);
              dispatch(setCurrentTicket(ticket));
              setShowChatModal(true);
            }}
            role="button"
            tabIndex={0}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{ticket.subject}</h3>
                <p className="text-sm text-textSecondary">
                  Created {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getStatusBadge(ticket.status)}`}>
                  {ticket.status}
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Modal */}
      {showChatModal && currentTicket && (
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
                  const isProducerMessage = message.sender?.role === 'PRODUCER';
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
                    <React.Fragment key={message.messageId}>
                      {showDateSeparator && (
                        <div className="flex items-center justify-center my-4">
                          <div className={`px-3 py-1 rounded-md text-xs font-medium ${
                            isDark ? 'bg-primary/5 text-primary' : 'bg-primary/10 text-primary-700'
                          }`}>
                            {new Date(message.sentAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      <div className={`flex items-end gap-2 group ${isProducerMessage ? 'justify-end' : 'justify-start'}`}>
                        {!isProducerMessage && (
                          <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                            isDark ? 'bg-primary/10' : 'bg-primary-50'
                          }`}>
                            <UserCircle2 className={`w-5 h-5 ${
                              isDark ? 'text-primary' : 'text-primary-600'
                            }`} />
                          </div>
                        )}
                        <div className={`
                          max-w-[70%] group relative
                          ${isProducerMessage ? 'order-1' : 'order-2'}
                        `}>
                          <div className={`
                            px-4 py-2.5
                            ${isProducerMessage
                              ? isDark
                                ? 'bg-primary/20 border border-primary/20 text-text'
                                : 'bg-primary-600 text-white shadow-md'
                              : isDark
                                ? 'bg-gray-800/50 border border-border text-text'
                                : 'bg-white text-gray-900 shadow-md'
                            }
                            ${isProducerMessage 
                              ? 'rounded-2xl rounded-tr-md' 
                              : 'rounded-2xl rounded-tl-md'
                            }
                          `}>
                            <p className="whitespace-pre-wrap text-text break-words">
                              {message.content}
                            </p>
                          </div>
                          <div className={`flex items-center gap-3 mt-1.5 text-xs ${isProducerMessage ? 'justify-end' : 'justify-start'} ${
                            isDark ? 'text-textSecondary' : 'text-gray-500'
                          }`}>
                            <span className="font-medium">{message.sender?.firstname} {message.sender?.lastname}</span>
                            <span className="opacity-75">{formattedTime}</span>
                          </div>
                        </div>
                        {isProducerMessage && (
                          <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center order-3 ${
                            isDark ? 'bg-primary/10' : 'bg-primary-50'
                          }`}>
                            <UserCircle2 className={`w-5 h-5 ${
                              isDark ? 'text-primary' : 'text-primary-600'
                            }`} />
                          </div>
                        )}
                      </div>
                    </React.Fragment>
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
                    {currentTicket?.status !== 'CLOSED' && (
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
                    disabled={sendingMessage}
                  />
                  <Button 
                    type="submit" 
                    disabled={sendingMessage || !newMessage.trim()}
                    size="sm"
                    className={`rounded-lg px-6 h-[46px] ${
                      isDark ? '' : 'shadow-md'
                    }`}
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setShowToast(false)}
          position="bottom-right"
          duration={5000}
        />
      )}
    </div>
  );
};

export default Support; 