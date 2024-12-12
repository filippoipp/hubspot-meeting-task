const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActionSchema = new Schema({
  actionName: {
    type: String,
    required: true,
    enum: [
      'Company Created', 
      'Company Updated', 
      'Contact Created', 
      'Contact Updated', 
      'Meeting Created', 
      'Meeting Updated'
    ]
  },
  actionDate: {
    type: Date,
    required: true
  },
  includeInAnalytics: {
    type: Number,
    default: 0
  },
  id: {
    type: String
  },
  identity: {
    type: String
  },
  companyProperties: {
    company_id: String,
    company_domain: String,
    company_industry: String,
    company_name: String,
    company_description: String,
    company_size: String,
    company_country: String
  },
  userProperties: {
    contact_id: String,
    contact_name: String,
    contact_title: String,
    contact_source: String,
    contact_score: Number,
    contact_email: String,
    contact_status: String,
    company_id: String
  },
  meetingProperties: {
    meeting_id: String,
    title: String,
    timestamp: Date,
    contact: String,
    duration: Number
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, { 
  timestamps: true,
  minimize: false 
});

ActionSchema.index({ actionDate: 1, actionName: 1 });
ActionSchema.index({ identity: 1 });
ActionSchema.index({ 'companyProperties.company_domain': 1 });
ActionSchema.index({ 'userProperties.contact_email': 1 });

module.exports = mongoose.model('Action', ActionSchema);