import { useTranslations } from 'next-intl';

export function useAppTranslations() {
  const t = useTranslations();
  
  return {
    // Common translations
    common: (key: string) => t(`common.${key}`),
    
    // Navigation translations
    navigation: (key: string) => t(`navigation.${key}`),
    
    // Auth translations
    auth: (key: string) => t(`auth.${key}`),
    
    // Dashboard translations
    dashboard: (key: string) => t(`dashboard.${key}`),
    
    // Appointments translations
    appointments: (key: string) => t(`appointments.${key}`),
    
    // Patients translations
    patients: (key: string) => t(`patients.${key}`),
    
    // Billing translations
    billing: (key: string) => t(`billing.${key}`),
    
    // Messages translations
    messages: (key: string) => t(`messages.${key}`),
    
    // Homepage translations
    homepage: (key: string) => t(`homepage.${key}`),
    
    // Raw translation function for custom keys
    t,
  };
}
