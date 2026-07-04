// Mock Workflow Automations simulator for Phoenix Automation Core

export const MOCK_TRIGGERS = [
  { id: 't_form', type: 'form_submission', label: 'Form Submitted', icon: 'FileText', color: '#ea580c' },
  { id: 't_whatsapp', type: 'whatsapp_message', label: 'WhatsApp Received', icon: 'MessageSquare', color: '#25d366' },
  { id: 't_email', type: 'email_received', label: 'Email Received', icon: 'Mail', color: '#3b82f6' },
  { id: 't_lead', type: 'new_lead', label: 'New Lead Created', icon: 'UserPlus', color: '#8b5cf6' },
  { id: 't_payment', type: 'payment_success', label: 'Payment Success', icon: 'CreditCard', color: '#10b981' },
  { id: 't_booking', type: 'appointment_booked', label: 'Appointment Booked', icon: 'Calendar', color: '#fbbf24' }
];

export const MOCK_ACTIONS = [
  { id: 'a_email', type: 'send_email', label: 'Send Email', icon: 'Mail' },
  { id: 'a_whatsapp', type: 'send_whatsapp', label: 'Send WhatsApp', icon: 'MessageSquare' },
  { id: 'a_task', type: 'create_task', label: 'Create Task', icon: 'CheckSquare' },
  { id: 'a_sales', type: 'assign_sales', label: 'Assign Sales Rep', icon: 'UserCheck' },
  { id: 'a_crm', type: 'update_crm', label: 'Update CRM Record', icon: 'RefreshCw' },
  { id: 'a_invoice', type: 'create_invoice', label: 'Create Invoice', icon: 'FileSpreadsheet' },
  { id: 'a_notify', type: 'send_notification', label: 'Send Notification', icon: 'Bell' }
];

