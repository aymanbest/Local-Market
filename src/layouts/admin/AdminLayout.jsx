import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserCog, ChartColumn, CircleDollarSign } from 'lucide-react';
import TransactionMonitoring from '../../components/TransactionMonitoring';
import ReportingAnalytics from '../../components/ReportingAnalytics';
import UserManagement from '../../components/admin/UserManagement';

const AdminLayout = () => {
  return (
    <div className="min-h-screen  bg-[#0a0a0a]-50 ">
      {/* Sidebar */}
      <div className="flex pt-16 ">
        <aside className=' ms-[5%] px-2 py-4 flex w-[8%] h-auto bg-bgGrey rounded-xl justify-center fixed'>
          <ul class="space-y-2 font-medium">
            <li>
              <a href="users" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-mainBlack dark:hover:bg-mainBlack group">
                <UserCog className="w-5 h-5 text-orange-700 transition duration-75 dark:text-orange-600 group-hover:text-orange-800 dark:group-hover:text-white" />
                {/* tooltip */}
              </a>
            </li>
            <li>
              <a href="transactions" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-mainBlack dark:hover:bg-mainBlack group">
                <ChartColumn className="w-5 h-5 text-orange-700 transition duration-75 dark:text-orange-600 group-hover:text-orange-800 dark:group-hover:text-white" />
                {/* tooltip */}
              </a>
            </li>
            <li>
              <a href="reports" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-mainBlack dark:hover:bg-mainBlack group">
                <CircleDollarSign className="w-5 h-5 text-orange-700 transition duration-75 dark:text-orange-600 group-hover:text-orange-800 dark:group-hover:text-white" />
                {/* tooltip */}
              </a>
            </li>

          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-48 p-8 bg-bgGrey rounded-xl">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/users" element={<UserManagement />} />
              <Route path="/transactions" element={<TransactionMonitoring />} />
              <Route path="/reports" element={<ReportingAnalytics />} />
            </Routes>
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;

