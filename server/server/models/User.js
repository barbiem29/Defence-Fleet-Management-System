const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["manager", "jee", "oic", "supplier"], // your original roles
      required: true,
    },
  },
  { timestamps: true }
);

// ─── Hash password before saving ────────────────────────────
// userSchema.pre("save", function (next) {
//   if (!this.isModified("password")) return next();

//   // For testing, skip hashing
//   // bcrypt.hash(this.password, 12, (err, hash) => {
//   //   if (err) return next(err);
//   //   this.password = hash;
//   //   next();
//   // });
//   next();
// });

// ─── Compare password method ────────────────────────────────
userSchema.methods.comparePassword = function (candidatePassword) {
  // For testing, plain text
  return this.password === candidatePassword;
  // return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);