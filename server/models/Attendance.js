import mongoose from "mongoose";

const attendenceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE"],
      default: "PRESENT",
    },
    workingHours: { type: Number, default: null },
    dayType: {
      type: String,
      enum: ["Full Day", "Three Quarter Day", "Half Day", "Short Day", null],
      default: null,
    },
  },
  { timestamps: true },
);

//Prevents duplicate attendance for same employee on same day
attendenceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendenceSchema);

export default Attendance;
