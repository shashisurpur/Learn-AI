import mongoose from 'mongoose';

const RequestLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  lastRequest: { type: Date, default: Date.now },
});

const RequestLimit = mongoose.models.RequestLimit || mongoose.model('RequestLimit', RequestLimitSchema);

export default RequestLimit;