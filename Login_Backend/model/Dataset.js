import mongoose from 'mongoose';

const DatasetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sizeLabel: { type: String, required: true }, // e.g., "1.23 MB"
    sizeBytes: { type: Number, required: true },
    status: { type: String, default: 'Processed' },
    fileData: { type: Buffer, required: true }, // CSV binary
  },
  { timestamps: true } // createdAt used as "Date Added"
);

// Virtual for human date if needed
DatasetSchema.virtual('date').get(function () {
  return this.createdAt;
});

export default mongoose.model('Dataset', DatasetSchema);