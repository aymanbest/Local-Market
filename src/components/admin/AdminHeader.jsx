import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, BarChart2, CreditCard, Search, Bell, Shield, LogOut, Settings, BellOff, CheckCheck } from 'lucide-react';
import { mockNotificationsadmin } from '../../mockData';
import Button from '../../components/ui/Button';

const AdminHeader = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(mockNotificationsadmin);
    const unreadCount = notifications.filter(n => !n.read).length;
    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'newUser':
                return <Users className="w-5 h-5 text-indigo-500" />;
            case 'security':
                return <Shield className="w-5 h-5 text-red-500" />;
            case 'system':
                return <Settings className="w-5 h-5 text-gray-500" />;
            default:
                return <Bell className="w-5 h-5 text-blue-500" />;
        }
    };

    const formatTimeAgo = (timestamp) => {
        const minutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const NotificationsPanel = () => (
        <div className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] rounded-lg shadow-lg border border-[#63676e] overflow-hidden z-50">
            <div className="p-4 border-b border-[#63676e]">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-400">Notifications</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-orange-500 hover:text-orange-700 focus:bg-[#0a0a0a] hover:bg-[#0a0a0a]"
                    >
                        <CheckCheck className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <BellOff className="w-5 h-5 mx-auto mb-2" />
                        <p>No notifications</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 border-b border-[#63676e] hover:bg-[#1e1e1e] transition-colors cursor-pointer ${!notification.read ? 'bg-[#1e1e1e]' : ''
                                }`}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-300">
                                        {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatTimeAgo(notification.timestamp)}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const isActivePath = (path) => {
        return location.pathname === path;
    };


    return (
        <div className="px-[5%] pt-4 mx-auto">
            <header className="bg-[#0a0a0a]/60 backdrop-blur-md border border-[#6c6c6c] fixed w-[90%] z-10 rounded-lg ">
                <div className="px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2 group">
                            <Shield className="h-6 w-6 text-orange-600 transform group-hover:rotate-12 transition-transform" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                                Admin Portal
                            </h1>


                        </div>

                        <div className="flex items-center space-x-6">

                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    className="relative  group bg-transparent border-none focus:outline-none hover:bg-transparent active:bg-transparent"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <Bell className="w-6 h-6 text-orange-500 group-hover:text-orange-600 transition-colors" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Button>



                                {showNotifications && <NotificationsPanel />}
                            </div>

                            <Button variant="outline" className=" border-[#6c6c6c] flex items-center text-[#63676e] space-x-2 group hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                                <LogOut className=" text-orange-500 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                <span className='text-orange-500' >Sign Out</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default AdminHeader