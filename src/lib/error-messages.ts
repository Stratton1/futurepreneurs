// Centralised error messages for all server actions.
// Import these constants instead of using inline strings.

export const ERRORS = {
  // Authentication
  NOT_AUTHENTICATED: 'Not logged in',

  // Role-based access
  STUDENTS_ONLY: 'Only students can do this',
  TEACHERS_ONLY: 'Only teachers can do this',
  PARENTS_ONLY: 'Only parents can do this',
  ADMINS_ONLY: 'Only admins can do this',

  // Ownership / permission
  OWN_PROJECTS_ONLY: 'You can only manage your own projects',
  NOT_PROJECT_MENTOR: 'You are not the mentor for this project',
  NOT_AUTHORIZED: 'You are not authorized to do this',
  NOT_YOUR_REQUEST: 'Not your request',
  NOT_YOUR_INVITATION: 'Not your invitation',

  // Resource not found
  PROJECT_NOT_FOUND: 'Project not found',
  MILESTONE_NOT_FOUND: 'Milestone not found',
  DRAWDOWN_NOT_FOUND: 'Drawdown request not found',
  STUDENT_NOT_FOUND: 'Student not found',
  STRETCH_GOAL_NOT_FOUND: 'Stretch goal not found',
  UPDATE_NOT_FOUND: 'Update not found',
  INVITATION_NOT_FOUND: 'Invitation not found',
  ACCOUNT_NOT_FOUND: 'Account not found',
  SPONSOR_NOT_FOUND: 'Sponsor not found',
  CARD_NOT_FOUND: 'Card not found',
  CONSENT_NOT_FOUND: 'No consent record found for this project',
  PARENT_NOT_FOUND: 'No parent account found with that email. They need to sign up as a parent first.',
  STUDENT_EMAIL_NOT_FOUND: 'No student account found with that email.',
  USER_EMAIL_NOT_FOUND: 'No user found with that email address',
  WALLET_NOT_FOUND: 'No wallet account found',
  CUSTODIAL_NOT_FOUND: 'No custodial account found. Ask your parent to set up your wallet.',
  STRIPE_ACCOUNT_NOT_FOUND: 'No Stripe account found',

  // Project status validation
  DRAFT_ONLY_EDIT: 'Only draft projects can be edited',
  DRAFT_ONLY_SUBMIT: 'Only draft projects can be submitted',
  NOT_AWAITING_VERIFICATION: 'This project is not awaiting verification',
  NOT_AWAITING_CONSENT: 'This project is not awaiting consent',
  ALREADY_LIVE: 'This project is already live. Consent was already given.',
  LIVE_OR_FUNDED_ONLY: 'This action is only available for live or funded projects',
  FUNDED_ONLY: 'This action is only available for funded projects',
  ALREADY_PROCESSED: 'This has already been processed',
  CANNOT_REPORT: 'This project cannot be reported',

  // Input validation
  TITLE_TOO_SHORT: 'Project title must be at least 3 characters',
  SHORT_DESC_TOO_SHORT: 'Short description must be at least 10 characters',
  DESC_TOO_SHORT: 'Description must be at least 50 characters',
  SELECT_CATEGORY: 'Please select a category',
  NEED_MILESTONE: 'Please add at least one milestone',
  MILESTONE_MISMATCH: 'Milestone amounts must add up to your funding goal',
  TITLE_CONTENT_REQUIRED: 'Title and content are required',
  TITLE_DESC_REQUIRED: 'Title and description are required',
  NAME_REQUIRED: 'Name is required',
  FULL_NAME_REQUIRED: 'Please enter your full name (first and last name)',
  VALID_EMAIL_REQUIRED: 'Please enter a valid email address',
  REASON_REQUIRED: 'Reason is required',
  FEEDBACK_REQUIRED: 'Please provide feedback about what changes are needed',
  REJECTION_REASON_REQUIRED: 'Please provide a reason for the rejection',
  DECLINE_REASON_REQUIRED: 'Please provide a reason for declining consent',
  VENDOR_NAME_REQUIRED: 'Vendor name is required',
  AMOUNT_POSITIVE: 'Amount must be positive',
  SELECT_REASON: 'Please select a reason',

  // Collaboration
  CANNOT_INVITE_SELF: "You can't invite yourself",
  SAME_SCHOOL_ONLY: 'Collaborators must be from the same school',
  ALREADY_INVITED: 'This student has already been invited',
  NOT_GROUP_PROJECT: 'This is not a group project',
  NOT_LINKED_STUDENT: 'This student is not linked to your account',
  PARENT_ALREADY_LINKED: 'This parent is already linked to this project',

  // Drawdowns & spending
  MILESTONE_FULLY_DISBURSED: 'This milestone has already been fully disbursed',
  NOT_AWAITING_PARENT_APPROVAL: 'This request is not awaiting parent approval',
  NOT_AWAITING_MENTOR_APPROVAL: 'This request is not awaiting mentor approval',
  ONLY_APPROVED_REVERSIBLE: 'Only approved requests can be reversed',
  COOLING_OFF_EXPIRED: 'Cooling-off period has expired. Contact support for assistance.',
  RECEIPTS_COMPLETED_ONLY: 'Receipts can only be uploaded for completed transactions',
  INSUFFICIENT_BALANCE: 'Insufficient wallet balance',
  SPENDING_LIMIT_EXCEEDED: 'Spending limit exceeded',
  PARENT_ACK_REQUIRED: 'The parent must acknowledge the first drawdown before it can be approved. They have been notified.',

  // Wallet
  ONBOARDING_COMPLETE: 'Wallet onboarding is already complete',
  WALLET_VERIFICATION_FAILED: 'Wallet verification has failed. Please contact support.',
  MENTOR_REQUIRED: 'Project must have an assigned mentor',
  SPONSOR_NOT_ACTIVE: 'Sponsor is not active',
  SPONSOR_ALREADY_ASSIGNED: 'This sponsor is already assigned to this project',

  // Content & safety
  INAPPROPRIATE_CONTENT: 'Content contains inappropriate language.',
  AI_SAFETY_FAIL: "The generated content didn't pass our safety check. Please try adjusting your answers.",
  AI_RATE_LIMIT: "You've reached your daily limit of 10 AI generations. Try again tomorrow!",

  // School & email
  SCHOOL_EMAIL_REQUIRED: "Students must sign up with a school email address. If your school isn't registered yet, ask a teacher to contact us.",

  // Generic failures
  FAILED_CREATE_PROJECT: 'Failed to create project. Please try again.',
  FAILED_SAVE_MILESTONES: 'Failed to save milestones. Please try again.',
  FAILED_UPDATE_PROJECT: 'Failed to update project',
  FAILED_SUBMIT_PROJECT: 'Failed to submit project',
  FAILED_APPROVE_PROJECT: 'Failed to approve project',
  FAILED_REJECT_PROJECT: 'Failed to reject project',
  FAILED_CREATE_DRAWDOWN: 'Failed to create drawdown request',
  FAILED_APPROVE_DRAWDOWN: 'Failed to approve drawdown',
  FAILED_REJECT_DRAWDOWN: 'Failed to reject drawdown',
  FAILED_UPDATE_STATUS: 'Failed to update project status',
  FAILED_LINK_PARENT: 'Failed to link parent',
  FAILED_UNLINK_PARENT: 'Failed to unlink parent',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  PROFILE_SETUP_FAILED: 'Account created but profile setup failed. Please contact support.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
} as const;

export type ErrorKey = keyof typeof ERRORS;