export const PREBUILT_TEMPLATES = [
  {
    id: 'tpl_lead_nurturing',
    name: 'Lead Nurturing Campaign',
    description: 'Automatically follow up with new leads via Email, wait 2 days, score with AI, and alert Slack.',
    trigger: { type: 'new_lead', label: 'New Lead Created' },
    nodes: [
      { id: 'n1', type: 'trigger', category: 'new_lead', label: 'New Lead Created', x: 100, y: 150 },
      { id: 'n2', type: 'action', category: 'send_email', label: 'Send Welcome Email', x: 300, y: 150, details: { subject: 'Welcome to PhoenixAI!', body: 'Thanks for signing up...' } },
      { id: 'n3', type: 'delay', label: 'Wait 1 Day', x: 500, y: 150, details: { duration: 1, unit: 'days' } },
      { id: 'n4', type: 'ai_decision', label: 'AI Score Lead', x: 700, y: 150, details: { prompt: 'Analyze lead company size and domain value. Score 1-10.' } },
      { id: 'n5', type: 'condition', label: 'Score > 7?', x: 900, y: 150, details: { variable: 'AI Lead Score', value: '7' } },
      { id: 'n6', type: 'action', category: 'assign_sales', label: 'Assign Tier-1 Sales Rep', x: 1100, y: 50, details: { rep: 'John Doe' } },
      { id: 'n7', type: 'action', category: 'send_whatsapp', label: 'Send General Follow-up', x: 1100, y: 250, details: { message: 'Hi! Let us chat...' } }
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
      { from: 'n5', to: 'n6', port: 'true' },
      { from: 'n5', to: 'n7', port: 'false' }
    ]
  },
  {
    id: 'tpl_sales_followup',
    name: 'Sales Follow-up & CRM Update',
    description: 'Triggered on form submissions, assigns a sales rep, creates a CRM deal, and sends a WhatsApp message.',
    trigger: { type: 'form_submission', label: 'Form Submitted' },
    nodes: [
      { id: 'n1', type: 'trigger', category: 'form_submission', label: 'Form Submitted', x: 100, y: 150 },
      { id: 'n2', type: 'action', category: 'assign_sales', label: 'Assign Lead to Rep', x: 350, y: 150 },
      { id: 'n3', type: 'action', category: 'update_crm', label: 'Create CRM Deal', x: 600, y: 150 },
      { id: 'n4', type: 'action', category: 'send_whatsapp', label: 'Send Rep Intro Text', x: 850, y: 150 }
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' }
    ]
  },
  {
    id: 'tpl_appointment_reminders',
    name: 'Appointment Reminders & Follow-ups',
    description: 'Send text and email reminders before a booked appointment, then check booking state.',
    trigger: { type: 'appointment_booked', label: 'Appointment Booked' },
    nodes: [
      { id: 'n1', type: 'trigger', category: 'appointment_booked', label: 'Appointment Booked', x: 100, y: 150 },
      { id: 'n2', type: 'action', category: 'send_email', label: 'Send Booking Confirmation', x: 320, y: 150 },
      { id: 'n3', type: 'delay', label: 'Wait until 24h before', x: 550, y: 150 },
      { id: 'n4', type: 'action', category: 'send_whatsapp', label: 'Send SMS Reminder', x: 780, y: 150 }
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' }
    ]
  },
  {
    id: 'tpl_payment_reminders',
    name: 'Payment Reminders & Invoice Automation',
    description: 'On payment success, generate an invoice, update CRM billing status, and send an email receipt.',
    trigger: { type: 'payment_success', label: 'Payment Success' },
    nodes: [
      { id: 'n1', type: 'trigger', category: 'payment_success', label: 'Payment Success', x: 100, y: 150 },
      { id: 'n2', type: 'action', category: 'create_invoice', label: 'Generate Invoice PDF', x: 350, y: 150 },
      { id: 'n3', type: 'action', category: 'send_email', label: 'Send Receipt with PDF', x: 600, y: 150 },
      { id: 'n4', type: 'action', category: 'update_crm', label: 'Mark Invoice Paid in CRM', x: 850, y: 150 }
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' }
    ]
  },
  {
    id: 'tpl_client_onboarding',
    name: 'Client Onboarding Pipeline',
    description: 'Triggered when client booking is confirmed. Create onboarding tasks, assign rep, and send welcome kit.',
    trigger: { type: 'appointment_booked', label: 'Client Booking Confirmed' },
    nodes: [
      { id: 'n1', type: 'trigger', category: 'appointment_booked', label: 'Booking Confirmed', x: 100, y: 150 },
      { id: 'n2', type: 'action', category: 'create_task', label: 'Set Up Client Shared Folder', x: 300, y: 150 },
      { id: 'n3', type: 'action', category: 'assign_sales', label: 'Assign Client Success Mgr', x: 500, y: 150 },
      { id: 'n4', type: 'action', category: 'send_email', label: 'Email Welcome Packet', x: 700, y: 150 },
      { id: 'n5', type: 'action', category: 'send_notification', label: 'Notify Slack Channels', x: 900, y: 150 }
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' }
    ]
  },
  {
    id: 'tpl_support_automation',
    name: 'Customer Support SLA Guard',
    description: 'On WhatsApp message receipt, use AI to classify urgency. If urgent, alert support reps immediately.',
    trigger: { type: 'whatsapp_message', label: 'WhatsApp Message Received' },
    nodes: [
      { id: 'n1', type: 'trigger', category: 'whatsapp_message', label: 'WhatsApp Message Recv', x: 100, y: 150 },
      { id: 'n2', type: 'ai_decision', label: 'Classify Sentiment & Intent', x: 350, y: 150 },
      { id: 'n3', type: 'condition', label: 'Is Urgent?', x: 600, y: 150 },
      { id: 'n4', type: 'action', category: 'send_notification', label: 'Ping Urgent SLA Channel', x: 850, y: 50 },
      { id: 'n5', type: 'action', category: 'send_whatsapp', label: 'Send Auto-Ack Message', x: 850, y: 250 }
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4', port: 'true' },
      { from: 'n3', to: 'n5', port: 'false' }
    ]
  }
];

// Generate dynamic logs
export const generateMockLogEntry = (workflowName, isSuccess = true) => {
  const id = 'log_' + Math.random().toString(36).substr(2, 9);
  const timestamp = new Date().toISOString();
  
  // Decide trigger type based on name
  let triggerType = 'Form Submission';
  let triggerIcon = 'FileText';
  if (workflowName.includes('Lead')) {
    triggerType = 'New Lead Created';
    triggerIcon = 'UserPlus';
  } else if (workflowName.includes('Appointment') || workflowName.includes('Client')) {
    triggerType = 'Appointment Booked';
    triggerIcon = 'Calendar';
  } else if (workflowName.includes('Payment')) {
    triggerType = 'Payment Success';
    triggerIcon = 'CreditCard';
  } else if (workflowName.includes('Support')) {
    triggerType = 'WhatsApp Message Received';
    triggerIcon = 'MessageSquare';
  }

  const steps = [
    { name: `Trigger: ${triggerType}`, status: 'success', time: '0ms' },
    { name: 'AI Decision Processing', status: isSuccess ? 'success' : 'failed', time: isSuccess ? '240ms' : '150ms', error: isSuccess ? null : 'API Connection Timeout' }
  ];

  if (isSuccess) {
    steps.push({ name: 'CRM Records updated', status: 'success', time: '380ms' });
    steps.push({ name: 'Email notifications sent', status: 'success', time: '520ms' });
  }

  return {
    id,
    workflowName,
    triggerType,
    triggerIcon,
    status: isSuccess ? 'success' : 'failed',
    timestamp,
    durationMs: isSuccess ? 520 : 150,
    steps
  };
};
