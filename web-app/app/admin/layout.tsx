import AdminProtectedLayout from '@/components/auth/AdminProtectedLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminProtectedLayout>{children}</AdminProtectedLayout>;
}
