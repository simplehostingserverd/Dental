"use client";

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, Loader2 } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
  showFlag?: boolean;
  showLabel?: boolean;
}

export function LanguageSwitcher({ 
  variant = 'default',
  className,
  showFlag = true,
  showLabel = true
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations('language');
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return;

    startTransition(() => {
      // Remove current locale from pathname if it exists
      const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      
      // Add new locale to pathname (except for default locale)
      const newPathname = newLocale === 'en' 
        ? pathnameWithoutLocale 
        : `/${newLocale}${pathnameWithoutLocale}`;

      // Store language preference
      localStorage.setItem('preferred-language', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax`;

      // Navigate to new URL
      router.push(newPathname);
      router.refresh();
    });

    setIsOpen(false);
  };

  const getCurrentLanguageDisplay = () => {
    const flag = showFlag ? localeFlags[locale] : '';
    const label = showLabel ? localeNames[locale] : '';
    
    if (variant === 'icon-only') {
      return <Globe className="h-4 w-4" />;
    }
    
    if (variant === 'compact') {
      return (
        <div className="flex items-center gap-1">
          {flag && <span className="text-sm">{flag}</span>}
          <span className="text-sm font-medium">{locale.toUpperCase()}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {flag && <span>{flag}</span>}
        {label && <span className="font-medium">{label}</span>}
        {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
      </div>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={variant === 'compact' ? 'sm' : 'default'}
          className={cn(
            "gap-2",
            variant === 'icon-only' && "w-9 px-0",
            className
          )}
          disabled={isPending}
        >
          {getCurrentLanguageDisplay()}
          {variant !== 'icon-only' && !isPending && (
            <Globe className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((availableLocale) => (
          <DropdownMenuItem
            key={availableLocale}
            onClick={() => switchLanguage(availableLocale)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{localeFlags[availableLocale]}</span>
              <span>{localeNames[availableLocale]}</span>
            </div>
            {availableLocale === locale && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Compact language toggle for mobile/small spaces
 */
export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const newLocale: Locale = locale === 'en' ? 'es' : 'en';
    
    startTransition(() => {
      const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      const newPathname = newLocale === 'en' 
        ? pathnameWithoutLocale 
        : `/${newLocale}${pathnameWithoutLocale}`;

      localStorage.setItem('preferred-language', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax`;

      router.push(newPathname);
      router.refresh();
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      disabled={isPending}
      className="gap-2 text-sm"
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <>
          <span>{localeFlags[locale]}</span>
          <span className="font-medium">{locale.toUpperCase()}</span>
        </>
      )}
    </Button>
  );
}

/**
 * Language badge for status display
 */
export function LanguageBadge() {
  const locale = useLocale() as Locale;
  
  return (
    <Badge variant="secondary" className="gap-1">
      <span>{localeFlags[locale]}</span>
      <span className="text-xs">{localeNames[locale]}</span>
    </Badge>
  );
}

/**
 * Language settings component for settings pages
 */
export function LanguageSettings() {
  const locale = useLocale() as Locale;
  const t = useTranslations('language');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [autoTranslate, setAutoTranslate] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auto-translate') === 'true';
    }
    return false;
  });

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) return;

    startTransition(() => {
      const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      const newPathname = newLocale === 'en' 
        ? pathnameWithoutLocale 
        : `/${newLocale}${pathnameWithoutLocale}`;

      localStorage.setItem('preferred-language', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax`;

      router.push(newPathname);
      router.refresh();
    });
  };

  const handleAutoTranslateChange = (enabled: boolean) => {
    setAutoTranslate(enabled);
    localStorage.setItem('auto-translate', enabled.toString());
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{t('languageSettings')}</h3>
        <p className="text-sm text-gray-600">
          Choose your preferred language for the application interface.
        </p>
      </div>

      <div className="space-y-3">
        {locales.map((availableLocale) => (
          <div
            key={availableLocale}
            className={cn(
              "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
              locale === availableLocale 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => handleLanguageChange(availableLocale)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{localeFlags[availableLocale]}</span>
              <div>
                <div className="font-medium">{localeNames[availableLocale]}</div>
                <div className="text-sm text-gray-500">
                  {availableLocale === 'en' ? 'English (US)' : 'Español (ES)'}
                </div>
              </div>
            </div>
            {locale === availableLocale && (
              <Check className="h-5 w-5 text-blue-600" />
            )}
          </div>
        ))}
      </div>

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Switching language...
        </div>
      )}
    </div>
  );
}
