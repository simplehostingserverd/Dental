-- Enable RLS on all tables
ALTER TABLE "Practice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PracticeUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PatientUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Patient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Appointment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Note" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Prescription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Treatment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Referral" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reminder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Xray" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Form" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InsuranceClaim" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CommunicationLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkflowInstance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnalyticsEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Report" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MarketingCampaign" ENABLE ROW LEVEL SECURITY;

-- Create function to get current practice user info
CREATE OR REPLACE FUNCTION get_current_practice_user()
RETURNS TABLE(user_id TEXT, practice_id TEXT, role TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    current_setting('app.current_user_id', true)::TEXT,
    current_setting('app.current_practice_id', true)::TEXT,
    current_setting('app.current_user_role', true)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current patient user info
CREATE OR REPLACE FUNCTION get_current_patient_user()
RETURNS TABLE(user_id TEXT, patient_id TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    current_setting('app.current_patient_user_id', true)::TEXT,
    current_setting('app.current_patient_id', true)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Practice table policies
CREATE POLICY practice_isolation ON "Practice"
  USING (id = (SELECT practice_id FROM get_current_practice_user()));

-- PracticeUser policies
CREATE POLICY practice_user_isolation ON "PracticeUser"
  USING (
    "practiceId" = (SELECT practice_id FROM get_current_practice_user())
    OR id = (SELECT user_id FROM get_current_practice_user())
  );

-- Patient policies - practice users can see their practice patients, patients can see themselves
CREATE POLICY patient_practice_access ON "Patient"
  USING (
    "practiceId" = (SELECT practice_id FROM get_current_practice_user())
    OR id = (SELECT patient_id FROM get_current_patient_user())
  );

-- PatientUser policies - patients can only see themselves
CREATE POLICY patient_user_self_access ON "PatientUser"
  USING (id = (SELECT user_id FROM get_current_patient_user()));

-- Appointment policies
CREATE POLICY appointment_access ON "Appointment"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Appointment"."patientId" 
      AND p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
    )
    OR EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Appointment"."patientId" 
      AND p.id = (SELECT patient_id FROM get_current_patient_user())
    )
  );

-- Message policies
CREATE POLICY message_access ON "Message"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Message"."patientId" 
      AND p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
    )
    OR EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Message"."patientId" 
      AND p.id = (SELECT patient_id FROM get_current_patient_user())
    )
  );

-- AuditLog policies - only practice users can see their practice logs
CREATE POLICY audit_log_practice_access ON "AuditLog"
  USING ("practiceId" = (SELECT practice_id FROM get_current_practice_user()));

-- Task policies
CREATE POLICY task_access ON "Task"
  USING (
    "assignedToId" = (SELECT user_id FROM get_current_practice_user())
    OR EXISTS (
      SELECT 1 FROM "PracticeUser" pu 
      WHERE pu.id = "assignedToId" 
      AND pu."practiceId" = (SELECT practice_id FROM get_current_practice_user())
    )
  );

-- Note policies
CREATE POLICY note_access ON "Note"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Note"."patientId" 
      AND p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
    )
    OR EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Note"."patientId" 
      AND p.id = (SELECT patient_id FROM get_current_patient_user())
    )
  );

-- Prescription policies
CREATE POLICY prescription_access ON "Prescription"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Prescription"."patientId" 
      AND p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
    )
    OR EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Prescription"."patientId" 
      AND p.id = (SELECT patient_id FROM get_current_patient_user())
    )
  );

-- Invoice policies
CREATE POLICY invoice_access ON "Invoice"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Invoice"."patientId" 
      AND p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
    )
    OR EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Invoice"."patientId" 
      AND p.id = (SELECT patient_id FROM get_current_patient_user())
    )
  );

-- Apply similar patterns to all other patient-related tables
CREATE POLICY payment_access ON "Payment"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Payment"."patientId" 
      AND (p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
           OR p.id = (SELECT patient_id FROM get_current_patient_user()))
    )
  );

CREATE POLICY treatment_access ON "Treatment"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Treatment"."patientId" 
      AND (p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
           OR p.id = (SELECT patient_id FROM get_current_patient_user()))
    )
  );

CREATE POLICY referral_access ON "Referral"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Referral"."patientId" 
      AND (p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
           OR p.id = (SELECT patient_id FROM get_current_patient_user()))
    )
  );

CREATE POLICY reminder_access ON "Reminder"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Reminder"."patientId" 
      AND (p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
           OR p.id = (SELECT patient_id FROM get_current_patient_user()))
    )
  );

CREATE POLICY xray_access ON "Xray"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Xray"."patientId" 
      AND (p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
           OR p.id = (SELECT patient_id FROM get_current_patient_user()))
    )
  );

CREATE POLICY document_access ON "Document"
  USING (
    EXISTS (
      SELECT 1 FROM "Patient" p 
      WHERE p.id = "Document"."patientId" 
      AND (p."practiceId" = (SELECT practice_id FROM get_current_practice_user())
           OR p.id = (SELECT patient_id FROM get_current_patient_user()))
    )
  );

-- Admin override policies (restrictive)
CREATE POLICY admin_override ON "Practice" AS RESTRICTIVE
  USING (
    (SELECT role FROM get_current_practice_user()) IN ('ADMIN', 'MANAGER')
    OR current_setting('app.bypass_rls', true)::boolean = true
  );