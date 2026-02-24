import AdminProtectedLayout from '@/components/auth/AdminProtectedLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProtectedLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </AdminProtectedLayout>
    );
}
