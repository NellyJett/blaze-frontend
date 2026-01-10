import { useAppSelector } from '@/hooks/useAppDispatch';
import { StatusBadge, getKYCStatusType } from '@/components/ui/StatusBadge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  FileCheck,
  CreditCard,
} from 'lucide-react';
import { format } from 'date-fns';

export function CustomerProfile() {
  const { selectedCustomer, loading, selectedCustomerId } = useAppSelector((state) => state.customers);

  if ((loading || !selectedCustomer) && selectedCustomerId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center animate-pulse">
        <div className="mx-auto h-12 w-12 rounded-full bg-gray-200" />
        <div className="mt-4 h-4 w-48 mx-auto bg-gray-200 rounded" />
        <div className="mt-2 h-3 w-32 mx-auto bg-gray-100 rounded" />
      </div>
    );
  }

  if (!selectedCustomerId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">
          Select a customer to view their profile
        </p>
      </div>
    );
  }

  if (!selectedCustomer) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-600 font-medium">Failed to load customer profile</p>
        <p className="text-sm text-red-500 mt-1">Please try again or select another customer</p>
      </div>
    );
  }

  const c = selectedCustomer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {c.firstName} {c.lastName}
              </h2>
              <p className="font-mono text-sm text-gray-500">{c.id}</p>
            </div>
          </div>
          <StatusBadge
            status={getKYCStatusType(c.kycStatus || 'not_started')}
            label={(c.kycStatus || 'not_started').replace('_', ' ')}
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900 truncate">{c.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900">{c.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900">{c.country}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900">
              Born {c.dateOfBirth ? format(new Date(c.dateOfBirth), 'MMM d, yyyy') : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900 capitalize">
              {c.employmentStatus?.replace('_', ' ') || 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900">
              Member since {c.createdAt ? format(new Date(c.createdAt), 'MMM yyyy') : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Annual Income</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            ${(c.income ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm">Loan Balance</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            ${(c.loanBalance ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FileCheck className="h-4 w-4" />
            <span className="text-sm">Repayment Score</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {c.repaymentHistory ?? 0}%
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          KYC Documents
        </h3>
        <div className="flex flex-wrap gap-2">
          {c.documentsProvided.length > 0 ? (
            c.documentsProvided.map((doc) => (
              <span
                key={doc}
                className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
              >
                {doc.replace('_', ' ')}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-600">
              No documents provided
            </span>
          )}
        </div>
      </div>
    </div>
  );
}