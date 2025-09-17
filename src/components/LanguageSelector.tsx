import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mni", name: "Manipuri", nativeName: "ꯃꯤꯇꯩ ꯂꯣꯟ" },
];

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    onLanguageChange?.(language.code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {selectedLanguage.code.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language)}
            className={selectedLanguage.code === language.code ? "bg-accent" : ""}
          >
            <div className="flex items-center justify-between w-full">
              <span>{language.name}</span>
              <span className="text-muted-foreground text-xs ml-2">
                {language.nativeName}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}