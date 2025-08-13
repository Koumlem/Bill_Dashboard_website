// src/components/Layout.jsx
import { NavLink } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="fixed inset-0 flex bg-zinc-100 font-sans">  {/* 贴边铺满 */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col px-6 py-8 shadow-lg">
        <h1 className="text-xl font-bold mb-10 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <span>Bill Dashboard</span>
        </h1>
        <nav className="flex flex-col space-y-4 text-sm">
          <NavItem to="/analysis" label="仪表盘" />
          <NavItem to="/" label="账单导入" />
          <NavItem to="#" label="分类汇总" />
        </nav>
      </aside>

      <main className="flex-1 p-0 overflow-auto">                  {/* 去掉 p-10 */}
        <div className="max-w-6xl mx-auto p-8">                    {/* 需要留白请在内容层控制 */}
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md hover:bg-zinc-700 hover:text-yellow-300 transition-colors${
          isActive ? ' bg-zinc-700 text-yellow-300' : ''
        }`
      }
    >
      {label}
    </NavLink>
  );
}
