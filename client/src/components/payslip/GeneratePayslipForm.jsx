import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

/**
 * GeneratePayslipForm - Modal form for admin to generate employee payslips
 * Collects employee, month, salary details to create payslip records
 */
const GeneratePayslipForm = ({ employees, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen)
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Generate Payslip
      </button>
    );

  /**
   * handleSubmit - Submits payslip generation request to API
   * Creates payslip record for selected employee and month
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const json = Object.fromEntries(formData.entries());
    try {
      await api.post(`/payslips/`, json);
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-lg w-full p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Generate Monthly Payslip
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* select employee */}
          <div>
            <label
              htmlFor="employeeId"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Employee
            </label>
            <select id="employeeId" name="employeeId" required>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName} {e.position}
                </option>
              ))}
            </select>
          </div>
          {/* select month & year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Month
              </label>
              <select id="month" name="month" required>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Year
              </label>
              <input
                type="number"
                name="year"
                id="year"
                defaultValue={new Date().getFullYear()}
              />
            </div>
          </div>
          {/* basic salary */}
          <div>
            <label
              htmlFor="basicSalary"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              id="basicSalary"
              required
              placeholder="5000"
            />
          </div>

          {/* allowances & deductions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="allowances"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Allowances
              </label>
              <input
                type="number"
                name="allowances"
                id="allowances"
                defaultValue="0"
              />
            </div>
            <div>
              <label
                htmlFor="deductions"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Deductions
              </label>
              <input
                type="number"
                name="deductions"
                id="deductions"
                defaultValue="0"
              />
            </div>
          </div>

          {/* buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="btn-secondary"
            >
              Cancel
            </button>
            <button disabled={loading} type="submit" className="btn-primary">
              {loading && <Loader2 className="w-4 j-4 mr-2 animate-spin" />}
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayslipForm;
