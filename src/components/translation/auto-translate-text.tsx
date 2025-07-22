"use client";

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { SmartTranslationService } from '@/lib/translation/smart-translation-service';
import { Loader2, Languages } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AutoTranslateTextProps {
  children: string;
  practiceId: string;
  className?: string;
  showLoader?: boolean;
  showOriginal?: boolean;
  fallbackToStatic?: boolean;
  useCache?: boolean;
  maxCacheAge?: number;
}

export function AutoTranslateText({
  children,
  practiceId,
  className,
  showLoader = true,
  showOriginal = false,
  fallbackToStatic = true,
  useCache = true,
  maxCacheAge = 24 * 60 * 60 * 1000 // 24 hours
}: AutoTranslateTextProps) {
  const locale = useLocale();
  const [translatedText, setTranslatedText] = useState<string>(children);
  const [isLoading, setIsLoading] = useState(false);
  const [showOriginalText, setShowOriginalText] = useState(false);
  const [translationService, setTranslationService] = useState<SmartTranslationService | null>(null);

  // Initialize translation service
  useEffect(() => {
    const service = new SmartTranslationService({
      practiceId,
      targetLanguage: locale,
      useCache,
      fallbackToStatic,
      maxCacheAge
    });
    setTranslationService(service);
  }, [practiceId, locale, useCache, fallbackToStatic, maxCacheAge]);

  // Translate text when locale or text changes
  useEffect(() => {
    if (!translationService || locale === 'en' || !children) {
      setTranslatedText(children);
      return;
    }

    const translateText = async () => {
      setIsLoading(true);
      try {
        const translated = await translationService.translate(children);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(children);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [children, locale, translationService]);

  const toggleOriginal = useCallback(() => {
    setShowOriginalText(!showOriginalText);
  }, [showOriginalText]);

  if (locale === 'en') {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={cn("relative", className)}>
      {isLoading && showLoader ? (
        <span className="inline-flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          {children}
        </span>
      ) : (
        <>
          {showOriginalText ? children : translatedText}
          {showOriginal && translatedText !== children && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0 text-xs opacity-50 hover:opacity-100"
              onClick={toggleOriginal}
            >
              <Languages className="h-3 w-3" />
            </Button>
          )}
        </>
      )}
    </span>
  );
}

/**
 * Bulk translator component for translating multiple texts
 */
interface BulkTranslatorProps {
  texts: string[];
  practiceId: string;
  onTranslated?: (translations: string[]) => void;
  children: (translations: string[], isLoading: boolean) => React.ReactNode;
}

export function BulkTranslator({
  texts,
  practiceId,
  onTranslated,
  children
}: BulkTranslatorProps) {
  const locale = useLocale();
  const [translations, setTranslations] = useState<string[]>(texts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locale === 'en' || texts.length === 0) {
      setTranslations(texts);
      onTranslated?.(texts);
      return;
    }

    const translateTexts = async () => {
      setIsLoading(true);
      try {
        const service = new SmartTranslationService({
          practiceId,
          targetLanguage: locale,
          useCache: true,
          fallbackToStatic: true,
          maxCacheAge: 24 * 60 * 60 * 1000
        });

        const translated = await service.batchTranslate(texts);
        setTranslations(translated);
        onTranslated?.(translated);
      } catch (error) {
        console.error('Bulk translation error:', error);
        setTranslations(texts);
        onTranslated?.(texts);
      } finally {
        setIsLoading(false);
      }
    };

    translateTexts();
  }, [texts, locale, practiceId, onTranslated]);

  return <>{children(translations, isLoading)}</>;
}

/**
 * Translation status indicator
 */
interface TranslationStatusProps {
  practiceId: string;
  className?: string;
}

export function TranslationStatus({ practiceId, className }: TranslationStatusProps) {
  const locale = useLocale();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const service = new SmartTranslationService({
          practiceId,
          targetLanguage: locale,
          useCache: true,
          fallbackToStatic: true,
          maxCacheAge: 24 * 60 * 60 * 1000
        });

        const available = await service.isServiceAvailable();
        setIsAvailable(available);
      } catch {
        setIsAvailable(false);
      }
    };

    if (locale !== 'en') {
      checkAvailability();
    } else {
      setIsAvailable(null);
    }
  }, [locale, practiceId]);

  if (locale === 'en' || isAvailable === null) {
    return null;
  }

  return (
    <Badge 
      variant={isAvailable ? "default" : "secondary"} 
      className={cn("gap-1", className)}
    >
      <Languages className="h-3 w-3" />
      {isAvailable ? "Translation Active" : "Translation Offline"}
    </Badge>
  );
}

/**
 * Medical term translator with high accuracy
 */
interface MedicalTermTranslatorProps {
  term: string;
  practiceId: string;
  className?: string;
  showTooltip?: boolean;
}

export function MedicalTermTranslator({
  term,
  practiceId,
  className,
  showTooltip = true
}: MedicalTermTranslatorProps) {
  const locale = useLocale();
  const [translatedTerm, setTranslatedTerm] = useState<string>(term);
  const [isLoading, setIsLoading] = useState(false);
  const [translationSource, setTranslationSource] = useState<'static' | 'api' | 'fallback' | null>(null);

  useEffect(() => {
    if (locale === 'en' || !term) {
      setTranslatedTerm(term);
      return;
    }

    const translateTerm = async () => {
      setIsLoading(true);
      try {
        const service = new SmartTranslationService({
          practiceId,
          targetLanguage: locale,
          useCache: true,
          fallbackToStatic: true,
          maxCacheAge: 7 * 24 * 60 * 60 * 1000 // 7 days for medical terms
        });

        const translated = await service.translate(term);
        setTranslatedTerm(translated);
        
        // Check cache to determine source
        const stats = service.getCacheStats();
        if (stats.staticEntries > 0) {
          setTranslationSource('static');
        } else if (stats.apiEntries > 0) {
          setTranslationSource('api');
        } else {
          setTranslationSource('fallback');
        }
      } catch (error) {
        console.error('Medical term translation error:', error);
        setTranslatedTerm(term);
        setTranslationSource(null);
      } finally {
        setIsLoading(false);
      }
    };

    translateTerm();
  }, [term, locale, practiceId]);

  if (locale === 'en') {
    return <span className={className}>{term}</span>;
  }

  return (
    <span className={cn("relative", className)}>
      {isLoading ? (
        <span className="inline-flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          {term}
        </span>
      ) : (
        <>
          {translatedTerm}
          {showTooltip && translationSource === 'static' && (
            <Badge variant="outline" className="ml-1 text-xs">
              Medical
            </Badge>
          )}
        </>
      )}
    </span>
  );
}

/**
 * Hook for using smart translation in components
 */
export function useSmartTranslation(practiceId: string) {
  const locale = useLocale();
  const [service, setService] = useState<SmartTranslationService | null>(null);

  useEffect(() => {
    const translationService = new SmartTranslationService({
      practiceId,
      targetLanguage: locale,
      useCache: true,
      fallbackToStatic: true,
      maxCacheAge: 24 * 60 * 60 * 1000
    });
    setService(translationService);
  }, [practiceId, locale]);

  const translate = useCallback(async (text: string): Promise<string> => {
    if (!service || locale === 'en') return text;
    return await service.translate(text);
  }, [service, locale]);

  const batchTranslate = useCallback(async (texts: string[]): Promise<string[]> => {
    if (!service || locale === 'en') return texts;
    return await service.batchTranslate(texts);
  }, [service, locale]);

  return {
    translate,
    batchTranslate,
    isEnglish: locale === 'en',
    isSpanish: locale === 'es',
    locale
  };
}
