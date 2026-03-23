const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  placements: {
    averagePackage: { type: Number, required: true },
    highestPackage: { type: Number, required: true }
  },
  fees: {
    government: { type: Number, required: true },
    management: { type: Number, required: true }
  },
  infrastructureRating: { type: Number, min: 1, max: 10 },
  ranking: { type: Number },
  coursesOffered: [{ type: String }],
  slug: { type: String, unique: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

collegeSchema.index({ name: 1 });
collegeSchema.index({ location: 1 });

collegeSchema.pre('save', async function() {
  if (this.isModified('name') || !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check for collisions (if this is a new document or name changed)
    const College = mongoose.model('College');
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await College.findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
});

module.exports = mongoose.model('College', collegeSchema);
