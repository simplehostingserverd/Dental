"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { type Locale } from '@/lib/i18n/config';

/**
 * Smart translation hook that combines next-intl with fallback logic
 */
export function useSmartTranslation() {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  /**
   * Get translation with fallback to key if not found
   */
  const translate = useCallback((key: string, fallback?: string): string => {
    try {
      // Try to get translation from next-intl
      const translation = t(key);
      
      // If translation is the same as key, it wasn't found
      if (translation === key) {
        return fallback || key;
      }
      
      return translation;
    } catch (error) {
      // If translation fails, return fallback or key
      return fallback || key;
    }
  }, [t]);

  /**
   * Get translation with parameters
   */
  const translateWithParams = useCallback((
    key: string, 
    params: Record<string, string | number>,
    fallback?: string
  ): string => {
    try {
      const translation = t(key, params);
      
      if (translation === key) {
        return fallback || key;
      }
      
      return translation;
    } catch (error) {
      return fallback || key;
    }
  }, [t]);

  /**
   * Get nested translation (e.g., 'common.save')
   */
  const translateNested = useCallback((
    namespace: string,
    key: string,
    fallback?: string
  ): string => {
    try {
      const namespaceTranslations = useTranslations(namespace);
      const translation = namespaceTranslations(key);
      
      if (translation === key) {
        return fallback || key;
      }
      
      return translation;
    } catch (error) {
      return fallback || key;
    }
  }, []);

  /**
   * Check if current locale is Spanish
   */
  const isSpanish = useMemo(() => locale === 'es', [locale]);

  /**
   * Check if current locale is English
   */
  const isEnglish = useMemo(() => locale === 'en', [locale]);

  /**
   * Get current locale
   */
  const currentLocale = useMemo(() => locale, [locale]);

  /**
   * Format date according to current locale
   */
  const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  }, [locale]);

  /**
   * Format time according to current locale
   */
  const formatTime = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  }, [locale]);

  /**
   * Format currency according to current locale
   */
  const formatCurrency = useCallback((
    amount: number, 
    currency: string = 'USD',
    options?: Intl.NumberFormatOptions
  ): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      ...options
    };

    return new Intl.NumberFormat(locale, defaultOptions).format(amount);
  }, [locale]);

  /**
   * Format number according to current locale
   */
  const formatNumber = useCallback((
    number: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    return new Intl.NumberFormat(locale, options).format(number);
  }, [locale]);

  /**
   * Get common translations
   */
  const common = useMemo(() => {
    const commonT = useTranslations('common');
    return {
      save: commonT('save'),
      cancel: commonT('cancel'),
      delete: commonT('delete'),
      edit: commonT('edit'),
      add: commonT('add'),
      search: commonT('search'),
      filter: commonT('filter'),
      loading: commonT('loading'),
      error: commonT('error'),
      success: commonT('success'),
      warning: commonT('warning'),
      confirm: commonT('confirm'),
      yes: commonT('yes'),
      no: commonT('no'),
      ok: commonT('ok'),
      close: commonT('close'),
      back: commonT('back'),
      next: commonT('next'),
      submit: commonT('submit'),
      reset: commonT('reset')
    };
  }, []);

  /**
   * Get navigation translations
   */
  const navigation = useMemo(() => {
    const navT = useTranslations('navigation');
    return {
      dashboard: navT('dashboard'),
      appointments: navT('appointments'),
      patients: navT('patients'),
      charting: navT('charting'),
      treatmentPlans: navT('treatmentPlans'),
      billing: navT('billing'),
      imaging: navT('imaging'),
      prescriptions: navT('prescriptions'),
      messages: navT('messages'),
      settings: navT('settings'),
      receptionist: navT('receptionist'),
      reports: navT('reports'),
      analytics: navT('analytics')
    };
  }, []);

  /**
   * Get dental procedure translations
   */
  const dentalProcedures = useMemo(() => {
    const dentalT = useTranslations('dental.procedures');
    return {
      cleaning: dentalT('cleaning'),
      filling: dentalT('filling'),
      crown: dentalT('crown'),
      bridge: dentalT('bridge'),
      implant: dentalT('implant'),
      extraction: dentalT('extraction'),
      rootCanal: dentalT('rootCanal'),
      whitening: dentalT('whitening'),
      orthodontics: dentalT('orthodontics'),
      periodontics: dentalT('periodontics'),
      oralSurgery: dentalT('oralSurgery')
    };
  }, []);

  /**
   * Get appointment status translations
   */
  const appointmentStatuses = useMemo(() => {
    const appointmentT = useTranslations('appointments');
    return {
      scheduled: appointmentT('scheduled'),
      confirmed: appointmentT('confirmed'),
      inProgress: appointmentT('inProgress'),
      completed: appointmentT('completed'),
      cancelled: appointmentT('cancelled'),
      noShow: appointmentT('noShow'),
      arrived: appointmentT('arrived'),
      waiting: appointmentT('waiting')
    };
  }, []);

  return {
    // Core translation functions
    translate,
    translateWithParams,
    translateNested,
    t, // Direct access to next-intl translate function
    
    // Locale information
    locale: currentLocale,
    isSpanish,
    isEnglish,
    
    // Formatting functions
    formatDate,
    formatTime,
    formatCurrency,
    formatNumber,
    
    // Pre-translated common terms
    common,
    navigation,
    dentalProcedures,
    appointmentStatuses
  };
}

/**
 * Hook for translating dynamic content with auto-fallback
 */
export function useTranslateText(text: string, namespace?: string): string {
  const { translate, translateNested } = useSmartTranslation();
  
  if (namespace) {
    return translateNested(namespace, text, text);
  }
  
  return translate(text, text);
}

/**
 * Hook for getting localized date/time formatters
 */
export function useLocalizedFormatters() {
  const { formatDate, formatTime, formatCurrency, formatNumber, locale } = useSmartTranslation();
  
  return {
    formatDate,
    formatTime,
    formatCurrency,
    formatNumber,
    locale,
    
    // Specific formatters for dental app
    formatAppointmentDate: (date: Date | string) => formatDate(date, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    formatAppointmentTime: (date: Date | string) => formatTime(date, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    formatShortDate: (date: Date | string) => formatDate(date, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    formatPrice: (amount: number) => formatCurrency(amount, 'USD', { 
      minimumFractionDigits: 2 
    })
  };
}
