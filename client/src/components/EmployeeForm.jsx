import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import { Loader2Icon } from "lucide-react";

const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl animate-fade-in"
    >
      {/* Personal Information */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="block mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              required
              defaultValue={initialData?.firstName}
            />
          </div>
          <div>
            <label className="block mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              required
              defaultValue={initialData?.lastName}
            />
          </div>
          <div>
            <label className="block mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              required
              defaultValue={initialData?.phone}
            />
          </div>
          <div>
            <label className="block mb-2" htmlFor="date">
              Joining Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              defaultValue={
                initialData?.joinDate
                  ? new Date(initialData?.joinDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={initialData?.bio}
              row={3}
              className="resize-none"
              placeholder="Brief description..."
            />
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-base font-medium text-slate-900 mb-6 pb-6 border-b border-slate-100">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="department" className="block mb-2">
              Department
            </label>
            <select
              name="department"
              id="department"
              defaultValue={initialData?.department || ""}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((deptName) => (
                <option key={deptName} value={deptName}>
                  {deptName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2" htmlFor="position">
              Position
            </label>
            <input
              id="position"
              name="position"
              required
              defaultValue={initialData?.position}
            />
          </div>
          <div>
            <label className="block mb-2" htmlFor="basicSalary">
              Basic Salary
            </label>
            <input
              type="number"
              id="basicSalary"
              name="basicSalary"
              required
              min="0"
              step="0.01"
              defaultValue={initialData?.basicSalary || 0}
            />
          </div>
          <div>
            <label className="block mb-2" htmlFor="allowances">
              Allowances
            </label>
            <input
              type="number"
              id="allowances"
              name="allowances"
              required
              min="0"
              step="0.01"
              defaultValue={initialData?.allowances || 0}
            />
          </div>
          <div>
            <label className="block mb-2" htmlFor="deductions">
              Deductions
            </label>
            <input
              type="number"
              id="deductions"
              name="deductions"
              required
              min="0"
              step="0.01"
              defaultValue={initialData?.deductions || 0}
            />
          </div>
          {isEditMode && (
            <div>
              <label className="block mb-2" htmlFor="employmentStatus">
                Status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                required
                defaultValue={initialData?.employmentStatus}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Account Setup */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">
          Account Setup
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="block mb-2" htmlFor="email">
              Work Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue={initialData?.email}
            />
          </div>
          {!isEditMode && (
            <div>
              <label className="block mb-2" htmlFor="temporaryPassword">
                Temporary Password
              </label>
              <input
                type="password"
                id="temporaryPassword"
                name="temporaryPassword"
                required
              />
            </div>
          )}
          {isEditMode && (
            <div>
              <label className="block mb-2" htmlFor="changePassword">
                Change Password (Optional)
              </label>
              <input
                type="password"
                id="changePassword"
                name="changePassword"
                placeholder="Leave blank to keep current"
              />
            </div>
          )}
          <div>
            <label className="block mb-2" htmlFor="systemRole">
              System Role
            </label>
            <select
              id="systemRole"
              name="systemRole"
              defaultValue={initialData?.user?.role || "EMPLOYEE"}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center justify-center"
        >
          {loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
          {isEditMode ? "Update Employee" : "Create Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
